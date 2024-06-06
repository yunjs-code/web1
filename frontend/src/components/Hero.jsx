import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <h1>가계부, 이제 쓰지말고 읽기만 하세요</h1>
      <p>나의 소비는 물론 생활패턴까지 분석하는 비주얼 가계부</p>
      <div className="buttons">
        <button className="google-play">GOOGLE PLAY</button>
        <button className="web">WEB</button>
      </div>
    </section>
  );
}

export default Hero;
