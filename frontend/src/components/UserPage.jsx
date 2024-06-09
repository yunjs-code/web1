import React, { useEffect, useState } from 'react';

function UserPage({ accessToken, userSeqNo }) {
  const [userInfo, setUserInfo] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log(`Fetching user info with accessToken=${accessToken} and userSeqNo=${userSeqNo}`);
        const response = await fetch(`http://localhost:8000/user-info?access_token=${accessToken}&user_seq_no=${userSeqNo}`);
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched user info:', data);
        setUserInfo(data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    const fetchAccountInfo = async () => {
      try {
        console.log(`Fetching account info with accessToken=${accessToken} and userSeqNo=${userSeqNo}`);
        const response = await fetch(`http://localhost:8000/account-info?access_token=${accessToken}&user_seq_no=${userSeqNo}`);
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched account info:', data);
        setAccountInfo(data);
      } catch (error) {
        console.error("Failed to fetch account info:", error);
      }
    };

    if (accessToken && userSeqNo) {
      fetchUserInfo();
      fetchAccountInfo();
    } else {
      console.error('Missing access token or user sequence number');
    }
  }, [accessToken, userSeqNo]);

  if (!userInfo || !accountInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>유저 페이지</h1>
      <p>이름: {userInfo.user_name}</p>
      <h2>계좌 정보</h2>
      {accountInfo.res_list ? (
        accountInfo.res_list.map((account) => (
          <div key={account.fintech_use_num}>
            <p>계좌번호: {account.account_num_masked}</p>
            <p>잔액: {account.balance_amt} 원</p>
          </div>
        ))
      ) : (
        <p>계좌 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}

export default UserPage;
