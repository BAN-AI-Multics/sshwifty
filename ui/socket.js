// Sshwifty - A Web SSH client
//
// Copyright (C) 2019-2021 NI Rui <ranqus@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as crypt from "./crypto.js";
import * as reader from "./stream/reader.js";
import * as sender from "./stream/sender.js";
import * as streams from "./stream/streams.js";
import * as xhr from "./xhr.js";

export const ECHO_FAILED = streams.ECHO_FAILED;

const maxSenderDelay = 200;
const minSenderDelay = 30;

class Dial {
  /**
   * constructor
   *
   * @param {string} address Address to the Websocket server
   * @param {number} Dial timeout
   * @param {object} privateKey String key that will be used to encrypt and
   *                            decrypt socket traffic
   *
   */
  constructor(address, timeout, privateKey) {
    this.address = address;
    this.timeout = timeout;
    this.privateKey = privateKey;
    this.keepAliveTicker = null;
  }

  /**
   * Connect to the remote server
   *
   * @param {string} address Target URL address
   * @param {number} timeout Connect timeout
   *
   * @returns {Promise<WebSocket>} When connection is established
   *
   */
  connect(address, timeout) {
    const self = this;
    return new Promise((resolve, reject) => {
      // const ws = new WebSocket(this.address);
      const ws = new WebSocket(address.webSocket);
      let promised = false;
      const timeoutTimer = setTimeout(() => {
        ws.close();
      }, timeout);
      const myRes = (w) => {
        if (promised) {
          return;
        }

        clearTimeout(timeoutTimer);
        promised = true;

        return resolve(w);
      };
      const myRej = (e) => {
        if (promised) {
          return;
        }

        clearTimeout(timeoutTimer);
        promised = true;

        return reject(e);
      };

      if (!self.keepAliveTicker) {
        self.keepAliveTicker = setInterval(() => {
          xhr.options(address.keepAlive, {});
        }, self.timeout);
      }

      ws.addEventListener("open", (_event) => {
        myRes(ws);
      });

      ws.addEventListener("close", (event) => {
        event.toString = () => {
          return "WebSocket Error (" + event.code + ")";
        };

        myRej(event);
        clearInterval(self.keepAliveTicker);
        self.keepAliveTicker = null;
      });

      ws.addEventListener("error", (_event) => {
        ws.close();
        clearInterval(self.keepAliveTicker);
        self.keepAliveTicker = null;
      });
    });
  }

  /**
   * Build an socket encrypt and decrypt key string
   *
   */
  async buildKeyString() {
    return this.privateKey.fetch();
  }

  /**
   * Build encrypt and decrypt key
   *
   */
  async buildKey() {
    const kStr = await this.buildKeyString();

    return await crypt.buildGCMKey(kStr);
  }

  /**
   * Connect to the server
   *
   * @param {object} callbacks Callbacks
   *
   * @returns {object} A pair of ReadWriter which can be used to read and
   *                   send data to the underlaying websocket connection
   *
   */
  async dial(callbacks) {
    // const ws = await this.connect(this.timeout);
    const ws = await this.connect(this.address, this.timeout);

    try {
      const rd = new reader.Reader(new reader.Multiple(() => {}), (data) => {
        return new Promise((resolve) => {
          const bufferReader = new FileReader();

          bufferReader.onload = (event) => {
            const d = new Uint8Array(event.target.result);

            resolve(d);

            callbacks.inboundUnpacked(d);
          };

          bufferReader.readAsArrayBuffer(data);
        });
      });

      ws.addEventListener("message", (event) => {
        callbacks.inbound(event.data);

        rd.feed(event.data);
      });

      ws.addEventListener("error", (event) => {
        event.toString = () => {
          return (
            "WebSocket Error (" + (event.code ? event.code : "Unknown") + ")"
          );
        };

        rd.closeWithReason(event);
      });

      ws.addEventListener("close", (_event) => {
        rd.closeWithReason("Connection is closed");
      });

      let sdDataConvert = (rawData) => {
        return rawData;
      };
      const getSdDataConvert = () => {
        return sdDataConvert;
      };
      const sd = new sender.Sender(
        async (rawData) => {
          try {
            const data = await getSdDataConvert()(rawData);

            ws.send(data.buffer);
            callbacks.outbound(data);
          } catch (e) {
            ws.close();
            rd.closeWithReason(e);
/*
            if (process.env.NODE_ENV === "development") {
              console.error(e);
            }
*/
            throw e;
          }
        },
        4096 - 64, // Server has a 4096 bytes receive buffer, can be no greater,
        minSenderDelay, // 30ms input delay
        10 // max 10 buffered requests
      );

      const senderNonce = crypt.generateNonce();
      sd.send(senderNonce);

      const receiverNonce = await reader.readN(rd, crypt.GCMNonceSize);

      const key = await this.buildKey();

      sdDataConvert = async (rawData) => {
        const encoded = await crypt.encryptGCM(key, senderNonce, rawData);

        crypt.increaseNonce(senderNonce);

        const dataToSend = new Uint8Array(encoded.byteLength + 2);

        dataToSend[0] = (encoded.byteLength >> 8) & 0xff;
        dataToSend[1] = encoded.byteLength & 0xff;

        dataToSend.set(new Uint8Array(encoded), 2);

        return dataToSend;
      };

      const cgmReader = new reader.Multiple(async (r) => {
        try {
          const dSizeBytes = await reader.readN(rd, 2);
          let dSize = 0;

          dSize = dSizeBytes[0];
          dSize <<= 8;
          dSize |= dSizeBytes[1];

          const decoded = await crypt.decryptGCM(
            key,
            receiverNonce,
            await reader.readN(rd, dSize)
          );

          crypt.increaseNonce(receiverNonce);

          r.feed(
            new reader.Buffer(new Uint8Array(decoded), () => {}),
            () => {}
          );
        } catch (e) {
          r.closeWithReason(e);
        }
      });

      return {
        reader: cgmReader,
        sender: sd,
        ws: ws,
      };
    } catch (e) {
      ws.close();
      throw e;
    }
  }
}

