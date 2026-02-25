#!/bin/bash

# Skill-linker Release SOP Script
# Usage: ./release.sh [major|minor|patch]

set -e

cd "$(dirname "$0")"

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Check npm registry version
NPM_VERSION=$(npm view skill-linker version 2>/dev/null || echo "0.0.0")
echo "NPM version: $NPM_VERSION"

# Determine version bump type
if [ -n "$1" ]; then
  BUMP_TYPE="$1"
else
  # Auto-detect based on changes
  echo "No bump type specified. Please specify: major, minor, or patch"
  exit 1
fi

echo "Bumping $BUMP_TYPE..."

# Use npm version to update package.json and create git tag
npm version "$BUMP_TYPE" -m "chore: release v%s"

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Push commit and tag
git push && git push origin "v$NEW_VERSION"

echo "✅ Released v$NEW_VERSION"
