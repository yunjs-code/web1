import React, { useEffect, useState } from 'react';

function DebugPage({ category }) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/debug-page/${category}`)
      .then(response => response.text())
      .then(data => {
        setHtmlContent(data);
      })
      .catch(error => console.error('Error fetching page content:', error));
  }, [category]);

  return (
    <div>
      <h2>{category} 페이지 HTML 내용</h2>
      <pre>{htmlContent}</pre>
    </div>
  );
}

export default DebugPage;
