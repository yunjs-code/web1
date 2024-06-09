import React, { useState, useEffect } from 'react';
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userSeqNo, setUserSeqNo] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  let query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const token = query.get('token');
    const refreshToken = query.get('refresh_token');
    const userSeqNo = query.get('user_seq_no');
    if (token) {
      setToken(token);
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    if (userSeqNo) {
      setUserSeqNo(userSeqNo);
    }
  }, [query]);

  const handleAuth = () => {
    const clientId = '5a78ffbe-2e0a-466f-8305-f6cfaa603fb9';
    const redirectUri = 'http://localhost:8000/callback';  // 백엔드의 콜백 URL
    const scope = 'login inquiry transfer';
    const state = '12345678901234567890123456789012';
    const authType = '0';
    const cellphoneCertYn = 'Y';
    const authorizedCertYn = 'Y';

    const authUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&auth_type=${authType}&cellphone_cert_yn=${cellphoneCertYn}&authorized_cert_yn=${authorizedCertYn}`;
    
    window.location.href = authUrl;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('SignUp: ', { name, email, password, token, refreshToken, userSeqNo });
    const response = await fetch('http://localhost:8000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ name, email, password, token, refresh_token: refreshToken, user_seq_no: userSeqNo }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('User data submitted successfully');
    } else {
      alert(`Error: ${result.detail}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login: ', { email: loginEmail, password: loginPassword });
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ email: loginEmail, password: loginPassword }),
    });
  
    const result = await response.json();
    console.log('Login response: ', result);
    if (response.ok) {
      alert('Login successful');
      onLogin(result.name, result.access_token, result.user_seq_no);
      console.log('User logged in: ', result.name);
      navigate('/');
    } else {
      alert(`Error: ${result.detail}`);
    }
  };
  

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-github"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {token && <input type="text" value={token} readOnly placeholder="Token" />}
          <button type="button" className="verify-button" onClick={handleAuth}>인증 받기</button>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-github"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for login</span>
          <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
