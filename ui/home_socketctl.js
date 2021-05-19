import * as history from "./history.js";
import { ECHO_FAILED } from "./socket.js";

export function build(ctx) {
  const connectionStatusNotConnected = "Ready to connect";
  const connectionStatusConnecting =
    "Connecting to server...";
  const connectionStatusDisconnected =
    "Disconnected from server";
  const connectionStatusConnected =
    "Connected to server";
  const connectionStatusUnmeasurable =
    "Connection failure";

  const connectionDelayGood =
    "Excellent link quality.";
  const connectionDelayFair =
    "Good link quality.";
  const connectionDelayMedian =
    "Fair link quality.";
  const connectionDelayHeavy =
    "Very poor link quality!";

  const buildEmptyHistory = () => {
    const r = [];

    for (let i = 0; i < 32; i++) {
      r.push({ data: 0, class: "" });
    }

    return r;
  };

  let isClosed = false;
  let inboundPerSecond = 0;
  let outboundPerSecond = 0;
  let trafficPreSecondNextUpdate = new Date();
  let inboundPre10Seconds = 0;
  let outboundPre10Seconds = 0;
  let trafficPre10sNextUpdate = new Date();
  const inboundHistory = new history.Records(buildEmptyHistory());
  const outboundHistory = new history.Records(buildEmptyHistory());
  let trafficSamples = 0;

  const delayHistory = new history.Records(buildEmptyHistory());
  let delaySamples = 0;
  let delayPerInterval = 0;

  return {
    update(time) {
      if (isClosed) {
        return;
      }

      if (time >= trafficPreSecondNextUpdate) {
        trafficPreSecondNextUpdate = new Date(time.getTime() + 1000);
        inboundPre10Seconds += inboundPerSecond;
        outboundPre10Seconds += outboundPerSecond;

        this.status.inbound = inboundPerSecond;
        this.status.outbound = outboundPerSecond;

        inboundPerSecond = 0;
        outboundPerSecond = 0;

        trafficSamples++;
      }

      if (time >= trafficPre10sNextUpdate) {
        trafficPre10sNextUpdate = new Date(time.getTime() + 10000);

        if (trafficSamples > 0) {
          inboundHistory.update(inboundPre10Seconds / trafficSamples);
          outboundHistory.update(outboundPre10Seconds / trafficSamples);

          inboundPre10Seconds = 0;
          outboundPre10Seconds = 0;
          trafficSamples = 0;
        }

        if (delaySamples > 0) {
          delayHistory.update(delayPerInterval / delaySamples);

          delaySamples = 0;
          delayPerInterval = 0;
        }
      }
    },
    classStyle: "",
    windowClass: "",
    message: "",
    status: {
      description: connectionStatusNotConnected,
      delay: 0,
      delayHistory: delayHistory.get(),
      inbound: 0,
      inboundHistory: inboundHistory.get(),
      outbound: 0,
      outboundHistory: outboundHistory.get(),
    },
    connecting() {
      isClosed = false;

      this.message = "--";
      this.classStyle = "working";
      this.windowClass = "";
      this.status.description = connectionStatusConnecting;
    },
    connected() {
      isClosed = false;

      this.message = "??";
      this.classStyle = "working";
      this.windowClass = "";
      this.status.description = connectionStatusConnected;
    },
    traffic(inb, outb) {
      inboundPerSecond += inb;
      outboundPerSecond += outb;
    },
    echo(delay) {
      delayPerInterval += delay > 0 ? delay : 0;
      delaySamples++;

      if (delay == ECHO_FAILED) {
        this.status.delay = -1;
        this.message = "";
        this.classStyle = "red flash";
        this.windowClass = "red";
        this.status.description = connectionStatusUnmeasurable;

        return;
      }

      const avgDelay = Math.round(delayPerInterval / delaySamples);

      this.message = Number(avgDelay).toLocaleString() + "ms";
      this.status.delay = avgDelay;

      if (avgDelay < 30) {
        this.classStyle = "green";
        this.windowClass = "green";
        this.status.description =
          connectionStatusConnected + ". " + connectionDelayGood;
      } else if (avgDelay < 100) {
        this.classStyle = "yellow";
        this.windowClass = "yellow";
        this.status.description =
          connectionStatusConnected + ". " + connectionDelayFair;
      } else if (avgDelay < 300) {
        this.classStyle = "orange";
        this.windowClass = "orange";
        this.status.description =
          connectionStatusConnected + ". " + connectionDelayMedian;
      } else {
        this.classStyle = "red";
        this.windowClass = "red";
        this.status.description =
          connectionStatusConnected + ". " + connectionDelayHeavy;
      }
    },
    close(e) {
      isClosed = true;
      delayHistory.expire();
      inboundHistory.expire();
      outboundHistory.expire();

      ctx.connector.inputting = false;

      if (e === null) {
        this.message = "";
        this.classStyle = "";
        this.status.description = connectionStatusDisconnected;

        return;
      }

      this.status.delay = -1;
      this.message = "ERR";
      this.classStyle = "red flash";
      this.windowClass = "red";
      this.status.description = connectionStatusDisconnected + ": " + e;
    },
    failed(e) {
      isClosed = true;

      ctx.connector.inputting = false;

      if (e.code) {
        this.message = "E" + e.code;
      } else {
        this.message = "E????";
      }

      this.status.delay = -1;
      this.classStyle = "red flash";
      this.windowClass = "red";
      this.status.description = connectionStatusDisconnected + ". Error: " + e;
    },
  };
}
