import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { LoginInInterface } from "../interfaces/ILogin";
import { AddLogin } from "../services/https/http";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const clickLoginbt = async (values: LoginInInterface) => {
    console.log('ก่อนLogin: ', values);
    let res = await AddLogin(values);
    console.log('หลังLogin: ', res);

    if (res.status === 200) {
      const busIcon = document.querySelector('.a-a') as HTMLElement;
      if (busIcon) {
        busIcon.classList.add('animate-out'); // เพิ่มคลาสเพื่อขยับรถยนต์
      }
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("RoleID", res.data.id);
      localStorage.setItem("userRole", res.data.role);

      if (res.data.role === 'admin') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ Admin สำเร็จ");
        setTimeout(() => {
          navigate("/admin");
        }, 800);
      } else if (res.data.role === 'driver') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ Driver สำเร็จ");
        setTimeout(() => {
          navigate("/driver");
        }, 1600);
      } else if (res.data.role === 'user') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ User สำเร็จ");
        setTimeout(() => {
          navigate("/user");
        }, 1600);
      }
    } else {
      messageApi.open({
        type: 'warning',
        content: 'รหัสผ่านหรือข้อมูลผู้ใช้ไม่ถูกต้อง!! กรุณากรอกข้อมูลใหม่',
      });
    }
  };

  return (
    <div className='main-container'>
      <div style={{ fontSize: '70px' }}>
        {contextHolder}
      </div>
      <div className='rectangle' />
      <div className='sirisak' />
      <div className='welcome-to-sirisak-tour'>
        <span className='welcome-to'>
          WELCOME TO <br />
        </span>
        <span className='sirisak-1'>SIRISAK</span>
        <span className='tour'> TOUR</span><br />
        <Form name='DataLogin' onFinish={clickLoginbt} autoComplete="off">
          <Form.Item name="usernamef">
            <Input placeholder="Username" autoComplete="off" style={{ width: '650px', margin: '20px 0px 0px 50px', fontSize: '30px', height: '68px' }} />
          </Form.Item>
          <Form.Item name="passwordf">
            <Input.Password placeholder="Password" autoComplete="off" style={{ width: '650px', margin: '20px 0px 0px 50px', fontSize: '30px', height: '68px' }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" shape="default" style={{ marginLeft: '35px', backgroundColor: '#f7b22c', width: '650px', height: '55px' }}>
            <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>LOGIN</p>
          </Button><br/>
          <Link to="/register">
            <Button type="primary" shape="default" style={{ marginTop: "20px", marginLeft: '35px', backgroundColor: '#f7b22c', width: '650px', height: '55px' }}>
              <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>Register</p>
            </Button>
          </Link>
        </Form>
      </div>
      <div className='a-a' />
      <div className='button-container'></div>
    </div>
  );
}

export default Login;
