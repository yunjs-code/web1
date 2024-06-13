import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import News from './components/News';
import Stock from './components/Stock';
import Glossary from './components/Glossary';
import AccountInfo from './components/AccountInfo';
import UserPage from './components/UserPage';
import FAB from './components/FAB';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userSeqNo, setUserSeqNo] = useState('');
  const [email, setEmail] = useState('');
  const [profitData, setProfitData] = useState([]);
  const [fluctuationData, setFluctuationData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

    fetch('http://localhost:8000/profit-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setProfitData(data.slice(0, 5)) : setProfitData([]))
      .catch(error => console.error('Error fetching profit data:', error));

    fetch('http://localhost:8000/fluctuation-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setFluctuationData(data.slice(0, 5)) : setFluctuationData([]))
      .catch(error => console.error('Error fetching fluctuation data:', error));

    fetch('http://localhost:8000/volume-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setVolumeData(data.slice(0, 5)) : setVolumeData([]))
      .catch(error => console.error('Error fetching volume data:', error));
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

    window.location.href = 'http://localhost:3000/';
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + 3) % 3);
  };

  return (
    <Router>
      <div>
        {loggedIn && <FAB onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/" 
            element={!loggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/main" />} 
          />
          <Route 
            path="/main" 
            element={loggedIn ? (
              <div className="container">
                <div className="header">제목</div>
                <Link to="/news" className="grid-item news">news</Link>
                <div className="grid-item stock">
                  <div className="slide-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    <StockSlide title="Stock - Box 1" data={profitData} />
                    <StockSlide title="Stock - Box 2" data={fluctuationData} />
                    <StockSlide title="Stock - Box 3" data={volumeData} />
                  </div>
                  <div className="slide-buttons">
                    <button className="slide-button" onClick={prevSlide}>◀</button>
                    <button className="slide-button" onClick={nextSlide}>▶</button>
                  </div>
                </div>
                <Link to="/account-info" className="grid-item account-info">account-info</Link>
                <Link to="/glossary" className="grid-item glossary">glossary</Link>
              </div>
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
        </Routes>
      </div>
    </Router>
  );
}

function StockSlide({ title, data }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/stock');
  };

  return (
    <div className="slide">
      <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>{title}</h2>
      <div className="table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>종목명</th>
              <th>현재가</th>
              <th>전일 대비</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.data_rank}</td>
                <td>{item.hts_kor_isnm}</td>
                <td>{item.stck_prpr.toLocaleString()}</td>
                <td className={item.prdy_vrss_sign === '2' ? 'up' : 'down'}>
                  {item.prdy_vrss_sign === '2' ? '▲' : '▼'}
                  {item.prdy_vrss.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
