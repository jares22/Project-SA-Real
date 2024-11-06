import { useState, useEffect } from "react";
import { Space, Button, Col, Row, Form, Card, message, Select } from "antd";
import { VehiclestInterface } from "../interfaces/ifVehicles";
import { EmployeesInterface } from "../interfaces/ifEmployees";
import { DriverstInterface } from "../interfaces/ifDrivers";
import { PlusOutlined } from "@ant-design/icons";
import {  UpdateDriver, GetListEmployees, GetListBuss,GetDriverByID } from "../services/https/http";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom'; 

const { Option } = Select;

function EditDriver() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const { DriverID } = useParams();
    console.log('DriverID = ', DriverID );

    const [saveDriverID, setDriverByIDsave] = useState<DriverstInterface | null>(null);
    const [employeeJson, setEmployeeJsonToValues] = useState<EmployeesInterface[]>([]);
    const [BusJsonset, getToBusValue] = useState<VehiclestInterface[]>([]);


    const clikConfirmUpdateDriver = async (values: DriverstInterface) => {
        let res = await UpdateDriver({ ...values, DriverID: saveDriverID?.DriverID });
        console.log('UpdateDriver: ', res); // บันทึกข้อมูลการตอบกลับเพื่อตรวจสอบปัญหา
        if (res && !res.error) {
            messageApi.open({
                type: "success",
                content: res.message || "อัปเดตข้อมูลสำเร็จ",
            });
            setTimeout(() => navigate("/admin/EmployeesAndDrivers"), 1000);
        } else {
            messageApi.open({
                type: "error",
                content: res.error || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
            });
        }
    };

    const getDriverByID = async () => {
        let res = await GetDriverByID(Number(DriverID));
        if (res) {
            setDriverByIDsave(res);
            form.setFieldsValue({
                EmployeeID: res.EmployeeID,
                BusID: res.BusID,
            });
        } else {
            messageApi.open({
                type: "error",
                content: "ไม่พบข้อมูลที่ต้องการแก้ไข",
            });
        }
    };

    const getListEmployee = async () => {
        let EmployeeJson = await GetListEmployees();
        setEmployeeJsonToValues(EmployeeJson);
    };

    const getListBus = async () => {
        let BusJson = await GetListBuss();
        getToBusValue(BusJson);
    };

    // โหลดข้อมูลเมื่อหน้าเพจถูกเรียกใช้
    useEffect(() => {
        getDriverByID();
        getListEmployee();
        getListBus();
    }, []);


    return (
        <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "945px", position: "absolute", margin: "0px 0px 0px 0px" }}>
        <h1 style={{ textAlign: "center" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
        {contextHolder}
    
        {/* ใช้ Flexbox เพื่อให้ Card ทั้งสามอยู่ในแถวเดียวกัน */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: "20px", flexWrap: "wrap" }}>
            
    
            <Card style={{ width: "1000px", height: "420px", backgroundColor: "#bae0ff" }}>
                <h1>{ "แก้ไขข้อมูลพนักงานขับ (Edit Drivers)" }</h1>
                <Form form={form} name="basic" layout="vertical" onFinish={clikConfirmUpdateDriver} autoComplete="off">
                    <Row gutter={24}>
                        <Col lg={24}>
                            <Form.Item label="รหัสประจำตัวพนักงาน (EmployeeID)" name="EmployeeID" rules={[{ required: true, message: "กรุณากรอกข้อมูลรหัสประจำตัวพนักงาน Please enter EmployeeID!" }]}>
                                <Select>
                                    {employeeJson.map(employ => (
                                        <Option key={employ.EmployeeID} value={employ.EmployeeID}>
                                            {" รหัสพนักงาน = "}{employ.EmployeeID}{" ชื่อ: "}{employ.FirstName}{" นามสกุล: "}{employ.LastName}{" ตำแหน่ง: "}{employ.Position}{" เบอร์โทรศัพท์: "}{employ.PhoneNumber}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col lg={24}>
                            <Form.Item label="รหัสประจำตัวรถ (BusID)" name="BusID" rules={[{ required: true, message: "กรุณากรอกข้อมูลรหัสประจำตัวรถ Please enter BusID!" }]}>
                                <Select>
                                    {BusJsonset.map(bus => (
                                        <Option key={bus.BusID} value={bus.BusID}>
                                            {" รหัสรถ = "}{bus.BusID}{" ประเภทรถ: "}{bus.Type}{" ทะเบียนรถ: "}{bus.BusRegistration}{" ยี่ห้อรถ: "}{bus.Brand}{" จำนวนที่นั่ง: "}{bus.Seat}
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
                                <Button htmlType="reset" style={{ marginRight: "10px" }} onClick={() => form.resetFields()}>รีเซ็ต</Button>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                                    { "อัปเดตข้อมูล" }
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
   
                
        </div>
        <Card style={{ width: "1884px", height: "460px", backgroundColor: "#fdeb49",marginTop:"-20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img src="../../public/icon/FLOOR.png" className="picicon" style={{ width: '1000px', height: '435px' }} />
        <img src="../../public/icon/FLOOR.png" className="picicon" style={{ width: '1000px', height: '435px',marginLeft: "-50px" }} />
        </div>
        </Card>

    </div>
    
    );
}

export default EditDriver;


