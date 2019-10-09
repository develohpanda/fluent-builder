#!/bin/bash
newVersion=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }'  | sed 's/[",]//g' | tr -d '[[:space:]]')
currentVersion=$(npm show $(packageName) version)

echo "##vso[task.setvariable variable=version;]$newVersion"
echo "##vso[task.setvariable variable=currentVersion;]$currentVersion"

echo "Package name: $(packageName)"
echo "Current: $currentVersion"
echo "New: $newVersion"