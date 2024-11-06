import React, { useState,useEffect } from 'react';
import {Button,Table,DatePicker,Form,Input,InputNumber,Mentions,Select,TreeSelect,Segmented, Card,Row, Col, message} from 'antd';
import type { FormProps } from 'antd';
import { BusInterface} from "../interfaces/Ibus";
import {RouteInterface} from "../interfaces/IRoute"
import {FormInputBusTimingInterface} from "../interfaces/FormInputBusTiming";
import { FunctionComponent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {GetListVehicle, GetListRoute, FormAddToBusTiming} from "../services/https/http";
const { Option } = Select;
//margin: "50px 0px 0px 50px"   top ไล่วนขวา

const daysOfWeek = [
  { value: 'จันทร์', label: 'จันทร์' },
  { value: 'อังคาร', label: 'อังคาร' },
  { value: 'พุธ', label: 'พุธ' },
  { value: 'พฤหัสบดี', label: 'พฤหัสบดี' },
  { value: 'ศุกร์', label: 'ศุกร์' },
  { value: 'เสาร์', label: 'เสาร์' },
  { value: 'อาทิตย์', label: 'อาทิตย์' },
];   /*ต้องมีทั้ง Value lable ถึงจะใช้ option เลือกได้*/

const hoursOfDay = [...Array(24)].map((_, index) => ({   //00 ถึง 23 นาฬิกา
  value: index.toString().padStart(2, '0'),
  label: index.toString().padStart(2, '0'),
}));

const minOfHours = [...Array(60)].map((_, index) => ({   //00 ถึง 23 นาฬิกา
  value: index.toString().padStart(2, '0'),
  label: index.toString().padStart(2, '0'),
}));


const MainRouteManage: FunctionComponent = () => {
  const [messageApi, contextHolder] = message.useMessage(); // Initialize message API
  const navigate = useNavigate();/*ต้องเอาไว้บนสุดของฟังก์ชั่น*/

  const clickAddToBusTiming = async (values: FormInputBusTimingInterface) => {
    // รวมข้อมูลจาก form
    console.log('Original: ',values);
    const allData = {
      ...values
    };
  
    // แปลงข้อมูลก่อนส่งออก
    const formattedData = {
      departure_day: `${allData.departure_dayf}`, // ใช้ค่าว่างถ้าเป็น undefined
      return_day: `${allData.return_dayf}`, // ใช้ค่าว่างถ้าเป็น undefined
      departure_time: `${allData.departure_hourf}:${allData.departure_minutef}`, // แปลงชั่วโมงและนาทีเป็นเวลา
      return_time: `${allData.return_hourf}:${allData.return_minutef}`, // แปลงชั่วโมงและนาทีเป็นเวลา
      route_id: Number(allData.route_idf), // แปลงเป็น number
      bus_id: Number(allData.bus_idf),     // แปลงเป็น number
    };
  
    console.log("Formatted Data: ", formattedData);
  
    // ส่งข้อมูลที่ฟอแมทแล้วไปยังฟังก์ชัน FormAddToBusTiming
    let res = await FormAddToBusTiming(formattedData);
    if (res) {
      messageApi.open({
        type: "success",
        content: "เพิ่มรอบรถสำเร็จ",
      });
      setTimeout(() => {
        navigate("/admin/MainRouteManage");  // เปลี่ยนหน้าเมื่อบันทึกสำเร็จ
      }, 1500);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };
  
  
  const [bus, setBus] = useState<BusInterface[]>([]);/* เอา bus ไปใช้ในDROP DOWN */
  const getListBus = async () => {
    let BusJson = await GetListVehicle();
    console.log('ListBus',BusJson);
    if (BusJson) {
      setBus(BusJson);  //เอาไว้เซ็ตค่าเข้า ตาราง dropdown
    }
  };

  const [route, setRoute] = useState<RouteInterface[]>([]);
  const getListRoute = async () => {
    let RouteJson = await GetListRoute();
    console.log('ListRoute',RouteJson);
    if (RouteJson) {
      setRoute(RouteJson);  //เอาไว้เซ็ตค่าเข้า ตาราง dropdown
    }
  };

  useEffect(() => {   //ทำครั้งแรกที่มาหน้านี้ มานี้แล้วจะทำฟังก์ชั่นนี้ทันที
    getListBus();
    getListRoute();
  }, []); 
  //height: '100vh'

  return (
  <div style={{ backgroundColor: '#F7B22C', height: '99vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  {contextHolder}
  <div style={{ position: 'relative', width: '1700px', height: '780px', backgroundColor: '#f8f0e0' }}>
        <div style={{ position: 'absolute', top: 0, width: '100%', height: '60px', backgroundColor: '#3c312b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0, fontFamily: 'Kanit, sans-serif', fontSize: '28px', letterSpacing: '2px' }}>เพิ่มรอบรถ</h2>
        </div>
  <Form    //layout="vertical" หมายถึง label จะอยู่ด้านบนของ input field แต่ละอัน
  name="AdddManageRoute" layout="vertical" autoComplete="off" /*ปิดการเติมข้อมูลอัตโนมัติของเบราว์เซอร์*/
  onFinish={clickAddToBusTiming}
  >
      <Row gutter={24}>
        <Col span={1}/>
          <Col span={22}>
            <Card style={{ height: "650px",marginTop: "90px", padding: "50px 0px 0px 150px", boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.3)'}}>

                  <Form.Item label="BusID" name="bus_idf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{width: "500px"}}>
                    <Select allowClear /*คือปุ่มกากบาทล้างค่าที่เลือก*/ style={{height: "40px"}}>      
                      {bus.map(bus => (//.map(): เป็นเมธอดที่ใช้ในการวนซ้ำ (loop) ผ่านแต่ละวัตถุใน array และสร้าง array ใหม่ขึ้นมาจากผลลัพธ์ของการดำเนินการบนแต่ละวัตถุใน array ดั้งเดิม
                        <Option/*ค่าที่อยู่ใน option จะเป็นค่าที่ถูกส่งไป ถ้าอยู่ข้างนอกจะแค่แสดงออก*/ key={bus.bus_id}>{bus.license_plate}----{bus.bus_id}</Option> /*ต้องระบุ Key กับ Value เข้าไปด้วยถึงไม่ขึ้นแดง*/))}
                    </Select>
                  </Form.Item>

                  <div style={{ display: 'flex', gap: '30px' }}>
                      <Form.Item
                          label="วันเดินทางไป" name="departure_dayf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                          <Select  options={daysOfWeek} style={{height: "40px"}}/>
                      </Form.Item>
                      <Form.Item name="departure_hourf" label="นาฬิกา" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}>
                        <Select style={{width: "80px", height: "40px"}} options={hoursOfDay}/>
                      </Form.Item>
                      <Form.Item name="departure_minutef" label="นาที" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} /* width ใน Form คือความกว้างของ Form ทั้งหมด*/>
                        <Select style={{width: "80px", height: "40px"}} options={minOfHours}/*width ในนี้คือความกว้่างของช่อง *//>
                      </Form.Item>
                  </div>

                  <div style={{ display: 'flex', gap: '30px' }}>
                      <Form.Item label="วันเดินทางกลับ" name="return_dayf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                          <Select options={daysOfWeek} style={{height: "40px"}}/>
                      </Form.Item>
                      <Form.Item name="return_hourf" label="นาฬิกา" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}>
                        <Select style={{width: "80px", height: "40px"}} options={hoursOfDay}/>
                      </Form.Item>
                      <Form.Item name="return_minutef" label="นาที" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} /* width ใน Form คือความกว้างของ Form ทั้งหมด*/>
                        <Select style={{width: "80px", height: "40px"}} options={minOfHours}/*width ในนี้คือความกว้่างของช่อง *//>
                      </Form.Item>
                  </div>

                  <Form.Item label="สายรถ" name="route_idf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                    <Select allowClear style={{width: "1100px", height: "40px"}}>      
                        {route.map(route => (
                          <Option key={route.route_id}>{route.route_id}---{route.name_route}&nbsp;&nbsp;&nbsp;&nbsp;{route.routeway}</Option>))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item style={{marginLeft: "880px"}}>
                    <Link to="/admin">
                      <Button type="primary" htmlType="submit" style={{fontWeight: "bold", backgroundColor: "#3c312b", width: "100px",height: "38px", color: "white"}}>
                        Cancel
                      </Button>
                    </Link>
                    <Button type="primary" htmlType="submit"  style={{fontWeight: "bold", color: "#3c312b", backgroundColor: "#F7B22C", width: "100px",height: "38px", margin: "20px 20px 0px 20px"}}>
                      ADD
                    </Button>
                  </Form.Item>

              </Card>
          </Col>
      </Row>
  </Form>
  </div>
  </div>
    );
};

export default MainRouteManage;