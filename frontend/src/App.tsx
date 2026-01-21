import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Header } from "./components/layouts";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

import { TestsListPage } from "./pages/test/TestsListPage";
import { TestStartPage } from "./pages/test/TestStartPage";
import { TestPage } from "./pages/test/TestPage";
import { TestResultsPage } from "./pages/test/TestResultsPage";

import { StorageService } from "./services/storage";
import { authStore } from "./stores/authStore";

const TestSessionGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const session = StorageService.getSession();
    if (!session) return;

    const targetPath = `/tests/${session.testId}`;
    if (location.pathname.startsWith(targetPath)) return;

    navigate(targetPath, { replace: true });
  }, [location.pathname, navigate]);

  return null;
};

function App() {
  useEffect(() => {
    authStore.init();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <TestSessionGuard />
        <Header />
        <main className="flex flex-1 items-center justify-center p-6">
          <Routes>
            <Route path="/" element={<TestsListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tests/:testId/start" element={<TestStartPage />} />
            <Route path="/tests/:testId/results" element={<TestResultsPage />} />
            <Route path="/tests/:testId" element={<TestPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
