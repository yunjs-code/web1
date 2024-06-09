import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Hero from './components/Hero';
import Feature from './components/Feature';
import Footer from './components/Footer';
import UserPage from './components/UserPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userSeqNo, setUserSeqNo] = useState('');

  // 로컬 스토리지에서 로그인 상태를 불러옴
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserName = localStorage.getItem('userName');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUserSeqNo = localStorage.getItem('userSeqNo');

    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      setUserName(storedUserName);
      setAccessToken(storedAccessToken);
      setUserSeqNo(storedUserSeqNo);
    }
  }, []);

  const handleLogin = (name, token, seqNo) => {
    console.log(`Logged in with name=${name}, token=${token}, seqNo=${seqNo}`);
    setLoggedIn(true);
    setUserName(name);
    setAccessToken(token);
    setUserSeqNo(seqNo);

    // 로그인 상태를 로컬 스토리지에 저장
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userSeqNo', seqNo);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    setAccessToken('');
    setUserSeqNo('');

    // 로그아웃 시 로컬 스토리지에서도 삭제
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userSeqNo');
  };

  return (
    <Router>
      <Header 
        loggedIn={loggedIn}
        userName={userName}
        onLogoutClick={handleLogout}
        accessToken={accessToken}
        userSeqNo={userSeqNo}
      />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/user" element={<UserPage accessToken={accessToken} userSeqNo={userSeqNo} />} />
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
