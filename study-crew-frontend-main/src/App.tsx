import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import HomePage from '@/pages/home/page';
import AssistantDashboard from '@/pages/dashboard/assistant';
import UserDashboard from '@/pages/dashboard/user';
import CourseDetails from '@/pages/course-details';
import AboutPage from '@/pages/about/page';
import ContactPage from '@/pages/contact/page';
import { AuthModalProvider } from '@/components/context/AuthModalContext';
import { AuthModalRoot } from '@/components/context/AuthModalRoot';

function App() {
  return (
    <AuthModalProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard/assistant" element={<AssistantDashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/courses/:courseCode" element={<CourseDetails />} />
            {/* Redirect old student route to user for backward compatibility */}
            <Route path="/dashboard/student" element={<Navigate to="/dashboard/user" replace />} />
            {/* No direct login/register routes */}
          </Routes>
          <AuthModalRoot />
        </MainLayout>
      </Router>
    </AuthModalProvider>
  );
}

export default App;
