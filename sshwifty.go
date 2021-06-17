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

/*
#cgo LDFLAGS: -ljemalloc
*/
package main

import (
	"os"
	"C"
	"github.com/BAN-AI-Multics/sshwifty/application"
	"github.com/BAN-AI-Multics/sshwifty/application/commands"
	"github.com/BAN-AI-Multics/sshwifty/application/configuration"
	"github.com/BAN-AI-Multics/sshwifty/application/controller"
	"github.com/BAN-AI-Multics/sshwifty/application/log"
)

func main() {
	configLoaders := make([]configuration.Loader, 0, 2)

	if len(os.Getenv("SSHWIFTY_CONFIG")) > 0 {
		configLoaders = append(configLoaders,
			configuration.File(os.Getenv("SSHWIFTY_CONFIG")))
	} else {
		configLoaders = append(configLoaders, configuration.File(""), configuration.Enviro())
	}

	e := application.
		New(os.Stderr, log.NewDebugOrNonDebugWriter(
			len(os.Getenv("SSHWIFTY_DEBUG")) > 0, application.Name, os.Stderr)).
		Run(configuration.Redundant(configLoaders...),
			application.DefaultProccessSignallerBuilder,
			commands.New(),
			controller.Builder)

	if e == nil {
		return
	}

	os.Exit(1)
}
