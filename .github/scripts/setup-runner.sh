#!/bin/bash

# Create directory for the runner
mkdir -p actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-arm64.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-arm64-2.311.0.tar.gz

# Extract the runner
tar xzf ./actions-runner-linux-arm64.tar.gz

# Install dependencies
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# Configure the runner (replace with your actual values)
./config.sh --url https://github.com/$GITHUB_REPOSITORY --token $RUNNER_TOKEN --labels "self-hosted,linux,arm64"

# Install and start the runner service
sudo ./svc.sh install
sudo ./svc.sh start 