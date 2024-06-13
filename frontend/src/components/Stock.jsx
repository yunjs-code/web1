import React, { useState, useEffect } from 'react';
import './Stock.css';
import FAB from './FAB';
import { useNavigate } from 'react-router-dom';

function Stock() {
  const [profitData, setProfitData] = useState([]);
  const [fluctuationData, setFluctuationData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/profit-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setProfitData(data) : setProfitData([]))
      .catch(error => console.error('Error fetching profit data:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/fluctuation-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setFluctuationData(data) : setFluctuationData([]))
      .catch(error => console.error('Error fetching fluctuation data:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/volume-ranking')
      .then(response => response.json())
      .then(data => Array.isArray(data) ? setVolumeData(data) : setVolumeData([]))
      .catch(error => console.error('Error fetching volume data:', error));
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리 로직
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userSeqNo');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="page">
        <div className="box box1">
          <h1>국내주식 수익자산지표 순위</h1>
          <div className="table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>종목명</th>
                  <th>종목코드</th>
                  <th>현재가</th>
                  <th>전일 대비</th>
                  <th>전일 대비율</th>
                  <th>누적 거래량</th>
                  <th>매출 총 이익</th>
                  <th>영업 이익</th>
                  <th>경상 이익</th>
                  <th>당기순이익</th>
                  <th>자산총계</th>
                  <th>부채총계</th>
                  <th>자본총계</th>
                </tr>
              </thead>
              <tbody>
                {profitData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.data_rank}</td>
                    <td>{item.hts_kor_isnm}</td>
                    <td>{item.mksc_shrn_iscd}</td>
                    <td>{item.stck_prpr.toLocaleString()}</td>
                    <td className={item.prdy_vrss_sign === '2' ? 'up' : 'down'}>
                      {item.prdy_vrss_sign === '2' ? '▲' : '▼'}
                      {item.prdy_vrss.toLocaleString()}
                    </td>
                    <td className={item.prdy_vrss_sign === '2' ? 'up' : 'down'}>
                      {item.prdy_ctrt}%
                    </td>
                    <td>{item.acml_vol.toLocaleString()}</td>
                    <td>{item.sale_totl_prfi.toLocaleString()}</td>
                    <td>{item.bsop_prti.toLocaleString()}</td>
                    <td>{item.op_prfi.toLocaleString()}</td>
                    <td>{item.thtr_ntin.toLocaleString()}</td>
                    <td>{item.total_aset.toLocaleString()}</td>
                    <td>{item.total_lblt.toLocaleString()}</td>
                    <td>{item.total_cptl.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="page">
        <div className="box box2">
          <h1>국내주식 등락률 순위</h1>
          <div className="table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>종목명</th>
                  <th>현재가</th>
                  <th>전일 대비</th>
                  <th>등락률</th>
                  <th>누적 거래량</th>
                  <th>최고가</th>
                  <th>최저가</th>
                </tr>
              </thead>
              <tbody>
                {fluctuationData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.data_rank}</td>
                    <td>{item.hts_kor_isnm}</td>
                    <td>{item.stck_prpr.toLocaleString()}</td>
                    <td className={item.prdy_ctrt.startsWith('-') ? 'down' : 'up'}>
                      {item.prdy_ctrt.startsWith('-') ? '▼' : '▲'}
                      {item.prdy_vrss.toLocaleString()}
                    </td>
                    <td className={item.prdy_ctrt.startsWith('-') ? 'down' : 'up'}>
                      {item.prdy_ctrt}%
                    </td>
                    <td>{item.acml_vol.toLocaleString()}</td>
                    <td>{item.stck_hgpr.toLocaleString()}</td>
                    <td>{item.stck_lwpr.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="page">
        <div className="box box3">
          <h1>국내주식 거래량 순위</h1>
          <div className="table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>종목명</th>
                  <th>현재가</th>
                  <th>전일 대비</th>
                  <th>등락률</th>
                  <th>거래량</th>
                  <th>전일비</th>
                  <th>거래회전율</th>
                  <th>대금(백만)</th>
                </tr>
              </thead>
              <tbody>
                {volumeData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.data_rank}</td>
                    <td>{item.hts_kor_isnm}</td>
                    <td>{item.stck_prpr.toLocaleString()}</td>
                    <td className={item.prdy_ctrt.startsWith('-') ? 'down' : 'up'}>
                      {item.prdy_ctrt.startsWith('-') ? '▼' : '▲'}
                      {item.prdy_vrss.toLocaleString()}
                    </td>
                    <td className={item.prdy_ctrt.startsWith('-') ? 'down' : 'up'}>
                      {item.prdy_ctrt}%
                    </td>
                    <td>{item.acml_vol.toLocaleString()}</td>
                    <td>{item.prdy_vol.toLocaleString()}</td>
                    <td>{item.vol_tnrt}</td>
                    <td>{item.tr_pbmn_tnrt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FAB onLogout={handleLogout} />
    </div>
  );
}

export default Stock;
