import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ loggedIn, userName, onLogoutClick }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogoutClick();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleUserPageClick = () => {
    navigate('/user');
  };

  return (
    <header className="header">
      <div className="logo"><a href="/">은행</a></div>
      <nav>
        <ul>
          <li><a href="#">가계부</a></li>
          <li><a href="#">주식</a></li>
          <li><a href="#">부동산</a></li>
          <li><a href="#">커뮤니티</a></li>
        </ul>
      </nav>
      <div className="auth">
        {loggedIn ? (
          <div>
            <span onClick={handleUserPageClick} style={{ cursor: 'pointer' }}>{userName}</span>
            <button className="logout" onClick={handleLogoutClick}>로그아웃</button>
          </div>
        ) : (
          <button className="login" onClick={handleLoginClick}>로그인</button>
        )}
      </div>
    </header>
  );
}

export default Header;
