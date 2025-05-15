import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/header";
import Home from "./Components/home";
import UploadMenu from "./Components/UploadPage";
import ResultsPage from "./Components/ResultsPage";
import { UniverseLoader } from "./Components/Loader/UniverseLoader";
import TodoList from "./Components/TodoList";

// Component to handle loader logic on route changes
const RouteChangeHandler: React.FC<{ setIsLoading: (value: boolean) => void }> = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [location, setIsLoading]); // Trigger on route change

  return null;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#1A0033]">
        {isLoading && <UniverseLoader />}
        <RouteChangeHandler setIsLoading={setIsLoading} />
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/uploadImages" element={<UploadMenu />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/todos" element={<TodoList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;