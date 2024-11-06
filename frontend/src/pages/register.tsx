import React from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Select, Row, message, Space } from 'antd';
import { AddRegister } from "../services/https/http";
import { LoginInInterface } from "../interfaces/ILogin";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';



function Register() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const clickAddAccount = async (values: any) => {
    // แปลงวันที่จาก DatePicker
    if (values.birthdayuserf) {
      values.birthdayuserf = (values.birthdayuserf).format('YYYY-MM-DD');
    }
    console.log('clickAddAccount: ', values);
    let res = await AddRegister(values);
    if (res) {
      messageApi.success("สร้างบัญชี User สำเร็จ กรุณา Login เพื่อเข้าสู่ระบบ");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }

  return (
    <div className='main-container'>
      {contextHolder}
      <div className='rectangle' />
      <div className='sirisak' />
      <div className='welcome-to-sirisak-tour'>
        <span className='welcome-to'>
          WELCOME TO SIRISAK TOUR<br />
        </span>
        <span className='sirisak-1'>Register User</span>
        
        <Form name='DataRegister' onFinish={clickAddAccount} style={{marginTop:'20px'}}>
          <Form.Item name="usernamef">
            <Input placeholder="Username" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="password1f" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="password2f" dependencies={['password1f']} hasFeedback rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password1f') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); } })]}>
            <Input.Password placeholder="Confirm Password" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="emailf">
            <Input placeholder="Email" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="firstnamef">
            <Input placeholder="First Name" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="lastnamef">
            <Input placeholder="Last Name" autoComplete="off" style={{ width: '50%', fontSize: '18px', fontFamily: 'Inter, sans-serif', height: '50px', padding: '10px' }} />
          </Form.Item>
          <Form.Item name="birthdayuserf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}>
            <DatePicker name='DatePicker' placeholder="Birthday" style={{ width: '50%', fontSize: '18px', height: '50px', padding: '10px' }} />
          </Form.Item>
          <div>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#f7b22c', width: '50%', height: '55px', marginBottom: '15px' }}>
              <span style={{ color: 'black', fontSize: '20px', fontFamily: 'Inter, sans-serif' }}>Add Account</span>
            </Button>
          </div>

          <div>
            <Link to="/">
              <Button type="primary" style={{ backgroundColor: 'white', width: '50%', height: '55px' }}>
                <span style={{ color: '#312a13', fontSize: '20px', fontFamily: 'Inter, sans-serif' }}>Back To Login</span>
              </Button>
            </Link>
          </div>

        </Form>
        
      </div>
      <div className='a-a' />
      <div className='button-container'>

      </div>
    </div>


  );
}

export default Register;
