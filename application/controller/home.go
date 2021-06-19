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

package controller

import (
	"net/http"

	"github.com/BAN-AI-Multics/sshwifty/application/log"
)

// home controller
type home struct {
	baseController
}

func (h home) Get(w http.ResponseWriter, r *http.Request, l log.Logger) error {
	return serveStaticPage("index.html", http.StatusOK, w, r, l)
}
