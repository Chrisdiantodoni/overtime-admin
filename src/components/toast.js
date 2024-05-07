import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast({ message, type = 'info', options = {} }) {
  const showToast = () => {
    toast[type](message, options);
  };

  return (
    <button onClick={showToast} className={`toast-button ${type}`}>
      {message}
    </button>
  );
}

export default Toast;
