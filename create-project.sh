#!/bin/bash

# Next.js Project Generator
# Usage: ./create-project.sh <project-name>

if [ -z "$1" ]; then
    echo "Usage: ./create-project.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1
TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Creating Next.js project: $PROJECT_NAME"

# Create new Next.js project
npx create-next-app@latest "$PROJECT_NAME" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd "$PROJECT_NAME" || exit 1

echo "📁 Copying baseline configuration..."

# Copy configuration files if they exist
[ -f "$TEMPLATE_DIR/postcss.config.mjs" ] && cp "$TEMPLATE_DIR/postcss.config.mjs" ./
[ -f "$TEMPLATE_DIR/tailwind.config.js" ] && cp "$TEMPLATE_DIR/tailwind.config.js" ./
[ -f "$TEMPLATE_DIR/components.json" ] && cp "$TEMPLATE_DIR/components.json" ./
[ -f "$TEMPLATE_DIR/biome.json" ] && cp "$TEMPLATE_DIR/biome.json" ./

# Copy utilities
mkdir -p src/lib
[ -f "$TEMPLATE_DIR/src/lib/utils.ts" ] && cp "$TEMPLATE_DIR/src/lib/utils.ts" src/lib/

# Copy styles
mkdir -p src/app
[ -f "$TEMPLATE_DIR/src/app/globals.css" ] && cp "$TEMPLATE_DIR/src/app/globals.css" src/app/
[ -f "$TEMPLATE_DIR/src/app/ClientBody.tsx" ] && cp "$TEMPLATE_DIR/src/app/ClientBody.tsx" src/app/

echo "✅ Project '$PROJECT_NAME' configured successfully!"
echo "📝 Next steps:"
echo "   cd $PROJECT_NAME"
echo "   npm run dev"
