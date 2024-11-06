
import React from 'react';
import ReactDOM from 'react-dom';  // เปลี่ยนจาก 'react-dom/client' เป็น 'react-dom' ใช้ Version 17 จะSupport QR code reader
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') // ใช้ ReactDOM.render แทนการสร้าง root
);

