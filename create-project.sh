#!/bin/bash

# Professional Next.js Project Generator
# Usage: ./create-project.sh <project-name>

if [ -z "$1" ]; then
    echo "Usage: ./create-project.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1
TEMPLATE_DIR="/media/satan0/Linxu/Projects/myport"

echo "🚀 Creating professional Next.js project: $PROJECT_NAME"

# Create new Next.js project
npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd $PROJECT_NAME

# Copy professional template files
echo "📁 Copying professional template files..."

# Copy configuration files
cp $TEMPLATE_DIR/postcss.config.mjs ./
cp $TEMPLATE_DIR/tailwind.config.js ./
cp $TEMPLATE_DIR/components.json ./
cp $TEMPLATE_DIR/biome.json ./

# Copy professional components
mkdir -p src/components/ui
cp -r $TEMPLATE_DIR/src/components/ui/* src/components/ui/
cp $TEMPLATE_DIR/src/lib/utils.ts src/lib/

# Copy professional styles and components
cp $TEMPLATE_DIR/src/app/globals.css src/app/
cp $TEMPLATE_DIR/src/app/ClientBody.tsx src/app/
cp $TEMPLATE_DIR/templates/page-template.tsx src/app/page.tsx
cp $TEMPLATE_DIR/templates/layout-template.tsx src/app/layout.tsx

# Install professional dependencies
echo "📦 Installing professional dependencies..."
npm install @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate @tailwindcss/postcss same-runtime @biomejs/biome --save
npm install @types/node --save-dev

echo "✅ Professional Next.js project '$PROJECT_NAME' created successfully!"
echo "📝 Next steps:"
echo "   cd $PROJECT_NAME"
echo "   npm run dev"
echo ""
echo "🎨 Customize your content in:"
echo "   - src/app/page.tsx (main content)"
echo "   - src/app/layout.tsx (metadata)"
echo "   - src/app/globals.css (styles)"