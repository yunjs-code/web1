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
  const [refreshToken, setRefreshToken] = useState('');
  const [userSeqNo, setUserSeqNo] = useState('');

  // 토큰 갱신 함수
  const refreshAccessToken = async () => {
    const response = await fetch('http://localhost:8000/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ refresh_token: refreshToken }),
    });

    const result = await response.json();
    if (response.ok) {
      setAccessToken(result.access_token);
      localStorage.setItem('accessToken', result.access_token);
    } else {
      alert(`Error: ${result.detail}`);
    }
  };

  // 로컬 스토리지에서 로그인 상태를 불러옴
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedUserName = localStorage.getItem('userName');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserSeqNo = localStorage.getItem('userSeqNo');

    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
      setUserName(storedUserName);
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserSeqNo(storedUserSeqNo);
    }

    // 액세스 토큰이 존재하면 갱신 시도
    if (storedAccessToken) {
      refreshAccessToken();
    }
  }, []);

  const handleLogin = (name, token, refresh_token, seqNo) => {
    setLoggedIn(true);
    setUserName(name);
    setAccessToken(token);
    setRefreshToken(refresh_token);
    setUserSeqNo(seqNo);

    // 로그인 상태를 로컬 스토리지에 저장
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('userSeqNo', seqNo);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
    setAccessToken('');
    setRefreshToken('');
    setUserSeqNo('');

    // 로그아웃 시 로컬 스토리지에서도 삭제
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userSeqNo');
  };

  return (
    <Router>
      {loggedIn && (
        <Header 
          loggedIn={loggedIn}
          userName={userName}
          onLogoutClick={handleLogout}
          accessToken={accessToken}
          userSeqNo={userSeqNo}
        />
      )}
      <Routes>
        {!loggedIn ? (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/user" element={<UserPage accessToken={accessToken} userSeqNo={userSeqNo} />} />
            <Route path="/" element={
              <>
                <Hero />
                <Feature />
                <Footer />
              </>
            } />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
