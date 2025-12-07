import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/context/AuthContext";
import CourseDetailsModal from "@/components/CourseDetailsModal";

const YEARS = [
  { label: "Freshman", value: 1 },
  { label: "Sophomore", value: 2 },
  { label: "Junior", value: 3 },
  { label: "Senior", value: 4 },
];
const SEMESTERS = ["Semester 1", "Semester 2"];

export default function UserDashboard() {
  const { user } = useAuth();
  const academicYear = user?.academic_year ?? 1;
  const userEligibleYears = YEARS.filter((y) => y.value <= academicYear);

  const params = new URLSearchParams(window.location.search);
  const urlYear = Number(params.get("year"));
  const urlSemester = params.get("semester");

  const [openYear, setOpenYear] = useState<number | null>(
    urlYear && userEligibleYears.some((y) => y.value === urlYear)
      ? urlYear
      : userEligibleYears.length > 0
      ? userEligibleYears[0].value
      : null
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
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    null
  );

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

    const params = new URLSearchParams();
    params.set("year", openYear.toString());
    params.set("semester", openSemester);
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);

    setLoading(true);
    setError(null);

    fetch(
      `/courses?year=${openYear}&semester=${encodeURIComponent(openSemester)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [openYear, openSemester]);

  const filteredCourses = courses.filter(
    (course) =>
      course.year === YEARS.find((y) => y.value === openYear)?.label &&
      course.semester === SEMESTERS.indexOf(openSemester) + 1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Decorative Background Elements - Full Page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content - Full Width */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-8">
        {/* User Greeting - Hidden on Mobile */}
        <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.email}!
              </h1>
              <p className="text-sm text-gray-600">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-sm font-semibold text-green-800">
              Year {academicYear}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Year & Semester Selection */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Filter by Year
              </h3>

              {userEligibleYears.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No years available
                </div>
              ) : (
                <div className="space-y-2">
                  {userEligibleYears.map((year) => (
                    <div key={year.value} className="space-y-1">
                      <button
                        onClick={() => setOpenYear(year.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          openYear === year.value
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                            : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:scale-102"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{year.label}</span>
                          {openYear === year.value && (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      {openYear === year.value && (
                        <div className="ml-4 space-y-1 mt-2">
                          {SEMESTERS.map((sem) => (
                            <button
                              key={sem}
                              onClick={() => setOpenSemester(sem)}
                              className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                                openSemester === sem
                                  ? "bg-green-100 text-green-800 font-semibold shadow-sm"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                              }`}
                            >
                              {sem}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Course List */}
          <main className="flex-1">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {YEARS.find((y) => y.value === openYear)?.label} -{" "}
                {openSemester}
              </h2>
              <p className="text-gray-600">
                Click on any course to view available assistants
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading courses...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start">
                <svg
                  className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Error loading courses
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Course Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Card
                      key={course.code}
                      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 border-green-100 bg-white hover:scale-105 hover:border-green-300"
                      onClick={() => handleCourseClick(course.code)}
                    >
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-green-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative p-6">
                        {/* Course Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                              {course.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                {course.code}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                {course.credit_hour || 3} Credits
                              </span>
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <div className="flex-shrink-0 ml-4 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                            <svg
                              className="w-5 h-5 text-green-600 group-hover:text-white group-hover:translate-x-1 transition-all"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Course Description */}
                        {course.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {course.description}
                          </p>
                        )}

                        {/* Course Details */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            Year {course.year}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Semester {course.semester}
                          </div>
                        </div>
                      </div>

                      {/* Click Indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No courses found
                      </h3>
                      <p className="text-gray-600">
                        No courses available for{" "}
                        {YEARS.find((y) => y.value === openYear)?.label} -{" "}
                        {openSemester}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourseCode && (
        <CourseDetailsModal
          courseCode={selectedCourseCode}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
