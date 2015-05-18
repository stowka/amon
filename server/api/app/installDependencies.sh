#!/bin/bash

# Install quotation dependencies
cd bundles/quotation;
npm install;
cd ../../

# Install access dependencies
cd bundles/access
npm install
cd ../../

# Install project dependencies
npm install;


