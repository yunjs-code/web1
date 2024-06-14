import React, { useEffect, useState } from 'react';
import './News.css';

function News() {
  const [news, setNews] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/news')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched news data:", data); // 데이터를 콘솔에 출력하여 확인
        setNews(data.naver);
      })
      .catch(error => console.error('Error fetching news:', error));
  }, []);

  return (
    <div className="news-container">
      <section className="news">
        {Object.keys(news).map(category => (
          <div className="news-section" key={category}>
            <h3>{category} 뉴스</h3>
            <ul>
              {news[category].length ? news[category].map((article, index) => (
                <li key={index}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
                </li>
              )) : <li>{category} 뉴스 없음</li>}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default News;
