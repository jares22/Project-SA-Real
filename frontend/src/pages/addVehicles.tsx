import React, { useState, useEffect } from "react";
import {Space,Button,Col,Row,Divider,Form,Input,Card,message,Select,DatePicker,InputNumber ,} from "antd";
import { PlusOutlined} from "@ant-design/icons";
import { VehiclestInterface } from "../interfaces/ifVehicles";
import { CreateVehicles } from "../services/https/http";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';  /*เอาไว้ลิงค์ไปหน้าต่างๆ*/


function addDataV() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [vehicleForm] = Form.useForm();
  const clikConfirm = async (values: VehiclestInterface) => {
    console.log("clikConfirmAddVehicles1 ", values);/* ก่อนส่ง */
  
    // แปลง FuelTank และ Seat ให้เป็นตัวเลข
    const formattedValues = {
      ...values,FuelTank: Number(values.FuelTank),Seat: Number(values.Seat),
    };
    console.log("clikConfirmAddVehicles2 ", formattedValues);
    let res = await CreateVehicles(formattedValues);
    console.log("หลังส่ง ",res); /* หลังส่ง */
    if (res) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(function () {
        navigate("/admin/Vehicles");  /* ถ้าบันทึกสำเร็จจะเปลี่ยนหน้า */
      }, 1000); 
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };
  

  return (
    <div style={{backgroundColor: "#fdeb49", width: "98.5vw", height: "945px", position: "absolute", margin: "0px 0px 0px 0px"}}>
    <h1 style={{textAlign: "center"}}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
    {contextHolder}
  
    {/* ใช้ Flexbox เพื่อให้ Card ทั้งสามอยู่ในแถวเดียวกัน */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      
      <Card style={{ width: "700px", height: "410px", backgroundColor: "#fdeb49",marginTop : "-440px" }}>
      <img src="../public/icon/WHITEFLOWERLEFT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
      </Card>
  
      <Card style={{ width: "1250px", height: "850px", backgroundColor: "#82b954" }}>
        <h1>เพิ่มข้อมูลรถ (Add Vehicles)</h1>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={clikConfirm} 
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col lg={24} style={{ marginTop: "5px" }}>
              <Form.Item
                label="ประเภทรถ (Type)"
                name="Type"
                rules={[{ required: true, message: "กรุณากรอกประเภทรถ Please enter type!" }]}
              >
                <Input 
                placeholder="กรอกประเภทรถ"
                />
              </Form.Item>
            </Col>
  
            <Col lg={24} style={{ marginTop: "5px" }}>
              <Form.Item
                label="ทะเบียนรถ (BusRegistration)"
                name="BusRegistration"
                rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ Please enter bus registration!" }]}
              >
                <Input 
                 placeholder="กรอกทะเบียนรถ"
                />
              </Form.Item>
            </Col>
  
            <Col lg={24} style={{ marginTop: "5px" }}>
              <Form.Item
                label="ยี่ห้อรถ (Brand)"
                name="Brand"
                rules={[{ required: true, message: "กรุณากรอกยี่ห้อรถ Please enter brand!" }]}
              >
                <Input 
                 placeholder="กรอกยี่ห้อรถ"
                />
              </Form.Item>
            </Col>
  
            <Col lg={24} style={{ marginTop: "5px" }}>
              <Form.Item
                label="รุ่นรถ (Series)"
                name="Series"
                rules={[{ required: true, message: "กรุณากรอกรุ่นรถ Please enter series!" }]}
              >
                <Input 
                 placeholder="กรอกรุ่นรถ"
                />
              </Form.Item>
            </Col>
  
            <Col lg={24} style={{ marginTop: "5px" }}>
              <Form.Item
                label="เครื่องยนต์และแรงม้า (EngineAndPower)"
                name="EngineAndPower"
                rules={[{ required: true, message: "กรุณากรอกเครื่องยนต์ Please enter engine and power!" }]}
              >
                <Input 
                 placeholder="กรอกเครื่องยนต์เเละเเรงม้า"
                />
              </Form.Item>
            </Col>
  
            <Col lg={8} style={{ marginTop: "5px" }}>
              <Form.Item
                label="ปีของรถ (Year)"
                name="Year"
                rules={[{ required: true, message: "กรุณากรอกปีของรถ Please enter year!" }]}
              >
                <InputNumber min={1} max={10000000} style={{ width: "200px" }} 
                 placeholder="กรอกปีของรถ"
                />
              </Form.Item>
            </Col>
  
            <Col lg={8} style={{ marginTop: "5px" }}>
              <Form.Item
                label="ความจุถังน้ำมัน (FuelTank)"
                name="FuelTank"
                rules={[{ required: true, message: "กรุณากรอกความจุถังน้ำมัน Please enter fuel tank!" }]}
              >
                <InputNumber min={1} max={10000000} style={{ width: "200px" }} 
                 placeholder="กรอกความจุถังน้ำมัน"
                />
              </Form.Item>
            </Col>
  
            <Col lg={8} style={{ marginTop: "5px" }}>
              <Form.Item
                label="จำนวนที่นั่ง (Seat)"
                name="Seat"
                rules={[{ required: true, message: "กรุณากรอกจำนวนที่นั่ง Please enter seat!" }]}
              >
                <InputNumber min={1} max={10000000} style={{ width: "200px" }} 
                 placeholder="กรอกจำนวนที่นั่ง"
                />
              </Form.Item>
            </Col>
          </Row>
  
          <Row justify="end">
            <Col style={{ marginTop: "10px" }}>
              <Space>
                <Link to="/admin/Vehicles">
                  <Button htmlType="button" style={{ marginRight: "10px" }}>
                    ยกเลิก
                  </Button>
                </Link>
                <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => vehicleForm.resetFields()}>
                  รีเซ็ต
                </Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  ยืนยัน
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
  
      <Card style={{ width: "560px", height: "410px", backgroundColor: "#fdeb49",marginTop : "-440px" }}>
        <img src="../public/icon/WHITEFLOWERRIGHT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
      </Card>
    </div>
  </div>
  
  );
}

export default addDataV;
