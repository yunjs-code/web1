import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AuthResult from './components/AuthResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authResult" element={<AuthResult />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
