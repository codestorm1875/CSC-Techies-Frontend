import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import { RocketIcon } from "lucide-react";
import { motion } from "framer-motion";
import Quizzes from "./pages/Quizzes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

const Landing = lazy(() => import("./pages/Landing"));
const OverviewPage = lazy(() => import("@/pages/Overview"));
const Timetable = lazy(() => import("./pages/Timetable"));
const CoursesList = lazy(() => import("./pages/Courses"));
const MaterialsPage = lazy(() => import("./pages/Materials"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ExamPage = lazy(() => import("./pages/Exams"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const AdminMaterials = lazy(() => import("./pages/admin/Materials"));
const AdminExams = lazy(() => import("./pages/admin/Exams"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="bottom-center" />
        <Suspense
          fallback={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: [40, 0, -10, 0], opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <RocketIcon size={56} color="#4F46E5" style={{ filter: "drop-shadow(0 2px 8px #6366f1aa)" }} />
              </motion.div>
              <span style={{ marginTop: "1.5rem", color: "#4F46E5", fontWeight: 600, fontSize: "1.15rem", letterSpacing: 0.2 }}>
                Loading the page...
              </span>
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<><Navbar /><Landing /></>} />
            <Route path="/overview" element={<><Navbar /><OverviewPage /></>} />
            <Route path="/timetable" element={<><Navbar /><Timetable /></>} />
            <Route path="/exams" element={<><Navbar /><ExamPage /></>} />
            <Route path="/courses" element={<><Navbar /><CoursesList /></>} />
            <Route path="/materials" element={<><Navbar /><MaterialsPage /></>} />
            <Route path="/quizzes" element={<><Navbar /><Quizzes /></>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="materials" element={<AdminMaterials />} />
              <Route path="exams" element={<AdminExams />} />
              <Route path="timetable" element={<div className="p-8 text-center text-gray-500">Timetable management coming soon...</div>} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="semesters" element={<div className="p-8 text-center text-gray-500">Semesters management coming soon...</div>} />
              <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon...</div>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
