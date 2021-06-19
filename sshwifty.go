// Sshwifty - A Web SSH client
//
// Copyrighr (C) 2021 Jeffrey H. Johnson <trnsz+banai@pobox.com>
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
	"C"
	"net/http"
	_ "net/http/pprof"
	"os"
	"runtime"
	"runtime/debug"
	_ "runtime/pprof"

	"github.com/arl/statsviz"

	"github.com/BAN-AI-Multics/sshwifty/application"
	"github.com/BAN-AI-Multics/sshwifty/application/commands"
	"github.com/BAN-AI-Multics/sshwifty/application/configuration"
	"github.com/BAN-AI-Multics/sshwifty/application/controller"
	"github.com/BAN-AI-Multics/sshwifty/application/log"
)

func main() {
	debug.FreeOSMemory()
	runtime.GC()
	runtime.GOMAXPROCS(runtime.NumCPU() * 6)
	debug.SetGCPercent(30)

	configLoaders := make([]configuration.Loader, 0, 2)

	if len(os.Getenv("SSHWIFTY_CONFIG")) > 0 {
		configLoaders = append(configLoaders,
			configuration.File(os.Getenv("SSHWIFTY_CONFIG")))
	} else {
		configLoaders = append(configLoaders, configuration.File(""), configuration.Enviro())
	}

	debug.FreeOSMemory()
	runtime.GC()

	statsvizAddr := "[::1]:45666"
	smux := http.NewServeMux()
	statsvizRedirect := http.RedirectHandler("/debug/statsviz", http.StatusSeeOther)
	smux.Handle("/", statsvizRedirect)
	statsviz.Register(smux, statsviz.Root("/debug/statsviz"))
	go func() {
		http.ListenAndServe(statsvizAddr, smux)
	}()

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
	debug.FreeOSMemory()
	runtime.GC()
	os.Exit(1)
}
