#!/bin/bash

# The value of the exit status for the script.
scriptreturn=0

# Will modify the scriptreturn if anything non-zero comes back from fgt.
function testCmd() {
	fgt "$@"
	ret=$?
	if (($ret > 0)); then
		scriptreturn=$ret
	fi
}

# Download the fgt tool which returns a non-zero value if a command prints anything to stdout
go get github.com/GeertJohan/fgt
go install github.com/GeertJohan/fgt

# Golint install
go get -u github.com/golang/lint/golint

# Get the list of packages.
pkgs=`go list ./...`

# Lint check
echo
echo
echo '---------------------------------------------------------'
echo 'Doing a lint check on go code'
echo '---------------------------------------------------------'
for pkg in $pkgs
do
	testCmd golint $pkg
done

# Vet check
echo
echo
echo '---------------------------------------------------------'
echo 'Doing a vet check on go code'
echo '---------------------------------------------------------'
for pkg in $pkgs
do
	testCmd go vet $pkg
done

# Fmt Check
echo
echo
echo '---------------------------------------------------------'
echo 'Doing a format  / style check on go code'
echo '---------------------------------------------------------'
for pkg in $pkgs
do
	testCmd go fmt $pkg
done


exit $scriptreturn
