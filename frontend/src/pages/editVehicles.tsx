import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehiclestInterface } from "../interfaces/ifVehicles";
import { UpdateVehicle, GetVehicleByID } from "../services/https/http";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

function EditVehicle() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [vehicleForm] = Form.useForm();
    const [form] = Form.useForm();

    let { VehicleID } = useParams();
    console.log('VehicleID = ', VehicleID);

    
    // ฟังก์ชันสำหรับอัปเดตข้อมูลรถ
    const clikConfirmUpdateVehicle = async (values: VehiclestInterface) => {
        console.log('BeforeFormat: ', values);
        const updatedValues = {
            ...values,
            VehicleID: Number(VehicleID), // ใช้ vehicleId จาก useParams เพื่อทำการอัปเดต
        };
        console.log("updatedValues>> ", clikConfirmUpdateVehicle);

        let res = await UpdateVehicle(updatedValues);
        console.log("After sent>> ", res);

        if (res) {
            messageApi.open({
                type: "success",
                content: res.message || "อัปเดตข้อมูลสำเร็จ",
            });
            setTimeout(() => {
                navigate("/admin/Vehicles");
            }, 1000);
        } else {
            messageApi.open({
                type: "error",
                content: res.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
            });
        }
    };

    // ฟังก์ชันสำหรับเรียกข้อมูลรถตาม ID
   
    const getVehicleByID = async () => {
        let res = await GetVehicleByID(Number(VehicleID));
        console.log('GetVehicleByID: ', res);
        if (res) {
            form.setFieldsValue({
                Type:               res.Type,
                BusRegistration:    res.BusRegistration,
                Brand:              res.Brand,
                Series:             res.Series,
                Year:               res.Year,
                EngineAndPower:     res.EngineAndPower,
                FuelTank:           res.FuelTank,
                Seat:               res.Seat,
            });
        } else {
            messageApi.open({
                type: "error",
                content: "ไม่พบข้อมูลรถที่ต้องการแก้ไข",
            });
        }
    };

    useEffect(() => {
        getVehicleByID();
    }, []);

    return (
        <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "945px", position: "absolute", margin: "0px 0px 0px 0px" }}>
        <h1 style={{ textAlign: "center" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
        {contextHolder}
    
        {/* ใช้ Flexbox เพื่อให้ Card ทั้งสามอยู่ในแถวเดียวกัน */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
            
            <Card style={{ width: "700px", height: "410px", backgroundColor: "#fdeb49",marginTop : "-440px"  }}>
                <img src="../../public/icon/WHITEFLOWERLEFT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
            </Card>
    
            <Card style={{ width: "1250px", height: "850px", backgroundColor: "#82b954" }}>
                <h1> แก้ไขข้อมูลรถ (Edit Vehicles)</h1>
                <Divider />
                <Form
                    name="basic"
                    layout="vertical"
                    onFinish={clikConfirmUpdateVehicle} // ใช้ฟังก์ชันอัปเดตข้อมูลเมื่อกด Submit
                    autoComplete="off"
                    form={form} // ผูก Form กับตัวแปร form เพื่อให้สามารถตั้งค่าได้
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
                                rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ Please enter busregistration!" }]}
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
                                label="เครื่องยนต์เเละเเรงม้า (EngineAndPower)"
                                name="EngineAndPower"
                                rules={[{ required: true, message: "กรุณากรอกเครื่องยนต์ Please enter engine and power!" }]}
                            >
                                <Input 
                                 placeholder="กรอกเครื่องยนต์เเละเเรงม้า"
                                />
                            </Form.Item>
                        </Col>
    
                        {/* Year, FuelTank, Seat in the same row */}
                        <Col lg={8} style={{ marginTop: "5px" }}>
                            <Form.Item
                                label="ปีของรถ (Year)"
                                name="Year"
                                rules={[{ required: true, message: "กรุณากรอกปีของรถ Please enter year!" }]}
                            >
                                <InputNumber min={1} max={10000000} changeOnWheel style={{ width: "200px" }} 
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
                                <InputNumber min={1} max={10000000} changeOnWheel style={{ width: "200px" }} 
                                 placeholder="กรอกความจุน้ำมัน"
                                />
                            </Form.Item>
                        </Col>
    
                        <Col lg={8} style={{ marginTop: "5px" }}>
                            <Form.Item
                                label="จำนวนที่นั่ง (Seat)"
                                name="Seat"
                                rules={[{ required: true, message: "กรุณากรอกจำนวนที่นั่ง Please enter seat!" }]}
                            >
                                <InputNumber min={1} max={10000000} changeOnWheel style={{ width: "200px" }} 
                                 placeholder="กรอกจำนวนที่นั่ง"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
    
                    <Row justify="end">
                        <Col style={{ marginTop: "10px" }}>
                            <Space>
                                <Link to="/admin/Vehicles">
                                    <Button htmlType="button" style={{ marginRight: "10px" }}>ยกเลิก</Button>
                                </Link>
                                <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => vehicleForm.resetFields()}>รีเซ็ต</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                >
                                    อัพเดตข้อมูล
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
    
            <Card style={{ width: "560px", height: "410px", backgroundColor: "#fdeb49",marginTop : "-440px"  }}>
                <img src="../../public/icon/WHITEFLOWERRIGHT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
            </Card>
    
        </div>
    </div>
    
    );
}

export default EditVehicle;




