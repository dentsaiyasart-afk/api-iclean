#!/bin/bash
# test-api.sh - Test script for i-Clean API on Vercel
# Usage: ./test-api.sh https://i-clean-api.vercel.app

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
API_URL="${1:-http://localhost:3000}"

echo "======================================"
echo "🧪 Testing i-Clean API"
echo "API URL: $API_URL"
echo "======================================"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET $API_URL/api/health"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 2: Wholesale Inquiry - Success
echo "Test 2: Wholesale Inquiry - Valid Data"
echo "POST $API_URL/api/wholesale-inquiry"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/wholesale-inquiry" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "ทดสอบ ระบบ",
    "email": "test@example.com",
    "phone": "081-234-5678",
    "business_type": "online",
    "message": "ทดสอบจาก script"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 3: Wholesale Inquiry - Validation Error
echo "Test 3: Wholesale Inquiry - Missing Required Fields"
echo "POST $API_URL/api/wholesale-inquiry"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/wholesale-inquiry" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "ทดสอบ"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE (Expected error)"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE (Expected 400)"
    echo "Response: $BODY"
fi
echo ""

# Test 4: Newsletter Subscribe - Success
echo "Test 4: Newsletter Subscribe - Valid Email"
echo "POST $API_URL/api/newsletter-subscribe"
RANDOM_EMAIL="test$(date +%s)@example.com"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/newsletter-subscribe" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RANDOM_EMAIL\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 5: Newsletter Subscribe - Invalid Email
echo "Test 5: Newsletter Subscribe - Invalid Email Format"
echo "POST $API_URL/api/newsletter-subscribe"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/newsletter-subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE (Expected error)"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE (Expected 400)"
    echo "Response: $BODY"
fi
echo ""

# Test 6: 404 Not Found
echo "Test 6: 404 Not Found"
echo "GET $API_URL/api/nonexistent"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/nonexistent")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "404" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $HTTP_CODE (Expected)"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $HTTP_CODE (Expected 404)"
    echo "Response: $BODY"
fi
echo ""

# Summary
echo "======================================"
echo "✅ Testing Complete!"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. Check your email inbox for test emails"
echo "2. Verify admin notifications were sent"
echo "3. Update frontend with production API URL"
echo ""