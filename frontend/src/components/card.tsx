import React from 'react';
import { Card } from 'antd';

const App: React.FC = () => (
  <Card      title={
    <div style={{ 
      backgroundColor: '#213A57', /* Background color for the header */
      color: '#ffffff', /* Text color for the header */
      padding: '16px', /* Padding for the header */
      borderTopLeftRadius: 0, /* Ensure the border radius is consistent */
      borderTopRightRadius: 0, /* Ensure the border radius is consistent */
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        margin: 0, /* Remove default margin */
        textAlign: 'left', /* Align text to the left */
      }}>
        ชำระค่าโดยสาร
      </h2>
    </div>
  }
  style={{ 
    width: 800 ,
    height: 600,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,marginLeft:-270,}}>
    
  </Card>
);

export default App;