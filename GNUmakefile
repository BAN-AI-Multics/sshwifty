############################################################################

ECHO ?= printf '*** %s\n'
NULL ?=  > /dev/null 2>&1
NUL2 ?= 2> /dev/null
TRUE ?= true $(NULL) || { :; }
NEWL ?= printf '%s\n' "" $(NUL2) || $(TRUE)
MAKE ?= make
NPMX ?= npm
NPMP ?= NODE_ENV= $(NPMX)
NPMD ?= NODE_ENV= $(NPMX)
RMFR ?= $(NULL) rm -f
TEST ?= test
TOUC ?= touch
FIND ?= find
GOGO ?= go

############################################################################

NPMUPP   = jsupdate
NPMUPD   = jsupdated
NPMINP   = jsinstall
NPMIND   = jsinstalld
#NPMOPT  = $(NPMUPP)
NPMOPT   = $(NPMINP)

############################################################################

JSCONFIG = webpack.config.js \
		   package.json \
		   package-lock.json \
		   babel.config.js

############################################################################

GOSOURCES = $(shell $(FIND) application       \
	                           -name '*.go')
UISOURCES = $(shell $(FIND) ui -name '*.html' \
	                        -o -name '*.css'  \
	                        -o -name '*.js'   \
	                        -o -name '*.vue'  \
	                        -o -name '*.txt'  \
	                        -o -name '*.svg'  \
	                        -o -name '*.png')

############################################################################

.PHONY: all
sshwifty: $(NPMOPT) $(JSCONFIG) $(GOSOURCES) $(UISOURCES)
	@$(NEWL)
	@$(ECHO) "Start: sshwifty (build)"                || $(TRUE)
	@$(NPMP) "run" "build"
	@$(NEWL)
	@$(ECHO) "Finish: sshwifty (build)"               || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: testonly test check
testonly test check: sshwifty
	@$(NEWL)
	@$(ECHO) "Start: test"                            || $(TRUE)
	@$(NPMX) "run" "testonly"
	@$(NEWL)
	@$(ECHO) "Finish: test"                           || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: generate generation
generate generation:
	@$(NEWL)
	@$(ECHO) "Start: generation"                      || $(TRUE)
	@$(NPMP) "run" "generate"
	@$(NEWL)
	@$(ECHO) "Finish: generation"                     || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: lint eslint linter linters
lint eslint linter linters:
	@$(NEWL)
	@$(ECHO) "Start: linters"                         || $(TRUE)
	@$(NPMD) "run" "lint"
	@$(NEWL)
	@$(ECHO) "Finish: linters"                        || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: clean
clean:
	@$(NEWL)
	@$(ECHO) "Start: Quick cleanup"                   || $(TRUE)
	@$(NPMX) "run" "clean"
	@$(RMFR) "sshwifty"                               || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Quick cleanup"                  || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: distclean realclean
distclean realclean: clean
	@$(NEWL)
	@$(ECHO) "Start: Distribution cleanup"            || $(TRUE)
	@($(TEST) -d "node_modules" &&    \
		{ $(RMFR) "node_modules" -r   \
			|| $(TRUE); $(TRUE); } || \
				$(TRUE))                              || $(TRUE)
	@$(GOGO) clean -cache -testcache ./...            || $(TRUE)
	@$(RMFR) "jsinstall"                              || $(TRUE)
	@$(RMFR) "jsinstalld"                             || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Distribution cleanup"           || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstallp
jsinstall:
	@$(NEWL)
	@$(ECHO) "Start: Install production modules"      || $(TRUE)
	@$(TEST) -f "jsinstall" || $(NPMP) "install"
	@$(TEST) -f "jsinstall" || $(NPMP) "audit" "fix"  || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Install production modules"     || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstalld
jsinstalld:
	@$(NEWL)
	@$(ECHO) "Start: Install development modules"     || $(TRUE)
	@$(TEST) -f "jsinstalld" || $(NPMD) "install"
	@$(TEST) -f "jsinstalld" || $(NPMD) "audit" "fix" || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Install development modules"    || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdatep
jsupdate: jsinstall
	@$(NEWL)
	@$(ECHO) "Start: Update production modules"       || $(TRUE)
	@$(RMFR) "jsinstall"                              || $(TRUE)
	@$(NPMP) "audit" "fix"                            || $(TRUE)
	@$(NPMP) "update"
	@$(NPMP) "audit" "fix"                            || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Update production modules"      || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdated
jsupdated: jsinstalld
	@$(NEWL)
	@$(ECHO) "Start: Update development modules"      || $(TRUE)
	@$(RMFR) "jsinstall"                              || $(TRUE)
	@$(RMFR) "jsinstalld"                             || $(TRUE)
	@$(NPMD) "audit" "fix"                            || $(TRUE)
	@$(NPMD) "update"
	@$(NPMD) "audit" "fix"                            || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Update development modules"     || $(TRUE)
	@$(NEWL)

############################################################################
