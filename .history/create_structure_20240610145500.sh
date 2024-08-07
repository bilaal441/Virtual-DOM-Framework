#!/bin/bash

# Define the directory structure
dirs=(
    "my-framework/src"
    "my-framework/src/app"
    "my-framework/docs"
    "my-framework/tests"
)

files=(
    "my-framework/src/framework.js"
    "my-framework/src/router.js"
    "my-framework/src/state.js"
    "my-framework/src/dom.js"
    "my-framework/src/event.js"
    "my-framework/src/app/index.html"
    "my-framework/src/app/app.js"
    "my-framework/src/app/styles.css"
    "my-framework/docs/documentation.md"
    "my-framework/tests/dom.test.js"
    "my-framework/tests/router.test.js"
    "my-framework/tests/state.test.js"
    "my-framework/tests/event.test.js"
    "my-framework/.gitignore"
    "my-framework/package.json"
    "my-framework/README.md"
)

# Create directories
for dir in "${dirs[@]}"; do
    mkdir -p "$dir"
done

# Create files
for file in "${files[@]}"; do
    touch "$file"
done

echo "Directory structure created successfully."
