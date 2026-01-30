# Course Structure Update - Implementation Summary

## Overview
This document outlines the changes made to update the course structure to align with the new curriculum for both Software Engineering (B.Sc. SWE) and Information Technology and Systems (B.Sc. ITS) programs.

## Database Changes

### 1. Migration: Add Program Field
**File:** `/db/migrate/20260130131500_add_program_to_courses.rb`

Added a `program` field to the courses table to distinguish between:
- Software Engineering
- Information Technology and Systems

**Status:** ✅ Migrated successfully

### 2. Course Model Update
**File:** `/app/models/course.rb`

Added validation for the `program` field:
```ruby
validates :program, presence: true, inclusion: { in: ['Software Engineering', 'Information Technology and Systems'] }
```

## Seed Data

### Comprehensive Course List
**File:** `/db/seeds.rb`

Completely rewrote the seed file with the actual curriculum:

#### Software Engineering (B.Sc. SWE) - Regular Program
- **Year I**: 12 courses (18 credits each semester)
- **Year II**: 12 courses (17 credits semester 1, 19 credits semester 2)
- **Year III**: 12 courses (18 credits each semester)
- **Year IV**: 10 courses (17 credits semester 1, 18 credits semester 2)
- **Year V**: 6 courses (18 credits each semester)
- **Total:** 52 courses

#### Information Technology and Systems (B.Sc. ITS) - Regular Program
- **Year I**: 12 courses (18 credits semester 1, 17 credits semester 2)
- **Year II**: 12 courses (18 credits each semester)
- **Year III**: 11 courses (18 credits each semester)
- **Year IV**: 10 courses (18 credits each semester)
- **Total:** 45 courses

**Total Courses in Database:** 97 courses

**Status:** ✅ Seeded successfully (91 unique courses - some are shared between programs)

## Backend Updates

### 1. Courses Controller
**File:** `/app/controllers/courses_controller.rb`

**Changes:**
- Updated year label mapping from "Freshman/Sophomore/Junior/Senior" to "Year I/Year II/Year III/Year IV/Year V"
- Added support for filtering by `program` parameter
- Updated `course_params` to permit the `program` field
- Improved filtering logic to handle year, semester, and program independently

**New API Capabilities:**
```
GET /courses?year=1&semester=Semester%201&program=Software%20Engineering
```

## Frontend Updates

### 1. TypeScript Interfaces
Updated the `Course` interface in both:
- `/src/components/CourseDetailsModal.tsx`
- `/src/pages/course-details.tsx`

Added the `program` field:
```typescript
interface Course {
  id: number;
  name: string;
  code: string;
  year: string;
  semester: number;
  description: string;
  credit_hour: number;
  program: string;  // NEW
}
```

### 2. User Dashboard
**File:** `/src/pages/dashboard/user.tsx`

**Changes:**
- Updated `YEARS` constant from "Freshman/Sophomore/Junior/Senior" to "Year I/Year II/Year III/Year IV/Year V"
- Added Year V to support the 5-year Software Engineering program

## New Course Structure Details

### Software Engineering Highlights

#### Core Courses by Year:
- **Year I:** Programming fundamentals, discrete math, computer systems
- **Year II:** Data structures, databases, software requirements, design & architecture
- **Year III:** Web systems, mobile dev, AI, enterprise systems, data analytics
- **Year IV:** DevOps, SOA, software process improvement, capstone project I
- **Year V:** Industry practice, FinTech, simulation, capstone project II

#### Special Features:
- Heavy focus on software engineering practices
- Includes Industry Practice (18 credits) in Year V Semester 1
- Two-part capstone project spanning Year IV and Year V

### Information Technology Systems Highlights

#### Core Courses by Year:
- **Year I:** Computer systems, programming, electronics, information systems
- **Year II:** Database systems, web technologies, systems analysis & design
- **Year III:** Software design, cybersecurity, IT systems acquisition
- **Year IV:** Cloud computing, IT project management, IT service management

#### Special Features:
- Focus on IT infrastructure and systems
- Strong emphasis on security and networking
- Two-part capstone project in Year IV

## Shared Courses Between Programs

Several courses are shared between both programs:
- SWEN131: Fundamentals of Programming
- SWEN132: Object Oriented Programming
- ITSY154: Data Communication and Computer Networks I
- MATH161: Discrete Mathematics
- MATH164: Linear Algebra
- MATH261: Calculus
- MATH266: Boolean Algebra
- MATH361: Statistical Methods
- SWEN252: Operating Systems
- SWEN327: Enterprise Systems
- SWEN366: Methods for IS Research
- SWEN381: Web Systems and Services
- SWEN471: Systems Thinking and Systems Approach
- ITSY364: Foundations of Data Analytics
- All SPRT (Support) courses

## Future Enhancements

### Recommended Next Steps:

1. **Add Program Selection to User Profile**
   - Allow users to specify their program (SWE or ITS)
   - Filter courses based on user's program by default

2. **Program Switcher in Dashboard**
   - Add a toggle to view courses from either program
   - Useful for students considering switching programs

3. **Course Prerequisites**
   - Add prerequisite tracking
   - Show prerequisite chains in course details

4. **Elective Courses**
   - Add support for elective course selection
   - Track which electives students have chosen

5. **Progress Tracking**
   - Visualize course completion per year
   - Calculate remaining credits to graduation

## Testing Recommendations

1. **Backend API Testing**
   ```bash
   # Test filtering by year
   curl http://localhost:3000/courses?year=1
   
   # Test filtering by semester
   curl http://localhost:3000/courses?semester=Semester%201
   
   # Test filtering by program
   curl http://localhost:3000/courses?program=Software%20Engineering
   
   # Test combined filters
   curl http://localhost:3000/courses?year=1&semester=Semester%201&program=Information%20Technology%20and%20Systems
   ```

2. **Frontend Testing**
   - Verify all Year I-V courses display correctly
   - Test course detail modal with new program field
   - Verify filtering works across all years and semesters

3. **Database Integrity**
   ```bash
   rails console
   
   # Verify course counts
   Course.where(program: 'Software Engineering').count  # Should be ~52
   Course.where(program: 'Information Technology and Systems').count  # Should be ~45
   
   # Verify all courses have programs
   Course.where(program: nil).count  # Should be 0
   ```

## Migration Instructions

To apply these changes to an existing database:

```bash
# Navigate to backend directory
cd study_crew-main

# Run migration
rails db:migrate

# Reseed database (WARNING: This will delete existing course data)
rails db:seed:replant

# Or to preserve other data, just reset courses:
rails console
Course.destroy_all
exit
rails db:seed
```

## Rollback Instructions

If needed, to rollback the changes:

```bash
cd study_crew-main
rails db:rollback
```

Then restore the previous `db/seeds.rb` file and re-run `rails db:seed`.

## Summary

✅ All changes have been successfully implemented
✅ Database migrated and seeded with new course structure  
✅ Backend API updated to support new filtering
✅ Frontend interfaces updated with program field
✅ Year labels standardized across the application

The application now fully supports the new curriculum structure for both Software Engineering and Information Technology and Systems programs.
