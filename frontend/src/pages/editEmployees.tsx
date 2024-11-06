import React, { useState, useEffect } from "react";
import {Space,Button,Col,Row,Divider,Form,Input,Card,message,Select,DatePicker,GetProp} from "antd";
import { PlusOutlined} from "@ant-design/icons";
import { EmployeesInterface } from "../interfaces/ifEmployees";
import { GendersInterface } from "../interfaces/ifGenders";
import { GetEmployeeByID, UpdateEmployee,GetGenders} from "../services/https/http";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';  /*เอาไว้ลิงค์ไปหน้าต่างๆ*/
const { Option } = Select; /*เกี่ยวกับ drop dawn เพศ*/

function EditEmployee() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [employeeForm] = Form.useForm();
  const [form] = Form.useForm();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  
  let { EmployeeID  } = useParams();
  console.log('EmployeeID = ', EmployeeID );

  
  const clikConfirmUpdateEmployee = async (values: EmployeesInterface) => { 
    console.log('BeforFormat: ', values); 
    const updatedValues = {
      ...values,
      EmployeeID: Number(EmployeeID),                   
    };
    console.log("updatedValues>> ", updatedValues);
    
    let res = await UpdateEmployee(updatedValues);
    console.log("After sent>> ", res);
    
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message || "อัปเดตข้อมูลสำเร็จ",
      });
      setTimeout(function () {
        navigate("/admin/EmployeesAndDrivers");
      }, 1000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
      });
    }
  };

  
  const getEmployeeByID = async () => {
    let res = await GetEmployeeByID(Number(EmployeeID));
    if (res) {
        
        form.setFieldsValue({
          Username:    res.Username,
          Password:    res.Password,
          FirstName:   res.FirstName, 
          LastName:    res.LastName,  
          PhoneNumber: res.PhoneNumber, 
          Position:    res.Position,   
          Address:     res.Address,
          GenderID:    res.GenderID,   

        });
    }else {
      messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลรถที่ต้องการแก้ไข",
      });
    }

  };

  const getGender = async () => {
    let res = await GetGenders();
    console.log('Genders data: ', res); // ตรวจสอบข้อมูล
    if (res) {
      setGenders(res);
    }
  };

  useEffect(() => {
    getEmployeeByID(); 
    getGender();
}, []);
  return (
    
    <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "1150px", position: "absolute", margin: "0px 0px 0px 0px" }}>
    <h1 style={{ marginLeft: "550px" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
    {contextHolder}
    
    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
      
      <Card style={{ width: "560px", height: "1000px", backgroundColor: "#fdeb49" }}>
        <img src="../../public/icon/FLOWERLEFT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
      </Card> 
  
      <Card style={{ width: "800px",height:"1050px", backgroundColor: "pink" }}>
        <h1>แก้ไขข้อมูลพนักงาน (Edit Employees)</h1>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={clikConfirmUpdateEmployee}
          form={form}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
          
          <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="ชื่อบัญชี (Username)"
            name="Username"
            rules={[{ required: true, message: "กรุณากรอกชื่อบัญชี Please enter username!" }]}
          >
            <Input 
            placeholder="กรอกชื่อบัญชี" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="รหัสผ่าน (Password)"
            name="Password"
            rules={[{ required: true, message: "กรุณากรอกชื่อ Please enter password!" }]}
          >
            <Input.Password 
            placeholder="กรอกรหัสผ่าน" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="ชื่อ (Firstname)"
            name="FirstName"
            rules={[{ required: true, message: "กรุณากรอกชื่อ Please enter name!" }]}
          >
            <Input 
            placeholder="กรอกชื่อ" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="นามสกุล (Lastname)"
            name="LastName"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล Please enter lastname!" }]}
          >
            <Input 
            placeholder="กรอกนามสกุล" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="เบอร์โทรศัพท์ (Phonenumber)"
            name="PhoneNumber"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์ Please enter phonenumber!" }]}
          >
            <Input 
            placeholder="กรอกเบอร์โทรศัพท์" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="ตำเเหน่ง (Position)"
            name="Position"
            rules={[{ required: true, message: "กรุณากรอกตำเเหน่ง Please enter position!" }]}
          >
            <Input 
            placeholder="กรอกตำเเหน่ง" 
            />
          </Form.Item>
        </Col>

        <Col lg={18} style={{ marginLeft: "95px" }}>
          <Form.Item
            label="ที่อยู่ (Address)"
            name="Address"
            rules={[{ required: true, message: "กรุณากรอกที่อยู่ Please enter address!" }]}
          >
            <Input 
            placeholder="กรอกที่อยู๋" 
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{ marginLeft: "95px" }}>
          <Form.Item
            name="GenderID"
            label="เพศ (Gender)"
            rules={[{ required: true, message: "กรุณาระบุเพศ Please enter gender!" }]}
          >
            <Select allowClear>
              {genders.map((item) => (
                <Option value={item.ID} key={item.Name}>
                  {item.Name}
                </Option>
              ))}
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
                <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => employeeForm.resetFields()}>
                  รีเซ็ต
                </Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  อัพเดตข้อมูล
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
  
     
      <Card style={{ width: "560px", height: "1000px", backgroundColor: "#fdeb49" }}>
        <img src="../../public/icon/FLOWERRIGHT.png" className="picicon" style={{ width: '100%', height: '800px' }} />
      </Card>
    </div>
  </div>
  
  );
}

export default EditEmployee;




