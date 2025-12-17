import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

interface Assistant {
  id: number;
  name: string;
  email: string;
  academic_year: number;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
  year: string;
  semester: number;
  description: string;
  credit_hour: number;
}

export default function CourseDetails() {
  const { courseCode } = useParams<{ courseCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseCode) return;

    // Fetch course details
    fetch(`/courses/${courseCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course details");
        return res.json();
      })
      .then((courseData) => {
        setCourse(courseData);
        // Fetch assistants for this course
        return fetch(`/assistant_courses/by_course/${courseData.id}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assistants");
        return res.json();
      })
      .then((assistantsData) => {
        setAssistants(assistantsData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseCode]);

  const handleConnect = (assistantId: number) => {
    // TODO: Implement connection logic
    console.log('Connecting with assistant:', assistantId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || "Course not found"}</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back to Courses
          </Button>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.name}
                </h1>
                <p className="text-xl text-gray-600 mb-2">{course.code}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{course.year} - Semester {course.semester}</span>
                  <span>{course.credit_hour} Credits</span>
                </div>
              </div>
            </div>
            {course.description && (
              <p className="mt-4 text-gray-700">{course.description}</p>
            )}
          </Card>
        </div>

        {/* Available Assistants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Assistants ({assistants.filter(a => a.id !== user?.id).length})
          </h2>

          {assistants.filter(a => a.id !== user?.id).length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No assistants are currently available for this course.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assistants.filter(a => a.id !== user?.id).map((assistant) => (
                <Card key={assistant.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assistant.name}
                      </h3>
                      <p className="text-sm text-gray-600">{assistant.email}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {assistant.role === 'assistant' ? 'Teaching Assistant' : assistant.role}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleConnect(assistant.id)}
                    className="w-full"
                  >
                    Connect with Assistant
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}