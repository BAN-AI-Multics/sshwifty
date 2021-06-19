############################################################################
# vim: filetype=sh:tabstop=4:tw=76

ECHO     ?=    printf '*** %s\n'
NULL      =    >  /dev/null 2>&1
NUL2      =    2> /dev/null
TRUE     ?=    true $(NULL) || { :; }
NEWL      =    printf '%s\n' "" $(NUL2) || $(TRUE)
MAKE     ?=    make
NPMX     ?=    npm "--pre"
QNPM      =    "--quiet" "--no-audit" "--no-fund"
NPMP      =    $(NPMX) --loglevel="error"
NPMD      =    $(NPMX) --loglevel="warn"
RMFR     ?=    rm "-f"
TEST     ?=    test
TOUC     ?=    touch
FIND     ?=    find
GOGO     ?=    go
STRP     ?=    strip
SSTR     ?=    sstrip
GITX     ?=    git

############################################################################

NPMUPP    =    jsupdate
NPMUPD    =    jsupdated
NPMINP    =    jsinstall
NPMIND    =    jsinstalld

############################################################################

#NPMOPT   =    $(NPMUPP)
NPMOPT    =    $(NPMINP)
NPMAFX    =    $(TEST) -f "jsinstall" ||           \
	           $(NPMP)    "audit" "fix" $(QNPM)                || $(TRUE)

############################################################################

JSCONFIG  =    webpack.config.js                   \
	           package.json                        \
	           package-lock.json                   \
	           babel.config.js

############################################################################

NODE_ENV  =

############################################################################

export NODE_ENV

############################################################################

JEMA     = /opt/jemalloc-static/lib/libjemalloc.a

############################################################################

GOSOURCES = $(shell $(FIND) application            \
	                           -name '*.go')       \
							   sshwifty.go

############################################################################

UISOURCES = $(shell $(FIND) ui -name '*.html'      \
	                        -o -name '*.css'       \
	                        -o -name '*.js'        \
	                        -o -name '*.vue'       \
	                        -o -name '*.txt'       \
	                        -o -name '*.svg'       \
	                        -o -name '*.png')

############################################################################

.PHONY: all
sshwifty: $(NPMOPT) $(JSCONFIG) $(GOSOURCES) $(UISOURCES) GNUmakefile
	@$(NEWL)
	@$(ECHO) " Start: sshwifty (build)"                        || $(TRUE)
	@NPMX="$(NPMP)" GOGO="$(GOGO)" GITX="$(GITX)"  \
	 STRP="$(STRP)" SSTR="$(SSTR)" TEST="$(TEST)"  \
	 QNPM="$(QNPM)" ECHO="$(ECHO)"                 \
	 JEMA="$(JEMA)"                                \
	 exec  $(NPMP) "run" "build"
	@$(NEWL)
	@$(ECHO) "Finish: sshwifty (build)"                        || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: testonly test check
testonly test check: sshwifty
	@$(NEWL)
	@$(ECHO) " Start: test"                                    || $(TRUE)
	@GOGO="$(GOGO)" QNPM="$(QNPM)" ECHO="$(ECHO)"  \
	 exec $(NPMX) "run" "testonly"
	@$(NEWL)
	@$(ECHO) "Finish: test"                                    || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: generate generation
generate generation:
	@$(NEWL)
	@$(ECHO) " Start: generation"                              || $(TRUE)
	@GOGO="$(GOGO)" QNPM="$(QNPM)" ECHO="$(ECHO)"  \
	 exec $(NPMP) "run" "generate"
	@$(NEWL)
	@$(ECHO) "Finish: generation"                              || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: clean
clean:
	@$(NEWL)
	@$(ECHO) " Start: Quick cleanup"                           || $(TRUE)
	@TRUE="$(TRUE)" RMFR="$(RMFR)" QNPM="$(QNPM)"  \
	 ECHO="$(ECHO)" exec  $(NPMX)  "run" "clean"
	@$(RMFR) "sshwifty"                                        || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Quick cleanup"                           || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: distclean realclean
distclean realclean: clean
	@$(NEWL)
	@$(ECHO) " Start: Distribution cleanup"                    || $(TRUE)
	@($(TEST) -d "node_modules" &&                 \
	 { $(RMFR) "node_modules" -r                   \
	  || $(TRUE); $(TRUE); } ||                    \
	   $(TRUE))                                                || $(TRUE)
	@$(GOGO) "clean" "-cache" "-testcache" "./..."             || $(TRUE)
	@$(RMFR) "jsinstall"                                       || $(TRUE)
	@$(RMFR) "jsinstalld"                                      || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Distribution cleanup"                    || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstallp
jsinstall:
	@$(NEWL)
	@$(ECHO) " Start: Install production modules"              || $(TRUE)
	@$(TEST) -f "jsinstall" || $(NPMP) "install"     $(QNPM)
#	@$(TEST) -f "jsinstall" || $(NPMP) "audit" "fix" $(QNPM)   || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Install production modules"              || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstalld
jsinstalld:
	@$(NEWL)
	@$(ECHO) " Start: Install development modules"             || $(TRUE)
	@$(TEST) -f "jsinstalld" || $(NPMD) "install"
	@$(TEST) -f "jsinstalld" || $(NPMD) "audit" "fix" $(QNPM)  || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Install development modules"             || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdatep
jsupdate: jsinstall
	@$(NEWL)
	@$(ECHO) " Start: Update production modules"               || $(TRUE)
	@$(RMFR) "jsinstall"                                       || $(TRUE)
	@$(NPMP) "audit" "fix" $(QNPM)                             || $(TRUE)
	@$(NPMP) "update"      $(QNPM)                
	@$(NPMP) "audit" "fix" $(QNPM)                             || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Update production modules"               || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdated
jsupdated: jsinstalld
	@$(NEWL)
	@$(ECHO) " Start: Update development modules"              || $(TRUE)
	@$(RMFR) "jsinstall"                                       || $(TRUE)
	@$(RMFR) "jsinstalld"                                      || $(TRUE)
	@$(NPMD) "audit" "fix" $(QNPM)                             || $(TRUE)
	@$(NPMD) "update"
	@$(NPMD) "audit" "fix" $(QNPM)                             || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Update development modules"              || $(TRUE)
	@$(NEWL)

############################################################################

# Local Variables:
# mode: makefile
# tab-width: 4
# End:
