#!/bin/bash
nanocf local.nanocf
cd dashboard
cf push dashboard

curl -v "http://dashboard.local.nanocf/ping"
