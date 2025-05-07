import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/header';
import Home from './Components/home';
import UploadPage from './Components/UploadPage';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uploadImages" element={<UploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;