import React, { useState } from 'react';
import './FAB.css';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';

const FAB = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-buttons">
          <button className="fab" onClick={() => navigate('/main')}>
            Main
          </button>
          <button className="fab" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
      <button className="fab-toggle" onClick={toggleFAB}>
        {isOpen ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
};

export default FAB;
