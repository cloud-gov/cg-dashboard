#!/usr/bin/env python

import ruamel.yaml as yaml
import os
import sys

CONSOLE_CLIENT_ID = "CONSOLE_CLIENT_ID"
CONSOLE_CLIENT_SECRET = "CONSOLE_CLIENT_SECRET"

yaml_data = None
# Read the manifest file
with open('manifest-base.yml', 'r') as base_manifest:
    data = base_manifest.read()
    yaml_data = yaml.load(data, yaml.RoundTripLoader)

    client_id = "" + str(os.environ.get(CONSOLE_CLIENT_ID))
    # Check in case the env vars is set to empty or not set at all
    if len(client_id) < 1 or client_id == "None":
        print CONSOLE_CLIENT_ID + " is empty"
        sys.exit(1)
    client_secret = "" + str(os.environ.get(CONSOLE_CLIENT_SECRET))
    if len(client_secret) < 1 or client_secret == "None":
        print CONSOLE_CLIENT_SECRET + " is empty"
        sys.exit(1)

    # Put the environment vars into place.
    yaml_data['env'][CONSOLE_CLIENT_ID] = client_id
    yaml_data['env'][CONSOLE_CLIENT_SECRET] = client_secret

# Overwrite the manifest file.
with open('manifest-base.yml', 'w') as base_manifest:
    base_manifest.write("---\n")
    base_manifest.write(yaml.dump(yaml_data, Dumper=yaml.RoundTripDumper))
