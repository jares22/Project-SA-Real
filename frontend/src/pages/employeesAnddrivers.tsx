import React, { useState, useEffect } from "react";
import { Table, Button, Col, Row, message, Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GetAllEmployees, GetAllDrivers, DeleteEmployeeByID, DeleteDriverByID } from "../services/https/http"; 
import { FunctionComponent } from "react";
import SidebarAdminPage from "../components/sideBarAdmin";
import { Link } from 'react-router-dom';
import { EmployeesInterface } from "../interfaces/ifEmployees";
import { DriverstInterface } from "../interfaces/ifDrivers";
import { ColumnsType } from "antd/es/table";

const EmployeesAndDrivers: FunctionComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();

  // State สำหรับการลบพนักงาน
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [modalEmployeeText, setModalEmployeeText] = useState<string>();
  const [confirmLoadingEmployee, setConfirmLoadingEmployee] = useState(false);
  const [SetDeleteEmployeeByValue, setDeleteEmployeeByID] = useState<number | undefined>();

  // State สำหรับการลบพนักงานขับ
  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [modalDriverText, setModalDriverText] = useState<string>();
  const [confirmLoadingDriver, setConfirmLoadingDriver] = useState(false);
  const [SetDeleteDriverByValue, setDeleteDriverByID] = useState<number | undefined>();

  // Columns สำหรับพนักงาน
  const columns1: ColumnsType<EmployeesInterface> = [
    { title: "EmID", dataIndex: "ID", width: '80px' },
    { title: "Username", dataIndex: "Username", width: '100px' },
    { title: "Password", dataIndex: "Password", width: '100px' },
    { title: "FirstName", dataIndex: "FirstName" },
    { title: "LastName", dataIndex: "LastName" },
    { title: "PhoneNumber", dataIndex: "PhoneNumber" },
    { title: "Position", dataIndex: "Position" },
    { title: "Address", dataIndex: "Address" },
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record) => (
        <>
          <Link to={`/admin/EditDataE/${record.ID}`}>
            <Button shape="circle" icon={<EditOutlined />} size="large" />
          </Link>
          <Button
            onClick={() => showEmployeeModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  // Columns สำหรับพนักงานขับ
  const columns2: ColumnsType<DriverstInterface> = [
    { title: "DriverID", dataIndex: "ID", width: '90px' },
    { title: "EmployeeID", dataIndex: "EmployeeID", width: '120px' },
    { title: "BusID", dataIndex: "BusID", width: '120px' },
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage",
      width: '120px',
      render: (text, record) => (
        <>
          <Link to={`/admin/EditDataD/${record.ID}`}>
            <Button shape="circle" icon={<EditOutlined />} size="large" />
          </Link>
          <Button
            onClick={() => showDriverModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  // ฟังก์ชันแสดง Modal สำหรับพนักงาน
  const showEmployeeModal = (record: EmployeesInterface) => {
    setModalEmployeeText(`คุณต้องการลบพนักงานชื่อ ${record.FirstName} ${record.LastName} ตำแหน่ง: ${record.Position} ใช่หรือไม่?`);
    setDeleteEmployeeByID(record.ID);
    setOpenEmployeeModal(true);
  };

  // ฟังก์ชันแสดง Modal สำหรับพนักงานขับ
  const showDriverModal = (record: DriverstInterface) => {
    setModalDriverText(`คุณต้องการลบพนักงานขับที่ ${record.ID} รหัสประจำตัวพนักงานที่: ${record.EmployeeID} เเละ อยู่ประจำรถคันที่: ${record.BusID} ใช่หรือไม่?`);
    setDeleteDriverByID(record.ID);
    setOpenDriverModal(true);
  };
  const handleOkE = async () => {
    setConfirmLoadingEmployee(true);
    try {
        console.log("Attempting to delete employee with ID:", SetDeleteEmployeeByValue);
        const res = await DeleteEmployeeByID(SetDeleteEmployeeByValue);
        console.log("Response from delete operation:", res);
        if (res) {
            messageApi.open({ type: "success", content: "ลบข้อมูลสำเร็จ" });
            
            await getAllEmployees(); // รีเฟรชข้อมูล

        } else {
            throw new Error("ไม่สามารถลบข้อมูลได้");
        }
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || "เกิดข้อผิดพลาด";
        messageApi.open({ type: "error", content: `เกิดข้อผิดพลาด: ${errorMessage}` });
    } finally {
        setOpenEmployeeModal(false);
        setConfirmLoadingEmployee(false);
    }
};


const handleOkD = async () => {
    setConfirmLoadingDriver(true);
    try {
        const res = await DeleteDriverByID(SetDeleteDriverByValue);
        if (res) {
            messageApi.open({ type: "success", content: "ลบข้อมูลสำเร็จ" });
            
            await getAllDrivers(); // รีเฟรชข้อมูล

        } else {
            throw new Error("ไม่สามารถลบข้อมูลได้");
        }
    } catch (error: unknown) { // Cast error as unknown
        const errorMessage = (error as Error).message || "เกิดข้อผิดพลาด";
        messageApi.open({ type: "error", content: `เกิดข้อผิดพลาด: ${errorMessage}` });
    } finally {
        setOpenDriverModal(false);
        setConfirmLoadingDriver(false);
    }
};


  const handleCancelE = () => setOpenEmployeeModal(false);
  const handleCancelD = () => setOpenDriverModal(false);

  // ดึงข้อมูลพนักงานและพนักงานขับ
  const [employees, setEmployees] = useState<EmployeesInterface[]>([]);
  const [drivers, setDrivers] = useState<DriverstInterface[]>([]);

  const getAllEmployees = async () => {
    const res = await GetAllEmployees();
    if (res) setEmployees(res);
  };

  const getAllDrivers = async () => {
    const res = await GetAllDrivers();
    if (res) setDrivers(res);
  };

  useEffect(() => {
    getAllEmployees();
    getAllDrivers();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#fdeb49", width: "98.5vw", height: "945px", position: "absolute" }}>
        <SidebarAdminPage />
        <h1 style={{ marginLeft: "650px" }}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1>
        <Row gutter={24} style={{ margin: "80px 0px 0px 80px" }}>
        {contextHolder}
          
          {/* Modal สำหรับลบพนักงาน */}
          <Modal
            title="ต้องการลบข้อมูล"
            open={openEmployeeModal}
            onOk={handleOkE}
            confirmLoading={confirmLoadingEmployee}
            onCancel={handleCancelE}
          >
            <p>{modalEmployeeText}</p>
          </Modal>

          {/* Modal สำหรับลบพนักงานขับ */}
          <Modal
            title="ต้องการลบข้อมูล"
            open={openDriverModal}
            onOk={handleOkD}
            confirmLoading={confirmLoadingDriver}
            onCancel={handleCancelD}
          >
            <p>{modalDriverText}</p>
          </Modal>

          {/* ตารางพนักงาน */}
          <Col span={18}>
            <Card title="จัดการข้อมูลพนักงาน (Employees Manage)" style={{ marginLeft: "-30px", backgroundColor: "pink", width: "1200px", height: "83vh" }}>
              <Row gutter={24}>
                <Link to="/admin/AddDataE">
                  <Button type="primary" style={{ marginLeft: "916px", marginBottom: "20px", backgroundColor: "green" }}>เพิ่มข้อมูลพนักงาน (Add Employees)</Button>
                </Link>
              </Row>
              <Table rowKey="ID" columns={columns1} dataSource={employees} pagination={false} scroll={{ y: 580 }} />
            </Card>
          </Col>

          {/* ตารางพนักงานขับ */}
          <Col span={6} style={{ marginLeft: "-180px" }}>
            <Card title="จัดการข้อมูลพนักงานขับ (Drivers Manage)" style={{ backgroundColor: "#bae0ff", width: "610px", height: "83vh" }}>
              <Row gutter={24}>
                <Link to="/admin/AddDataD">
                  <Button type="primary" style={{ marginLeft: "332px", marginBottom: "20px", backgroundColor: "green" }}>เพิ่มข้อมูลพนักงานขับ (Add Drivers)</Button>
                </Link>
              </Row>
              <Table rowKey="ID" columns={columns2} dataSource={drivers} pagination={false} scroll={{ y: 580 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EmployeesAndDrivers;
