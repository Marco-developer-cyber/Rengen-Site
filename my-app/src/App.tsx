import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/header";
import Home from "./Components/home";
import UploadMenu from "./Components/UploadPage";
import ResultsPage from "./Components/ResultsPage";
import { UniverseLoader } from "./Components/Loader/UniverseLoader";

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
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ name: string, surname: string, age: string, doctor: string } | null>(null);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = (selectedFile: File, selectedFileUrl: string, metadata: { name: string, surname: string, age: string, doctor: string }) => {
    setFile(selectedFile);
    setFileUrl(selectedFileUrl);
    setMetadata(metadata);
  };

  const handleBack = () => {
    setFile(null);
    setFileUrl(null);
    // Не сбрасываем metadata, чтобы данные сохранялись
  };

  return (
    <Router>
      {isLoading && <UniverseLoader />}
      <RouteChangeHandler setIsLoading={setIsLoading} />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/uploadImages"
          element={
            !file ? (
              <UploadMenu onFileSelect={handleFileSelect} />
            ) : (
              <ResultsPage file={file} fileUrl={fileUrl} onBack={handleBack} metadata={metadata} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;