// Sshwifty - A Web SSH client
//
// Copyright (C) 2021 Jeffrey H. Johnson <trnsz+banai@pobox.com>
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

package network

import (
	"net"
	"time"
)

// Dial dial to remote machine
type Dial func(
	network, address string, timeout time.Duration) (net.Conn, error)

// TCPDial build a TCP dialer
func TCPDial() Dial {
	return net.DialTimeout
}
