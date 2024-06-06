import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    if (code) {
      fetchToken(code);
    }
  }, [location]);

  const fetchToken = async (code) => {
    try {
      const response = await fetch('http://localhost:8000/auth/get_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ code })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Token request failed');
      }

      console.log('Access token:', data.access_token);
      navigate('/', { state: { accessToken: data.access_token, userSeqNo: data.user_seq_no } });
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  return (
    <div>
      <h1>Authentication Result</h1>
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthResult;
