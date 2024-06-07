import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Hero from './components/Hero';
import Feature from './components/Feature';
import Footer from './components/Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name) => {
    setLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
  };

  return (
    <Router>
      <Header 
        loggedIn={loggedIn}
        userName={userName}
        onLogoutClick={handleLogout}
      />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
          <>
            <Hero />
            <Feature />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
