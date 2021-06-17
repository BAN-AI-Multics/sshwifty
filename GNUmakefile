############################################################################

ECHO ?= printf '*** %s\n'
NULL ?=  > /dev/null 2>&1
NUL2 ?= 2> /dev/null
TRUE ?= true $(NULL) || { :; }
NEWL ?= printf '%s\n' "" $(NUL2) || $(TRUE)
MAKE ?= make
NPMX ?= npm
NPMP ?= NODE_ENV=production  $(NPMX)
NPMD ?= NODE_ENV=development $(NPMX)
RMFR ?= $(NULL) rm -f
TEST ?= test
TOUC ?= touch

############################################################################

NPMUPP = jsupdatep
NPMUPD = jsupdated
NPMINP = jsinstallp
NPMIND = jsinstalld
NPMOPT = $(NPMUPP)

############################################################################

.PHONY: all
sshwifty: $(NPMOPT)
	@$(NEWL)
	@$(ECHO) "Start: sshwifty (build)" || $(TRUE)
	@$(NPMP) "run" "build"
	@$(NEWL)
	@$(ECHO) "Finish: sshwifty (build)" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: testonly test check
testonly test check: sshwifty
	@$(NEWL)
	@$(ECHO) "Start: test" || $(TRUE)
	@$(NPMX) "run" "testonly"
	@$(NEWL)
	@$(ECHO) "Finish: test" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: generate generation
generate generation:
	@$(NEWL)
	@$(ECHO) "Start: generation" || $(TRUE)
	@$(NPMP) "run" "generate"
	@$(NEWL)
	@$(ECHO) "Finish: generation" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: lint eslint linter linters
lint eslint linter linters:
	@$(NEWL)
	@$(ECHO) "Start: linters" || $(TRUE)
	@$(NPMD) "run" "lint"
	@$(NEWL)
	@$(ECHO) "Finish: linters" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: dev
dev: $(NPMUPD)
	@$(NEWL)
	@$(ECHO) "Start: dev (build)" || $(TRUE)
	@$(NPMD) "run" "dev"
	@$(NEWL)
	@$(ECHO) "Finish: dev (build)" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: clean
clean:
	@$(NEWL)
	@$(ECHO) "Start: Quick cleanup" || $(TRUE)
	@$(NPMX) "run" "clean"
	@$(RMFR) "sshwifty" || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Quick cleanup" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: distclean realclean
distclean realclean: clean
	@$(NEWL)
	@$(ECHO) "Start: Distribution cleanup" || $(TRUE)
	@($(TEST) -d "node_modules" && \
		{ $(RMFR) "node_modules" -r \
			|| $(TRUE); $(TRUE); } || \
				$(TRUE)) || $(TRUE)
	@$(RMFR) "jsinstall" || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Distribution cleanup" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstallp
jsinstallp jsinstall:
	@$(NEWL)
	@$(ECHO) "Start: Install production modules" || $(TRUE)
	@$(NPMP) "install"
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Install production modules" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsinstalld
jsinstalld:
	@$(NEWL)
	@$(ECHO) "Start: Install development modules" || $(TRUE)
	@$(NPMD) "install"
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Install development modules" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdatep jsupdate
jsupdatep jsupdate: jsinstallp
	@$(NEWL)
	@$(ECHO) "Start: Update production modules" || $(TRUE)
	@$(RMFR) "jsinstall" || $(TRUE)
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(NPMP) "update"
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Update production modules" || $(TRUE)
	@$(NEWL)

############################################################################

.PHONY: jsupdated
jsupdated: jsinstalld
	@$(NEWL)
	@$(ECHO) "Start: Update developmentbmodules" || $(TRUE)
	@$(RMFR) "jsinstall" || $(TRUE)
	@$(RMFR) "jsinstalld" || $(TRUE)
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(NPMD) "update"
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(TOUC) "jsinstall"
	@$(TOUC) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Update development modules" || $(TRUE)
	@$(NEWL)

############################################################################
