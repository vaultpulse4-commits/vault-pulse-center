#!/bin/bash

##################################################
# Create Customer Package - Vault Pulse Center
##################################################
# Script untuk membuat zip package untuk customer
# Otomatis exclude file-file internal development

echo "========================================"
echo "Creating Customer Package"
echo "========================================"
echo ""

# Define output
OUTPUT_ZIP="vault-pulse-center-customer.zip"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

# Check if zip is available
if ! command -v zip &> /dev/null; then
    echo -e "${RED}✗ zip command not found!${NC}"
    echo -e "${RED}Please install zip: sudo apt-get install zip${NC}"
    exit 1
fi
echo -e "${GREEN}✓ zip command available${NC}"
echo ""

echo -e "${YELLOW}[2/5] Cleaning up old artifacts...${NC}"

# Remove old zip
if [ -f "$OUTPUT_ZIP" ]; then
    rm -f "$OUTPUT_ZIP"
    echo -e "${GREEN}✓ Removed old package${NC}"
fi

# Clean build artifacts
if [ -d "dist" ]; then
    rm -rf "dist"
    echo -e "${GREEN}✓ Cleaned dist/${NC}"
fi
if [ -d "server/dist" ]; then
    rm -rf "server/dist"
    echo -e "${GREEN}✓ Cleaned server/dist/${NC}"
fi

# Remove .env files (keep .env.example)
if [ -f ".env" ]; then
    rm -f ".env"
    echo -e "${GREEN}✓ Removed .env${NC}"
fi
if [ -f "server/.env" ]; then
    rm -f "server/.env"
    echo -e "${GREEN}✓ Removed server/.env${NC}"
fi

echo ""
echo -e "${YELLOW}[3/5] Verifying required files...${NC}"

# Check essential files
REQUIRED_FILES=(
    ".env.example"
    "server/.env.example"
    "README.md"
    "SETUP_INSTRUCTIONS.md"
    "package.json"
    "server/package.json"
    "server/prisma/schema.prisma"
)

ALL_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ MISSING: $file${NC}"
        ALL_EXIST=false
    fi
done

if [ "$ALL_EXIST" = false ]; then
    echo ""
    echo -e "${RED}ERROR: Some required files are missing!${NC}"
    echo -e "${RED}Please ensure all files are present before creating package.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}[4/5] Creating customer package...${NC}"

# Create zip with exclusions
zip -r "$OUTPUT_ZIP" . \
    -x "*/node_modules/*" \
    -x "*/.git/*" \
    -x "*.env" \
    -x "*.env.local" \
    -x "*/dist/*" \
    -x "*/build/*" \
    -x "*/.next/*" \
    -x "*/out/*" \
    -x "*/coverage/*" \
    -x "*/.nyc_output/*" \
    -x "*/logs/*" \
    -x "*.log" \
    -x "*/.vscode/*" \
    -x "*/.idea/*" \
    -x "*/.DS_Store" \
    -x "*/Thumbs.db" \
    -x "*.swp" \
    -x "*.swo" \
    -x "COMMIT_SUMMARY.md" \
    -x "IMPLEMENTATION_STATUS.md" \
    -x "AUTH_COMPLETE.md" \
    -x "AUTH_IMPLEMENTATION_COMPLETE.md" \
    -x "BACKEND_COMPLETE.md" \
    -x "SETUP_COMPLETE.md" \
    -x "EVENT_BRIEFS_IMPLEMENTATION.md" \
    -x "SHIFT_MAINTENANCE_IMPLEMENTATION.md" \
    -x "TESTING_CHECKLIST.md" \
    -x "PRE_DEPLOYMENT_CHECKLIST.md" \
    -x "server/SETUP_COMPLETE.md" \
    -x ".customerignore" \
    -x "create-customer-package.sh" \
    -x "create-customer-package.ps1" \
    > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Package created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create package${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}[5/5] Package summary...${NC}"

if [ -f "$OUTPUT_ZIP" ]; then
    SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)
    echo -e "${GREEN}✓ Package: $OUTPUT_ZIP${NC}"
    echo -e "${GREEN}✓ Size: $SIZE${NC}"
    
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}Package Ready for Customer!${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
    echo -e "${NC}Next steps:${NC}"
    echo -e "${GRAY}1. Extract and test the zip package${NC}"
    echo -e "${GRAY}2. Verify no internal files included${NC}"
    echo -e "${GRAY}3. Test setup process (./setup.sh)${NC}"
    echo -e "${GRAY}4. Send to customer with email template${NC}"
    echo ""
    
    echo -e "${YELLOW}Excluded files:${NC}"
    echo -e "${GRAY}  - Internal documentation (COMMIT_SUMMARY.md, etc.)${NC}"
    echo -e "${GRAY}  - .env files (kept .env.example)${NC}"
    echo -e "${GRAY}  - node_modules, dist, build folders${NC}"
    echo -e "${GRAY}  - .git, .vscode, IDE settings${NC}"
    echo -e "${GRAY}  - Log files and temporary files${NC}"
    
else
    echo -e "${RED}✗ Failed to create package!${NC}"
    exit 1
fi

echo ""
echo "Press enter to exit..."
read
