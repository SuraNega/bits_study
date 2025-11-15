import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/context/AuthContext";

const YEARS = [
  { label: "Freshman", value: 1 },
  { label: "Sophomore", value: 2 },
  { label: "Junior", value: 3 },
  { label: "Senior", value: 4 },
];
const SEMESTERS = ["Semester 1", "Semester 2"];
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AssistantDashboard() {
  const { user } = useAuth();
  const academicYear = user?.academic_year ?? 1; // fallback to 1 if not logged in

  // Early return for 1st year students
  if (academicYear === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              1st year students are not eligible to become teaching assistants.
              You must be at least in your 2nd year to assist courses.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eligibleYears = YEARS.filter((y) => y.value < academicYear);
  // Read from URL
  const params = new URLSearchParams(window.location.search);
  const urlYear = Number(params.get("year"));
  const urlSemester = params.get("semester");
  const [openYear, setOpenYear] = useState<number | null>(
    urlYear && eligibleYears.some((y) => y.value === urlYear)
      ? urlYear
      : eligibleYears.length > 0
      ? eligibleYears[0].value
      : null
  );
  const [openSemester, setOpenSemester] = useState<string>(
    urlSemester && SEMESTERS.includes(urlSemester) ? urlSemester : SEMESTERS[0]
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set()
  );
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [assignedCourses, setAssignedCourses] = useState<Set<string>>(
    new Set()
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [existingAvailability, setExistingAvailability] = useState<any[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!openYear || !openSemester) return;
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

  // Fetch assigned courses and availability for the current user
  useEffect(() => {
    if (!user?.id) return;

    // Fetch assigned courses
    fetch(`/assistant_courses/by_assistant/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assigned courses");
        return res.json();
      })
      .then((data) => {
        const assignedCodes = new Set(data.map((ac: any) => ac.course.code));
        setAssignedCourses(assignedCodes);
        setSelectedCourses(new Set(assignedCodes)); // Initialize selected with assigned
        setExistingAssignments(data); // Store full assignment data
      })
      .catch((err) => console.error("Failed to fetch assigned courses:", err));

    // Fetch existing availability
    fetch(`/available_times/by_assistant/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch availability");
        return res.json();
      })
      .then((data) => {
        setExistingAvailability(data);
        if (data.length > 0) {
          // Pre-populate form with existing availability (assuming same times for all courses)
          const firstAvailability = data[0];
          setStartTime(firstAvailability.start_time.substring(0, 5)); // HH:MM format
          setEndTime(firstAvailability.end_time.substring(0, 5)); // HH:MM format

          // Get unique days from all availability records
          const daysSet = new Set(data.map((av: any) => av.day));
          const uniqueDays = Array.from(daysSet) as string[];
          setSelectedDays(uniqueDays);
        }
      })
      .catch((err) => console.error("Failed to fetch availability:", err));
  }, [user?.id]);

  const toggleCourse = (code: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      setHasChanges(true);
      return next;
    });
  };

  const removeCourse = (code: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleUpdateCourses = async () => {
    try {
      // For course updates, send empty availability updates
      const response = await fetch(
        "/assistant_courses/bulk_update_with_availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assistant_id: user?.id,
            course_ids: Array.from(selectedCourses),
            availability_updates: [],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(
          `Courses updated successfully! Added ${data.added_courses_count} courses, removed ${data.removed_courses_count} courses.`
        );
        setAssignedCourses(new Set(Array.from(selectedCourses)));
        setHasChanges(false);
        // Update existing availability with the response data
        setExistingAvailability(data.data.updated_availability || []);
        // Refresh to show updated state
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(
          `Error: ${
            errorData.error || errorData.errors?.join(", ") || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating courses:", error);
      alert(`An error occurred while updating courses: ${error.message}`);
    }
  };

  const handleAvailabilitySubmit = async () => {
    if (selectedDays.length === 0) {
      alert("Please select at least one day.");
      return;
    }
    if (!startTime || !endTime) {
      alert("Please select both start and end times.");
      return;
    }
    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    try {
      const response = await fetch(
        "/assistant_courses/bulk_update_with_availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assistant_id: user?.id,
            course_ids: Array.from(selectedCourses),
            availability_updates: Array.from(selectedCourses).map(
              (courseCode) => ({
                course_code: courseCode,
                availability: {
                  days: selectedDays,
                  start_time: startTime,
                  end_time: endTime,
                },
              })
            ),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const message =
          data.added_courses_count > 0 || data.removed_courses_count > 0
            ? `Success! Added ${data.added_courses_count} courses, removed ${data.removed_courses_count} courses, and updated ${data.available_times_count} availability slots.`
            : `Success! Availability updated with ${data.available_times_count} time slots.`;

        alert(message);
        setIsModalOpen(false);
        // Update assigned courses to reflect the newly assigned ones
        setAssignedCourses(new Set(Array.from(selectedCourses)));
        setHasChanges(false);
        // Update existing availability and refresh the page to show latest data
        setExistingAvailability(data.data.updated_availability || []);
        // Force a page reload to ensure UI reflects the latest database state
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(
          `Error: ${
            errorData.error || errorData.errors?.join(", ") || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
      alert(
        `An error occurred while saving your availability: ${error.message}`
      );
    }
  };

  const handleSubmit = () => {
    // Fetch existing availability data and assignment details before opening modal
    if (!user?.id) return;

    Promise.all([
      fetch(`/available_times/by_assistant/${user.id}`),
      fetch(`/assistant_courses/by_assistant/${user.id}`),
    ])
      .then(async ([availabilityRes, assignmentsRes]) => {
        if (!availabilityRes.ok)
          throw new Error("Failed to fetch availability");
        if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");

        const [availabilityData, assignmentsData] = await Promise.all([
          availabilityRes.json(),
          assignmentsRes.json(),
        ]);

        setExistingAvailability(availabilityData);
        setExistingAssignments(assignmentsData);

        if (availabilityData.length > 0) {
          // Pre-populate form with existing availability (assuming same times for all courses)
          const firstAvailability = availabilityData[0];
          setStartTime(firstAvailability.start_time.substring(0, 5)); // HH:MM format
          setEndTime(firstAvailability.end_time.substring(0, 5)); // HH:MM format

          // Get unique days from all availability records
          const daysSet = new Set(availabilityData.map((av: any) => av.day));
          const uniqueDays = Array.from(daysSet) as string[];
          setSelectedDays(uniqueDays);
        } else {
          // Reset form if no existing availability
          setStartTime("");
          setEndTime("");
          setSelectedDays([]);
        }

        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        // Reset form and open modal even if fetch fails
        setStartTime("");
        setEndTime("");
        setSelectedDays([]);
        setIsModalOpen(true);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 flex flex-col gap-4">
        {eligibleYears.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No eligible years to assist based on your academic year.
          </div>
        ) : (
          eligibleYears.map((year) => (
            <div key={year.value}>
              <button
                className={`w-full text-left font-semibold py-2 px-3 rounded hover:bg-blue-50 transition ${
                  openYear === year.value ? "bg-blue-100 text-blue-700" : ""
                }`}
                onClick={() =>
                  setOpenYear(openYear === year.value ? null : year.value)
                }
              >
                {year.label}
              </button>
              {/* Semesters Toggle */}
              {openYear === year.value && (
                <div className="ml-4 mt-2 flex flex-col gap-1">
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem}
                      className={`text-sm py-1 px-2 rounded hover:bg-blue-50 transition ${
                        openSemester === sem ? "bg-blue-200 text-blue-800" : ""
                      }`}
                      onClick={() => setOpenSemester(sem)}
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
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 gap-6 relative">
        <h2 className="text-2xl font-bold mb-4">
          Courses for {YEARS.find((y) => y.value === openYear)?.label} -{" "}
          {openSemester}
        </h2>
        <div className="flex flex-col gap-6">
          {loading && <div>Loading courses...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <>
              {/* Selected Courses Section */}
              {Array.from(selectedCourses).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">
                    Selected Courses ({Array.from(selectedCourses).length})
                  </h3>
                  <div className="grid gap-3">
                    {courses
                      .filter(
                        (course) =>
                          course.year ===
                            YEARS.find((y) => y.value === openYear)?.label &&
                          course.semester ===
                            SEMESTERS.indexOf(openSemester) + 1 &&
                          selectedCourses.has(course.code)
                      )
                      .map((course) => (
                        <Card
                          key={course.code}
                          className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 cursor-pointer transition border-2 border-green-500 bg-green-50"
                          onClick={() => toggleCourse(course.code)}
                        >
                          <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start md:items-center w-full">
                            <span className="font-semibold w-full md:w-1/3">
                              {course.name}
                            </span>
                            <span className="w-full md:w-1/6 text-gray-600">
                              {course.code}
                            </span>
                            <span className="w-full md:w-1/6 text-gray-600">
                              Year {course.year}
                            </span>
                            <span className="w-full md:w-1/6 text-gray-600">
                              {course.credit_hour} Credit Hour
                            </span>
                          </div>
                          {course.description && (
                            <div className="text-gray-500 text-sm mt-2 md:mt-0 md:ml-8 w-full">
                              {course.description}
                            </div>
                          )}
                          <div className="ml-4 flex items-center">
                            <span className="text-green-600 font-medium mr-2">
                              Selected
                            </span>
                            <input
                              type="checkbox"
                              checked={true}
                              readOnly
                              className="accent-green-600 w-5 h-5"
                            />
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Available Courses Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-700">
                  Available Courses{" "}
                  {Array.from(selectedCourses).length > 0 &&
                    `(${
                      courses.filter(
                        (course) =>
                          course.year ===
                            YEARS.find((y) => y.value === openYear)?.label &&
                          course.semester ===
                            SEMESTERS.indexOf(openSemester) + 1 &&
                          !selectedCourses.has(course.code)
                      ).length
                    } available)`}
                </h3>
                <div className="grid gap-3">
                  {courses
                    .filter(
                      (course) =>
                        course.year ===
                          YEARS.find((y) => y.value === openYear)?.label &&
                        course.semester ===
                          SEMESTERS.indexOf(openSemester) + 1 &&
                        !selectedCourses.has(course.code)
                    )
                    .map((course) => (
                      <Card
                        key={course.code}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 cursor-pointer transition border-2 border-gray-200 bg-white hover:border-blue-300"
                        onClick={() => toggleCourse(course.code)}
                      >
                        <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start md:items-center w-full">
                          <span className="font-semibold w-full md:w-1/3">
                            {course.name}
                          </span>
                          <span className="w-full md:w-1/6 text-gray-600">
                            {course.code}
                          </span>
                          <span className="w-full md:w-1/6 text-gray-600">
                            Year {course.year}
                          </span>
                          <span className="w-full md:w-1/6 text-gray-600">
                            {course.credit_hour} Credit Hour
                          </span>
                        </div>
                        {course.description && (
                          <div className="text-gray-500 text-sm mt-2 md:mt-0 md:ml-8 w-full">
                            {course.description}
                          </div>
                        )}
                        <input
                          type="checkbox"
                          checked={false}
                          readOnly
                          className="ml-4 accent-blue-600 w-5 h-5"
                        />
                      </Card>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Action buttons */}
        <div className="sticky bottom-0 left-0 w-full bg-gray-50 pt-6 pb-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <Button
                variant="outline"
                className="px-6 py-3 text-sm font-medium border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={handleUpdateCourses}
              >
                Update Courses ({Array.from(selectedCourses).length} selected)
              </Button>
            )}
            {Array.from(selectedCourses).length > 0 && (
              <span className="text-sm text-gray-600">
                {Array.from(selectedCourses).length} course
                {Array.from(selectedCourses).length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              disabled={selectedCourses.size === 0}
              onClick={handleSubmit}
            >
              Set Time
            </Button>
          </div>
        </div>
      </main>

      {/* Selected Courses Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Set Your Availability</DialogTitle>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Selected Courses</h3>
              {selectedCourses.size === 0 ? (
                <p className="text-gray-500">No courses selected.</p>
              ) : (
                <ul className="space-y-2">
                  {Array.from(selectedCourses).map((code) => {
                    const course = courses.find((c) => c.code === code);
                    return (
                      <li
                        key={code}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="font-medium">
                          {course?.name || code}
                        </span>
                        <button
                          onClick={() => removeCourse(code)}
                          className="text-red-500 hover:text-red-700 font-bold text-lg"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Days
                {existingAvailability.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Edit existing availability)
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Time Slots
                {existingAvailability.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Edit existing time slots)
                  </span>
                )}
              </h3>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    step="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    step="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAvailabilitySubmit}>
                {existingAvailability.length > 0
                  ? "Update Availability"
                  : "Submit Availability"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
