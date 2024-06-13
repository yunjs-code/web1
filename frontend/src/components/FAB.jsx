import React, { useState } from 'react';
import './FAB.css';

const FAB = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fab-container">
      <button className="fab main-fab" onClick={toggleFAB}>
        <i className="fas fa-plus"></i>
      </button>
      {isOpen && (
        <div className="fab-options">
          <button className="fab-option">
            <i className="fas fa-envelope"></i>
          </button>
          <button className="fab-option">
            <i className="fas fa-facebook"></i>
          </button>
          <button className="fab-option">
            <i className="fas fa-comments"></i>
          </button>
          <button className="fab-option" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default FAB;
