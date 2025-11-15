import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const YEARS = [
  { label: "Freshman", value: 1 },
  { label: "Sophomore", value: 2 },
  { label: "Junior", value: 3 },
  { label: "Senior", value: 4 },
];
const SEMESTERS = ["Semester 1", "Semester 2"];

// Example course data structure
const COURSES = {
  1: {
    "Semester 1": [
      { name: "Intro to Programming", code: "CS101", year: 1, credit_hour: 3 },
      { name: "Discrete Math", code: "MATH101", year: 1, credit_hour: 3 },
    ],
    "Semester 2": [
      { name: "Data Structures", code: "CS102", year: 1, credit_hour: 3 },
      { name: "Calculus II", code: "MATH102", year: 1, credit_hour: 3 },
    ],
  },
  2: {
    "Semester 1": [
      { name: "Algorithms", code: "CS201", year: 2, credit_hour: 3 },
      { name: "Linear Algebra", code: "MATH201", year: 2, credit_hour: 3 },
    ],
    "Semester 2": [
      { name: "Operating Systems", code: "CS202", year: 2, credit_hour: 3 },
      { name: "Probability", code: "MATH202", year: 2, credit_hour: 3 },
    ],
  },
  3: {
    "Semester 1": [
      { name: "Databases", code: "CS301", year: 3, credit_hour: 3 },
      { name: "Software Engineering", code: "CS302", year: 3, credit_hour: 3 },
    ],
    "Semester 2": [
      { name: "Networks", code: "CS303", year: 3, credit_hour: 3 },
      { name: "Web Development", code: "CS304", year: 3, credit_hour: 3 },
    ],
  },
  4: {
    "Semester 1": [
      { name: "AI", code: "CS401", year: 4, credit_hour: 3 },
      { name: "Mobile Development", code: "CS402", year: 4, credit_hour: 3 },
    ],
    "Semester 2": [
      { name: "Cloud Computing", code: "CS403", year: 4, credit_hour: 3 },
      { name: "Capstone Project", code: "CS404", year: 4, credit_hour: 3 },
    ],
  },
};

export default function AssistantDashboard() {
  const [openYear, setOpenYear] = useState<number | null>(1);
  const [openSemester, setOpenSemester] = useState<string>(SEMESTERS[0]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

  const courses = openYear && openSemester ? COURSES[openYear][openSemester] : [];

  const toggleCourse = (code: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSubmit = () => {
    // TODO: navigate to next page with selectedCourses
    alert("Selected: " + Array.from(selectedCourses).join(", "));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 flex flex-col gap-4">
        {YEARS.map((year) => (
          <div key={year.value}>
            <button
              className={`w-full text-left font-semibold py-2 px-3 rounded hover:bg-blue-50 transition ${openYear === year.value ? 'bg-blue-100 text-blue-700' : ''}`}
              onClick={() => setOpenYear(openYear === year.value ? null : year.value)}
            >
              {year.label}
            </button>
            {/* Semesters Toggle */}
            {openYear === year.value && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {SEMESTERS.map((sem) => (
                  <button
                    key={sem}
                    className={`text-sm py-1 px-2 rounded hover:bg-blue-50 transition ${openSemester === sem ? 'bg-blue-200 text-blue-800' : ''}`}
                    onClick={() => setOpenSemester(sem)}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 gap-6 relative">
        <h2 className="text-2xl font-bold mb-4">Courses for {YEARS.find(y => y.value === openYear)?.label} - {openSemester}</h2>
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <Card
              key={course.code}
              className={`flex items-center justify-between px-6 py-4 cursor-pointer transition border-2 ${selectedCourses.has(course.code) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => toggleCourse(course.code)}
            >
              <div className="flex gap-8 items-center w-full">
                <span className="font-semibold w-1/3">{course.name}</span>
                <span className="w-1/6 text-gray-600">{course.code}</span>
                <span className="w-1/6 text-gray-600">Year {course.year}</span>
                <span className="w-1/6 text-gray-600">{course.credit_hour} Credit Hour</span>
              </div>
              <input
                type="checkbox"
                checked={selectedCourses.has(course.code)}
                readOnly
                className="ml-4 accent-blue-600 w-5 h-5"
              />
            </Card>
          ))}
        </div>
        {/* Submit button sticky at the bottom */}
        <div className="sticky bottom-0 left-0 w-full bg-gray-50 pt-6 pb-2 flex justify-end">
          <Button
            className="px-8 py-3 text-lg font-semibold"
            disabled={selectedCourses.size === 0}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </main>
    </div>
  );
}