export class Socket {
  /**
   * constructor
   *
   * @param {string} address Address of the WebSocket server
   * @param {object} privateKey String key that will be used to encrypt and
   *                            decrypt socket traffic
   * @param {number} timeout Dial timeout
   * @param {number} echoInterval Echo interval
   */
  constructor(address, privateKey, timeout, echoInterval) {
    this.dial = new Dial(address, timeout, privateKey);
    this.echoInterval = echoInterval;
    this.streamHandler = null;
  }

  /**
   * Return a stream handler
   *
   * @param {object} callbacks A group of callbacks to call when needed
   *
   * @returns {Promise<streams.Streams>} The stream manager
   *
   */
  async get(callbacks) {
    const self = this;

    if (this.streamHandler) {
      return this.streamHandler;
    }

    callbacks.connecting();

    const receiveToPauseFactor = 6;
    const minReceivedToPause = 1024 * 16;

    let streamPaused = false;
    let currentReceived = 0;
    let currentUnpacked = 0;

    const shouldPause = () => {
      return (
        currentReceived > minReceivedToPause &&
        currentReceived > currentUnpacked * receiveToPauseFactor
      );
    };

    try {
      const conn = await this.dial.dial({
        inbound(data) {
          currentReceived += data.size;

          callbacks.traffic(data.size, 0);
        },
        inboundUnpacked(data) {
          currentUnpacked += data.length;

          if (currentUnpacked >= currentReceived) {
            currentUnpacked = 0;
            currentReceived = 0;
          }

          if (self.streamHandler !== null) {
            if (streamPaused && !shouldPause()) {
              streamPaused = false;
              self.streamHandler.resume();
            } else if (!streamPaused && shouldPause()) {
              streamPaused = true;
              self.streamHandler.pause();
            }
          }
        },
        outbound(data) {
          callbacks.traffic(0, data.length);
        },
      });

      const streamHandler = new streams.Streams(conn.reader, conn.sender, {
        echoInterval: self.echoInterval,
        echoUpdater(delay) {
          const sendDelay = delay / 2;

          if (sendDelay > maxSenderDelay) {
            conn.sender.setDelay(maxSenderDelay);
          } else if (sendDelay < minSenderDelay) {
            conn.sender.setDelay(minSenderDelay);
          } else {
            conn.sender.setDelay(sendDelay);
          }

          return callbacks.echo(delay);
        },
        cleared(e) {
          if (self.streamHandler === null) {
            return;
          }

          self.streamHandler = null;

          // Close connection first otherwise we may
          // risk sending things out
          conn.ws.close();
          callbacks.close(e);
        },
      });

      callbacks.connected();

      streamHandler.serve().catch((e) => {
        if (process.env.NODE_ENV !== "development") {
          return;
        }

        //console.trace(e);
      });

      this.streamHandler = streamHandler;
    } catch (e) {
      callbacks.failed(e);

      throw e;
    }

    return this.streamHandler;
  }
}
