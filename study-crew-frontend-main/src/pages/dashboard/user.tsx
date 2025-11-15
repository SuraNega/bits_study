import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/context/AuthContext";
import CourseDetailsModal from "@/components/CourseDetailsModal"; // Import the modal component

const YEARS = [
  { label: "Freshman", value: 1 },
  { label: "Sophomore", value: 2 },
  { label: "Junior", value: 3 },
  { label: "Senior", value: 4 },
];
const SEMESTERS = ["Semester 1", "Semester 2"];

export default function UserDashboard() {
  const { user } = useAuth();
  const academicYear = user?.academic_year ?? 1; // fallback to 1 if not logged in
  // Filter years to show only up to user's current academic year
  const userEligibleYears = YEARS.filter(y => y.value <= academicYear);
  
  // Read from URL
  const params = new URLSearchParams(window.location.search);
  const urlYear = Number(params.get('year'));
  const urlSemester = params.get('semester');
  
  const [openYear, setOpenYear] = useState<number | null>(
    urlYear && userEligibleYears.some(y => y.value === urlYear)
      ? urlYear
      : userEligibleYears.length > 0 ? userEligibleYears[0].value : null
  );
  
  const [openSemester, setOpenSemester] = useState<string>(
    urlSemester && SEMESTERS.includes(urlSemester)
      ? urlSemester
      : SEMESTERS[0]
  );
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);

  // Function to handle card click
  const handleCourseClick = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourseCode(null);
  };

  useEffect(() => {
    if (!openYear || !openSemester) return;
    
    // Update URL
    const params = new URLSearchParams();
    params.set('year', openYear.toString());
    params.set('semester', openSemester);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    
    // Fetch courses for the selected year and semester
    setLoading(true);
    setError(null);
    
    fetch(`/courses?year=${openYear}&semester=${encodeURIComponent(openSemester)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [openYear, openSemester]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4 flex-shrink-0 overflow-y-auto">
        {userEligibleYears.length === 0 ? (
          <div className="text-gray-500">No years available</div>
        ) : (
          userEligibleYears.map((year) => (
            <div key={year.value} className="space-y-2">
              <button
                onClick={() => setOpenYear(year.value)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  openYear === year.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {year.label}
              </button>
              {openYear === year.value && (
                <div className="ml-4 space-y-1">
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setOpenSemester(sem)}
                      className={`w-full text-left px-4 py-1.5 text-sm rounded-md transition-colors ${
                        openSemester === sem
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </aside>
      
      {/* Scrollable Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 overflow-y-auto h-full">
        <h2 className="text-2xl font-bold mb-4">
          Courses for {userEligibleYears.find(y => y.value === openYear)?.label} - {openSemester}
        </h2>

        
        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
        ) : (
          <div className="space-y-4">
            {courses.length > 0 ? (
              <div className="space-y-4">
                {!loading && !error && courses
                  .filter(course =>
                    course.year === YEARS.find(y => y.value === openYear)?.label &&
                    course.semester === (SEMESTERS.indexOf(openSemester) + 1)
                  )
                  .map((course) => (
                    <Card 
                      key={course.code}
                      className="p-6 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
                      onClick={() => handleCourseClick(course.code)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{course.code}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {course.credit_hour || 3} Credits
                        </span>
                      </div>
                      {course.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No courses found for {YEARS.find(y => y.value === openYear)?.label} - {openSemester}
              </div>
            )}
          </div>
        )}
        </div>
      </main>
      
      {selectedCourseCode && (
        <CourseDetailsModal
          courseCode={selectedCourseCode}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
