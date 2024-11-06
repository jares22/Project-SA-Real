import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { CreatePassenger } from "../../services/https/http";
import { UsersInterface } from "../../interfaces/IUser";
import SideBarUsers from "../../components/SideBarUsers";

const PassengerCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSeats = location.state?.selectedSeats || [];
  const [messageApi, contextHolder] = message.useMessage();

  const [dataReceivedValue, setDataReceived] = useState<any>(null);
  //
  useEffect(() => {
    if (location.state) {
      setDataReceived(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    if (dataReceivedValue) {
      console.log('dataReceived = ', dataReceivedValue);
    }
  }, [dataReceivedValue]);

  const onFinish = async (values: { passengers: UsersInterface[] }) => {

    console.log("Form values:", values);
    console.log("Selected Seats:", selectedSeats);

    // Combine all passengers' data with their corresponding seatId
    const passengersWithSeats = values.passengers.map((passenger, index) => ({
      ...passenger,
      SeatID: selectedSeats[index], // Use 'SeatID' instead of 'seatId'
    }));

    // Iterate over each passenger and send a request to create a user
    // for (const passengerData of passengersWithSeats) {
    //   try {
    //     const res = await CreatePassenger(passengerData);

    //     if (!res) {
    //       throw new Error("Error occurred while creating user");
    //     }
    //   } catch (error) {
    //     console.error("Error during API call:", error);
    //     messageApi.open({
    //       type: "error",
    //       content: "เกิดข้อผิดพลาด!",
    //     });
    //     return; // Stop further processing if there's an error
    //   }
    // }

    messageApi.open({
      type: "success",
      content: "บันทึกผู้โดยสารทั้งหมดเรียบร้อยแล้ว",
    });

    // Send data to the next page
    setTimeout(() => {
      navigate('/user/Payment', { state: { passengersWithSeats, dataReceivedValue } });
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#14919B', height: '99vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <SideBarUsers />
      <div style={{ position: 'relative', width: '1580px', height: '900px', backgroundColor: '#D9D9D9', overflowY: 'auto' }}>
        {contextHolder}
        <Space>
          <div style={{
            position: 'absolute',
            top: 0,
            width: '1580px',
            height: '70px',
            backgroundColor: '#213A57',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

          }}>
            <h2 style={{ color: 'white', margin: 0, fontFamily: 'Kanit, sans-serif', fontSize: '28px', letterSpacing: '2px' }}>ข้อมูลผู้โดยสาร</h2>
          </div>
        </Space>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: '80px' }}>
          {selectedSeats.map((seatId: number, index: number) => (
            <div key={seatId} style={{ marginBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}> {/* เพิ่ม paddingLeft */}
              <h3><p style={{ marginLeft: '10px' }}><UserOutlined style={{
                fontSize: '1.5vw',
                color: '#14919B',
                border: '2px solid #14919B',  // เส้นกรอบขนาด 2px สีเดียวกับไอคอน
                borderRadius: '50%',          // ทำให้กรอบเป็นวงกลม
                padding: '5px'               // เพิ่ม padding ให้ไอคอนดูมีพื้นที่มากขึ้น
              }} /> รายละเอียดผู้โดยสารที่นั่งที่ {seatId}</p></h3>
              <Card>
                <Form.Item
                  label="Name"
                  name={['passengers', index, 'name']}
                  rules={[
                    { required: true, message: 'Please enter your name!' },
                    {
                      pattern: /^[A-Za-zก-๙\s]+$/,  // อนุญาตให้ใส่เฉพาะตัวอักษร (ภาษาอังกฤษและไทย) และเว้นวรรค
                      message: 'Please enter letters only!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="PhoneNumber"
                  name={['passengers', index, 'phone_number']}
                  rules={[
                    { required: true, message: 'Please enter your phone number!' },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: 'Phone number must be exactly 10 digits!'
                    }
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Card>
            </div>
          ))}
          <Space>
            <Button htmlType="button" onClick={() => navigate(-1)} style={{ marginLeft: '1400px' }}>
              ย้อนกลับ
            </Button>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
          </Space>
        </Form>

      </div>
    </div>
  );

};

export default PassengerCreate;
