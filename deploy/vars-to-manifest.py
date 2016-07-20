#!/usr/bin/env python

# Run from root of project. e.g. python deploy/travis-vars-to-manifest.py
import ruamel.yaml as yaml
import os
import sys

BUILD_INFO = "BUILD_INFO"

yaml_data = None
# Read the manifest file
with open('manifests/manifest-base.yml', 'r') as base_manifest:
    data = base_manifest.read()
    yaml_data = yaml.load(data, yaml.RoundTripLoader)

    build_info = "" + str(os.environ.get(BUILD_INFO))
    if len(build_info) < 1 or build_info == "None":
        print BUILD_INFO + " is empty"
        sys.exit(1)

# Put the environment vars into place.
    yaml_data['env'][BUILD_INFO] = build_info

# Overwrite the manifest file.
with open('manifests/manifest-base.yml', 'w') as base_manifest:
    base_manifest.write("---\n")
    base_manifest.write(yaml.dump(yaml_data, Dumper=yaml.RoundTripDumper))
