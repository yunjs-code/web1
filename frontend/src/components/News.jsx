import React, { useEffect, useState } from 'react';
import './News.css';

function News() {
  const [news, setNews] = useState({ naver: [], daum: [], hankyeong: [], maeil: [] });

  useEffect(() => {
    fetch('http://localhost:8000/news')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched news data:", data); // 데이터를 콘솔에 출력하여 확인
        setNews(data);
      })
      .catch(error => console.error('Error fetching news:', error));
  }, []);

  return (
    <div className="news-container">
      <section className="news">
        <div className="news-section">
          <h3>네이버 뉴스</h3>
          <ul>
            {news.naver.length ? news.naver.map((article, index) => (
              <li key={index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              </li>
            )) : <li>네이버 뉴스 없음</li>}
          </ul>
        </div>
        <div className="news-section">
          <h3>다음 뉴스</h3>
          <ul>
            {news.daum.length ? news.daum.map((article, index) => (
              <li key={index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              </li>
            )) : <li>다음 뉴스 없음</li>}
          </ul>
        </div>
        <div className="news-section">
          <h3>한국경제</h3>
          <ul>
            {news.hankyeong.length ? news.hankyeong.map((article, index) => (
              <li key={index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              </li>
            )) : <li>한국경제 뉴스 없음</li>}
          </ul>
        </div>
        <div className="news-section">
          <h3>매일경제</h3>
          <ul>
            {news.maeil.length ? news.maeil.map((article, index) => (
              <li key={index}>
                <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              </li>
            )) : <li>매일경제 뉴스 없음</li>}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default News;
