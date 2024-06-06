import React from 'react';
import './Header.css';

function Header({ onLoginClick }) {
  return (
    <header className="header">
      <div className="logo">visual bank</div>
      <nav>
        <ul>
          <li><a href="#">가계부</a></li>
          <li><a href="#">주식</a></li>
          <li><a href="#">부동산</a></li>
          <li><a href="#">커뮤니티</a></li>
        </ul>
      </nav>
      <div className="auth">
        <button className="login" onClick={onLoginClick}>로그인</button>
      </div>
    </header>
  );
}

export default Header;
