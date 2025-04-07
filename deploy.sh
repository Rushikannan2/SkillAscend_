#!/bin/bash

# Install dependencies
cd frontend && npm install
cd ../server && npm install

# Build the frontend
cd ../frontend && npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  exit 0
else
  echo "Build failed!"
  exit 1
fi 