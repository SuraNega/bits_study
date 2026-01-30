#!/bin/bash

# Course Structure Verification Script
# This script verifies that the course structure has been properly updated

echo "========================================="
echo "Course Structure Verification"
echo "========================================="
echo ""

cd "$(dirname "$0")/study_crew-main"

echo "1. Checking total course count..."
TOTAL=$(rails runner "puts Course.count" 2>/dev/null)
echo "   Total courses: $TOTAL"

echo ""
echo "2. Checking Software Engineering courses..."
SWE=$(rails runner "puts Course.where(program: 'Software Engineering').count" 2>/dev/null)
echo "   SWE courses: $SWE"

echo ""
echo "3. Checking Information Technology and Systems courses..."
ITS=$(rails runner "puts Course.where(program: 'Information Technology and Systems').count" 2>/dev/null)
echo "   ITS courses: $ITS"

echo ""
echo "4. Checking Year I courses..."
YEAR1=$(rails runner "puts Course.where(year: 'Year I').count" 2>/dev/null)
echo "   Year I courses: $YEAR1"

echo ""
echo "5. Checking Year V courses (SWE only)..."
YEAR5=$(rails runner "puts Course.where(year: 'Year V').count" 2>/dev/null)
echo "   Year V courses: $YEAR5"

echo ""
echo "6. Sample SWE Year I Semester 1 courses:"
rails runner "Course.where(year: 'Year I', semester: 1, program: 'Software Engineering').each { |c| puts '   - ' + c.code + ': ' + c.name + ' (' + c.credit_hour.to_s + ' cr)' }" 2>/dev/null

echo ""
echo "7. Sample ITS Year I Semester 1 courses:"
rails runner "Course.where(year: 'Year I', semester: 1, program: 'Information Technology and Systems').each { |c| puts '   - ' + c.code + ': ' + c.name + ' (' + c.credit_hour.to_s + ' cr)' }" 2>/dev/null

echo ""
echo "8. Testing API endpoint..."
RESPONSE=$(curl -s "http://localhost:3000/courses?year=1&semester=Semester%201&program=Software%20Engineering" | head -c 200)
if [ ! -z "$RESPONSE" ]; then
    echo "   ✓ API endpoint working (sample response shown)"
    echo "   $RESPONSE..."
else
    echo "   ✗ API endpoint not responding (is the server running?)"
fi

echo ""
echo "========================================="
echo "Verification Complete"
echo "========================================="
