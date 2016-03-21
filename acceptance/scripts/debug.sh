#!/bin/bash

go get -tags acceptance ./... && cd acceptance && go test -tags acceptance; cd ..
