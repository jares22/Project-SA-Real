import React, { useState, useEffect } from "react";
import {Space,Button,Col,Row,Divider,Form,Input,Card,message,Select,DatePicker,} from "antd";
import {VehiclestInterface} from "../interfaces/ifVehicles";
import {EmployeesInterface} from "../interfaces/ifEmployees";
import { DriverstInterface } from "../interfaces/ifDrivers";
import { PlusOutlined} from "@ant-design/icons";
import { CreateDrivers, GetListEmployees, GetListBuss } from "../services/https/http";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';  /*เอาไว้ลิงค์ไปหน้าต่างๆ*/
const { Option } = Select;



function addDataD() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [driverForm] = Form.useForm();

 
  /*ฟังก์ชั่นดึงข้อมูลในตารางฐานข้อมูลรถมาให้เลือกใน dropdown */
  const [BusJsonset, getToBusValue] = useState<VehiclestInterface[]>([]);
  const getListBus = async () => {
    let BusJson = await GetListBuss();
    console.log("BusJson==>>", BusJson);
    getToBusValue(BusJson);
  }

   /*ฟังก์ชั่นดึงข้อมูลในตารางฐานข้อมูลพนักงานมาให้เลือกใน dropdown */
   const [employeeJson, setEmployeeJsonToValues] = useState<EmployeesInterface[]>([]);
   const getListEmployee = async () => {
     let EmployeeJson = await GetListEmployees();
     console.log("EmployeeJson==>>", EmployeeJson);
     setEmployeeJsonToValues(EmployeeJson);
   }



  const clikConfirm = async (values: DriverstInterface) => {
    console.log("ค่าที่จับคู่ระหว่างไอดีพนักงานกับคนขับ",values);/* ก่อนส่ง */
    let res = await CreateDrivers(values);
    console.log("ค่าที่จับคู่ระหว่างไอดีพนักงานกับคนขับ",res)  /* หลังส่ง */ 
    if (res) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(function () {
           navigate("/admin/EmployeesAndDrivers");  /* ถ้าบันทึกสำเร็จจะเปลี่ยนหน้า */  
        }, 1000);//2000
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };


  useEffect(() => {
    getListEmployee();
    getListBus();
  },[])
  
  
  return (

    <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "925px", position: "absolute", margin: "0px 0px 0px 0px", display: "block", justifyContent: "space-between", alignItems: "center" }}>
    <h1 style={{ marginLeft: "550px", position: "absolute", top: "20px" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
    {contextHolder}
  
    {/* Card 1 */}
    <Card style={{ width: "1000px", height: "420px", backgroundColor: "#bae0ff", marginTop: "120px",marginLeft: "420px" }}>
      <h1>เพิ่มข้อมูลพนักงานขับ (Add Drivers)</h1>
      <Form name="basic" layout="vertical" onFinish={clikConfirm} autoComplete="off">
        <Row gutter={24}>
          <Col lg={24}>
            <Form.Item
              label="รหัสประจำตัวพนักงาน (EmployeeID)"
              name="EmployeeID"
              rules={[{ required: true, message: "กรุณากรอกข้อมูลรหัสประจำตัวพนักงาน Please enter EmployeeID!" }]}
            >
              <Select>
                {employeeJson.map((employ) => (
                  <Option key={employ.EmployeeID} value={employ.EmployeeID}>
                    {" EmployeeID = "}{employ.EmployeeID}{" ชื่อ: "}{employ.FirstName}{" นามสกุล: "}{employ.LastName}{" ตำเเหน่ง: "}{employ.Position}{" เบอร์โทรศัพท์: "}{employ.PhoneNumber}{"."}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
  
          <Col lg={24}>
            <Form.Item
              label="รหัสประจำตัวรถ (BusID)"
              name="BusID"
              rules={[{ required: true, message: "กรุณากรอกข้อมูลรหัสประจำตัวรถ Please enter BusID!" }]}
            >
              <Select>
                {BusJsonset.map((bus) => (
                  <Option key={bus.BusID} value={bus.BusID}>
                    {" BusID = "}{bus.BusID}{" ประเภทรถ: "}{bus.Type}{" ทะเบียนรถ: "}{bus.BusRegistration}{" ยี่ห้อรถ: "}{bus.Brand}{" จำนวนที่นั่ง: "}{bus.Seat}{"."}
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
                <Button htmlType="button" style={{ marginRight: "10px" }}>ยกเลิก</Button>
              </Link>
              <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => driverForm.resetFields()}>
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
  
    {/* Card 2 */}
    <Card style={{ width: "1884px", height: "445px", backgroundColor: "#fdeb49", marginTop: "-40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img src="../public/icon/FLOOR.png" className="picicon" style={{ width: "1000px", height: "420px" }} />
        <img src="../public/icon/FLOOR.png" className="picicon" style={{ width: "1000px", height: "420px", marginLeft: "-50px" }} />
      </div>
    </Card>
  </div>
  
  );
}

export default addDataD;



