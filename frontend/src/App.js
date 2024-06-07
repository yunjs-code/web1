import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AuthResult from './components/AuthResult';
import Header from './components/Header';
import Hero from './components/Hero';
import Feature from './components/Feature';
import Footer from './components/Footer';

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  return (
    <Router>
      <Header onLoginClick={handleLoginClick} />
      <Routes>
        <Route path="/authResult" element={<AuthResult />} />
        {isLoginVisible && <Route path="/login" element={<Login />} />}
      </Routes>
      {!isLoginVisible && (
        <>
          <Hero />
          <Feature />
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
