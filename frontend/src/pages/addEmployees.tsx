import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EmployeesInterface } from "../interfaces/ifEmployees";
import { GendersInterface } from "../interfaces/ifGenders";
import { CreateEmployees, GetGenders } from "../services/https/http";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const { Option } = Select;


function addDataE() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [employeeForm] = Form.useForm();
  const [genders, setGenders] = useState<GendersInterface[]>([]);

  // ฟังก์ชันการบันทึกข้อมูลพนักงาน
  const clikConfirm = async (values: EmployeesInterface) => {
    console.log('ก่อนเข้า backend', values);

    let res = await CreateEmployees(values);
    console.log(res);

    if (res) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(() => {
        navigate("/admin/EmployeesAndDrivers");
      }, 1000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };

  // ฟังก์ชันการดึงข้อมูลเพศ
  const getGender = async () => {
    let res = await GetGenders();
    console.log(" ก่อน Genders data fetched:", res); // เพิ่มการ log เพื่อดูข้อมูลที่ถูกดึงมา
    if (res) {
      setGenders(res);
      console.log("Genders data fetched:", res); // เพิ่มการ log เพื่อดูข้อมูลที่ถูกดึงมา
    } else {
      console.error("Failed to fetch genders data");
    }
  };

  useEffect(() => {
    getGender(); // เรียกใช้ฟังก์ชัน getGender เมื่อ component ถูก mount
  }, []);

  return (
    <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "1130px", position: "absolute" }}>
      <h1 style={{ textAlign: "center" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
      {contextHolder}

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
        <Card style={{ width: "560px", height: "1000px", backgroundColor: "#fdeb49" }}>
          <img src="../public/icon/FLOWERLEFT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
        </Card>

        <Card style={{ width: "800px", backgroundColor: "pink" }}>
          <h1> เพิ่มข้อมูลพนักงาน (Add Employees) </h1>
          <Divider />
          <Form
            name="basic"
            layout="vertical"
            onFinish={clikConfirm}
            autoComplete="off"
          >
            <Row gutter={[16, 16]}>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="ชื่อบัญชี (Username)" 
                name="Username" 
                rules={[{ required: true, message: "กรุณากรอกชื่อบัญชี Please enter username!" }]}>
                  <Input 
                    placeholder="กรอกชื่อบัญชี" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="รหัสผ่าน (Password)" 
                name="Password" 
                rules={[{ required: true, message: "กรุณากรอกชื่อ Please enter password!" }]}>
                  <Input.Password 
                  placeholder="กรอกรหัสผ่าน" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="ชื่อ (FirstName)" 
                name="FirstName" 
                rules={[{ required: true, message: "กรุณากรอกชื่อ Please enter name!" }]}>
                  <Input 
                  placeholder="กรอกชื่อ" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="นามสกุล (LastName)" 
                name="LastName" 
                rules={[{ required: true, message: "กรุณากรอกนามสกุล Please enter lastname!" }]}>
                  <Input 
                  placeholder="กรอกนามสกุล" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="เบอร์โทรศัพท์ (PhoneNumber)" 
                name="PhoneNumber" 
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์ Please enter phonenumber!" }]}>
                  <Input 
                  placeholder="กรอกเบอร์โทรศัพท์" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                label="ตำเเหน่ง (Position)" 
                name="Position" 
                rules={[{ required: true, message: "กรุณากรอกตำเเหน่ง Please enter position!" }]}>
                  <Input 
                  placeholder="กรอกตำเเหน่ง" 
                  />
                </Form.Item>
              </Col>

              <Col lg={18} style={{ marginLeft: "95px" }}>
                <Form.Item 
                  label="ที่อยู่ (Address)" 
                  name="Address" 
                  rules={[{ required: true, message: "กรุณากรอกที่อยู่ Please enter address!" }]}>
                  <Input 
                    placeholder="กรอกที่อยู่ของคุณ" 

                  />
                </Form.Item>
              </Col>


              <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{ marginLeft: "95px" }}>
                <Form.Item 
                name="GenderID" 
                label="เพศ (Gender)" 
                rules={[{ required: true, message: "กรุณาระบุเพศ Please enter gender!" }]}>
                  
                  <Select allowClear>
                    {genders.length > 0 ? (
                      genders.map((item) => (
                        <Option value={item.ID} key={item.ID}>
                          {item.Name}
                        </Option>
                      ))
                    ) : (
                      <Option value="" disabled>
                        ไม่มีข้อมูลเพศ
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Space>
                  <Link to="/admin/EmployeesAndDrivers">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => employeeForm.resetFields()}>รีเซ็ต</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    ยืนยัน
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card style={{ width: "560px", height: "1000px", backgroundColor: "#fdeb49" }}>
          <img src="../public/icon/FLOWERRIGHT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
        </Card>
      </div>
    </div>

  );
}

export default addDataE;


