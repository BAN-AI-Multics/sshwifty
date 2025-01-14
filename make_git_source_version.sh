#!/usr/bin/env sh
# shellcheck disable=SC3040
# vim: filetype=sh:tabstop=4:tw=76

# shellcheck disable=SC2006,SC2046,SC2065
test _$(printf '%s' "asdf" 2> /dev/null) != "_asdf" > /dev/null &&
	printf '%s\n' \
		"Error: This shell seems to be csh, which is not supported." &&
	exit 1

set +e > /dev/null 2>&1
set +u > /dev/null 2>&1

# shellcheck disable=SC2046
eval export $(locale 2> /dev/null) > /dev/null 2>&1 || true
DUALCASE=1 && export DUALCASE
LC_ALL=C && export LC_ALL
LANGUAGE=C && export LANGUAGE
LANG=C && export LANG
(unset CDPATH > /dev/null 2>&1) > /dev/null 2>&1 &&
	unset CDPATH > /dev/null 2>&1

if [ ".${ZSH_VERSION:-}" != "." ] &&
	(emulate sh 2> /dev/null) > /dev/null 2>&1; then
	emulate sh > /dev/null 2>&1
	NULLCMD=: && export NULLCMD
	# shellcheck disable=SC2142
	alias -g '${1+"$@"}'='"$@"' > /dev/null 2>&1
	unalias -a > /dev/null 2>&1 || true > /dev/null 2>&1
	unalias -m '*' > /dev/null 2>&1
	disable -f -m '*' > /dev/null 2>&1
	setopt pipefail > /dev/null 2>&1
	POSIXLY_CORRECT=1 && export POSIXLY_CORRECT
	POSIX_ME_HARDER=1 && export POSIX_ME_HARDER
elif [ ".${BASH_VERSION:-}" != "." ] &&
	(set -o posix 2> /dev/null) > /dev/null 2>&1; then
	set -o posix > /dev/null 2>&1
	set -o pipefail > /dev/null 2>&1
	POSIXLY_CORRECT=1 && export POSIXLY_CORRECT
	POSIX_ME_HARDER=1 && export POSIX_ME_HARDER
	unalias -a > /dev/null 2>&1 || true > /dev/null 2>&1
fi

for as_var in BASH_ENV ENV MAIL MAILPATH; do
	# shellcheck disable=SC1083,SC2015
	eval test x\${"${as_var:?}"+set} = xset &&
		( 
			(unset "${as_var:-}") ||
				{
					printf >&2 '%s\n' \
						"Error: clear environment failed."
					exit 1
				}
		) &&
		unset "${as_var:-}" || true
done

TZ="UTC" && export TZ > /dev/null 2>&1

set -u > /dev/null 2>&1
set -e > /dev/null 2>&1

get_git_info()
{
	if command command true 2> /dev/null 1>&2; then
		if command git version 2> /dev/null 1>&2; then
			GITTEST=$(git version 2> /dev/null)
			# shellcheck disable=SC2236
			if [ -n "${GITTEST:-}" ] &&
				[ ! -z "${GITTEST:-}" ]; then
				BRANCH=$(git branch --show-current 2> /dev/null)
				CDDATE=" "$(git show -s --format="%cd" \
					--date="format:%Y-%m-%d" 2> /dev/null)
				GITVER=$(git describe --long --dirty --tags --always \
					2> /dev/null)
				if [ ! -n "${BRANCH:-}" ] ||
					[ -z "${BRANCH:-}" ]; then
					BRANCH="nobranch"
				fi
				if [ "${BRANCH:-}" = "master" ] ||
					[ "${BRANCH:-}" = "main" ] ||
					[ "${BRANCH:-}" = "trunk" ] ||
					[ "${BRANCH:-}" = "nobranch" ]; then
					if [ -n "${GITVER:-}" ] &&
						[ ! -z "${GITVER:-}" ]; then
						GIT_OUT=$(printf '%s' \
							"${GITVER:?}${CDDATE:?}" |
								sed -e 's/-0-g.* / /' \
									-e 's/-[0-9]\+-g/+-g/')
					fi
				else
					if [ -n "${GITVER:-}" ] &&
						[ ! -z "${GITVER:-}" ]; then
						GIT_OUT=$(printf '%s' \
							"${GITVER:?}-${BRANCH:?}${CDDATE:?}" |
								sed -e 's/-0-g.* / /' \
									-e 's/-[0-9]\+-g/+-g/')
					fi
				fi
			fi
		else
			printf >&2 '%s\n' \
				"Error: git version failed."
			exit 1
		fi
	else
		printf >&2 '%s\n' \
			"Error: command true failed."
		exit 1
	fi

	GIT_SOURCE_INFO="${GIT_OUT:-0.0.0} "
	GIT_SOURCE_XFRM=$(printf '%s\n' "${GIT_SOURCE_INFO:?}" | \
		sed -e 's/VERSION_//' -e 's/_/\./g' 2> /dev/null) ||
		{
			printf >&2 '%s\n' \
				"Error: sed failed."
			exit 1
		}

	# shellcheck disable=SC2236
	if [ -n "${GIT_SOURCE_XFRM:-}" ] &&
		[ ! -z "${GIT_SOURCE_XFRM:-}" ]; then
		printf '%s\n' \
			"${GIT_SOURCE_XFRM:?}"
	else

		printf '%s\n' \
			"${GIT_SOURCE_INFO:?}"
	fi

}

get_utc_date()
{
#	UTC_BLD_DATE=$(TZ=UTC date -u "+%Y-%m-%d" 2> /dev/null) ||
#		{
#			printf >&2 '%s\n' \
#				"Error: date failed."
#			exit 1
#		}
#	# shellcheck disable=SC2236
#	if [ -n "${UTC_BLD_DATE:-}" ] &&
#		[ ! -z "${UTC_BLD_DATE:-}" ]; then
#		UTC_BLD_DATE_INFO="(compiled ${UTC_BLD_DATE:?})"
#	else
#
		UTC_BLD_DATE_INFO=""
#	fi

	printf '%s\n' \
		"${UTC_BLD_DATE_INFO:-}"
}

BUILD_VER="$(get_git_info)" ||
	{
		printf >&2 '%s\n' \
			"Error: get_git_info() failed."
		exit 1
	}
BUILD_UTC="$(get_utc_date)" ||
	{
		printf >&2 '%s\n' \
			"Error: get_utc_date() failed."
		exit 1
	}

# shellcheck disable=SC1003
printf '%s\n' \
	"${BUILD_VER:?}${BUILD_UTC:-}" \
	> "./version.inc" ||
	{
		printf >&2 '%s\n' \
			"Error: writing version.inc failed."
		exit 1
	}

# Local Variables:
# mode: sh
# sh-shell: sh
# sh-indentation: 4
# sh-basic-offset: 4
# tab-width: 4
# End:
