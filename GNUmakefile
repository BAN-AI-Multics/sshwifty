############################################################################

ECHO?=printf '*** %s\n'
TRUE?=true > /dev/null 2>&1 || { :; }
NEWL?=printf '%s\n' "" 2> /dev/null || $(TRUE)
MAKE?=make
NPM?=npm
NPMP?=NODE_ENV=production $(NPM)
NPMD?=NODE_ENV=development $(NPM)
RM?=rm -f > /dev/null 2>&1 || $(TRUE)
TEST?=test
TOUCH?=touch

############################################################################

.PHONY: all
sshwifty: jsinstall
	@$(NEWL)
	@$(ECHO) "Start: sshwifty (build)" || $(TRUE)
	@$(NPMP) "run" "build"
	@$(NEWL)
	@$(ECHO) "Finish: sshwifty (build)" || $(TRUE)

############################################################################

.PHONY: test check
test check:
	@$(NEWL)
	@$(ECHO) "Start: test" || $(TRUE)
	@$(NPM) "run" "test"
	@$(NEWL)
	@$(ECHO) "Finish: test" || $(TRUE)

############################################################################

.PHONY: testonly
testonly: sshwifty
	@$(NEWL)
	@$(ECHO) "Start: testonly" || $(TRUE)
	@$(NPM) "run" "testonly"
	@$(NEWL)
	@$(ECHO) "Finish: testonly" || $(TRUE)

############################################################################

.PHONY: generate generation
generate generation:
	@$(NEWL)
	@$(ECHO) "Start: generation" || $(TRUE)
	@$(NPMP) "run" "generate"
	@$(NEWL)
	@$(ECHO) "Finish: generation" || $(TRUE)

############################################################################

.PHONY: lint eslint linter linters
lint eslint linter linters:
	@$(NEWL)
	@$(ECHO) "Start: linters" || $(TRUE)
	@$(NPMP) "run" "lint"
	@$(NEWL)
	@$(ECHO) "Finish: linters" || $(TRUE)

############################################################################

.PHONY: dev
dev:
	@$(NEWL)
	@$(ECHO) "Start: dev (build)" || $(TRUE)
	@$(NPMD) "run" "dev"
	@$(NEWL)
	@$(ECHO) "Finish: dev (build)" || $(TRUE)

############################################################################

.PHONY: clean
clean:
	@$(NEWL)
	@$(ECHO) "Start: Quick cleanup" || $(TRUE)
	@$(NPM) "run" "clean"
	@$(RM) "sshwifty" || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Quick cleanup" || $(TRUE)

############################################################################

.PHONY: distclean realclean
distclean realclean: clean
	@$(NEWL)
	@$(ECHO) "Start: Full cleanup" || $(TRUE)
	@($(TEST) -d "node_modules" && { $(RM) "node_modules" -r; $(TRUE); } \
		|| $(TRUE)) || $(TRUE)
	@$(RM) "jsinstall" || $(TRUE)
	@$(NEWL)
	@$(ECHO) "Finish: Full cleanup" || $(TRUE)

############################################################################

.PHONY: jsinstallp
jsinstallp jsinstall:
	@$(NEWL)
	@$(ECHO) "Start: Install production modules" || $(TRUE)
	@$(NPMP) "install"
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(TOUCH) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Install production modules" || $(TRUE)

############################################################################

.PHONY: jsinstalld
jsinstalld:
	@$(NEWL)
	@$(ECHO) "Start: Install development modules" || $(TRUE)
	@$(NPMD) "install"
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(TOUCH) "jsinstall"
	@$(TOUCH) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Install development modules" || $(TRUE)

############################################################################

.PHONY: jsupdatep jsupdate
jsupdatep jsupdate: jsinstallp
	@$(NEWL)
	@$(ECHO) "Start: Update production modules" || $(TRUE)
	@$(RM) "jsinstall" || $(TRUE)
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(NPMP) "update"
	@$(NPMP) "audit" "fix" || $(TRUE)
	@$(TOUCH) "jsinstall"
	@$(NEWL)
	@$(ECHO) "Finish: Update production modules" || $(TRUE)

############################################################################

.PHONY: jsupdated
jsupdated: jsinstalld
	@$(NEWL)
	@$(ECHO) "Start: Update developmentbmodules" || $(TRUE)
	@$(RM) "jsinstall" || $(TRUE)
	@$(RM) "jsinstalld" || $(TRUE)
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(NPMD) "update"
	@$(NPMD) "audit" "fix" || $(TRUE)
	@$(TOUCH) "jsinstall"
	@$(TOUCH) "jsinstalld"
	@$(NEWL)
	@$(ECHO) "Finish: Update development modules" || $(TRUE)

############################################################################
