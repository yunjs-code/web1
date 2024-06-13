import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import News from './components/News';
import PersonalFinance from './components/PersonalFinance';
import Stock from './components/Stock';
import Glossary from './components/Glossary';
import AccountInfo from './components/AccountInfo';
import ExchangeRate from './components/ExchangeRate';
import UserPage from './components/UserPage';
import FAB from './components/FAB';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userSeqNo, setUserSeqNo] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserName = localStorage.getItem('userName');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUserSeqNo = localStorage.getItem('userSeqNo');
    const storedEmail = localStorage.getItem('email');

    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      setUserName(storedUserName);
      setAccessToken(storedAccessToken);
      setUserSeqNo(storedUserSeqNo);
      setEmail(storedEmail);
    }
  }, []);

  const handleLogin = (name, token, seqNo, userEmail) => {
    setLoggedIn(true);
    setUserName(name);
    setAccessToken(token);
    setUserSeqNo(seqNo);
    setEmail(userEmail);

    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userSeqNo', seqNo);
    localStorage.setItem('email', userEmail);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    setAccessToken('');
    setUserSeqNo('');
    setEmail('');

    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userSeqNo');
    localStorage.removeItem('email');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!loggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/main" />} 
        />
        <Route 
          path="/main" 
          element={loggedIn ? (
            <>
              <div className="grid-container">
                <Link to="/news" className="grid-item news">News</Link>
                <div className="grid-item personal-finance"><PersonalFinance /></div>
                <Link to="/stock" className="grid-item stock">Stock</Link>
                <Link to="/glossary" className="grid-item glossary">Glossary</Link>
                <Link to="/account-info" className="grid-item account-info">Account Info</Link>
                <Link to="/exchange-rate" className="grid-item exchange-rate">Exchange Rate</Link>
              </div>
              <FAB onLogout={handleLogout} />
            </>
          ) : (
            <Navigate to="/" />
          )} 
        />
        <Route 
          path="/user" 
          element={loggedIn ? <UserPage accessToken={accessToken} userSeqNo={userSeqNo} /> : <Navigate to="/" />} 
        />
        <Route path="/news" element={<News />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/account-info" element={<AccountInfo accessToken={accessToken} userSeqNo={userSeqNo} />} />
        <Route path="/exchange-rate" element={<ExchangeRate />} />
      </Routes>
    </Router>
  );
}

export default App;
