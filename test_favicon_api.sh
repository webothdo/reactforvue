#!/bin/bash

# Test the favicon API endpoint
# Assumes the server is running on localhost:3000

URL_TO_TEST="https://google.com"

echo "Testing favicon API for: $URL_TO_TEST"

curl -X POST http://localhost:3000/api/media/favicon \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$URL_TO_TEST\"}"

echo -e "\n\nTest complete."
