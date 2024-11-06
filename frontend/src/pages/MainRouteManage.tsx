import { FunctionComponent } from "react";
import {Button,Table, Card,Row, Col, message, Modal} from 'antd';
import  { useState, useEffect } from 'react';
import SidebarAdminPage from "../components/sideBarAdmin";
import { GetListRouteMainManage, DeleteBusTimingByID } from "../services/https/http";
import {RouteInterface} from "../interfaces/IRoute"
import {BusInterface} from "../interfaces/Ibus"
import {busTimingInterface} from "../interfaces/busTiming"
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

const MainRouteManage: FunctionComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<String>();
  const [deleteBustimingId, setDeleteBustimingId] = useState<Number>();
  
  
  const [mainRoute, setMainRoute] = useState<RouteInterface & BusInterface & busTimingInterface[]>([]);
  const navigate = useNavigate();

  const getListRouteMainManage = async () => {
    let res = await GetListRouteMainManage();
    console.log('ListMainRouteManege',res);
    //if (res) {
      setMainRoute(res);  /*ไม่ใช้ IF กรณี ลบแถวที่มีแถวเดียว ค่าที่ออกมาจะเป็น NULL จะไม่เข้าเงื่อนไข IF ตารางจะไม่ถูก รีเฟส*/
    //}
  };

  useEffect(() => {
    getListRouteMainManage();
  }, []);

  const handleOk = async () => {
    setConfirmLoading(true);
    let res = await DeleteBusTimingByID(deleteBustimingId);
    console.log("Delete Bustiming: ",res);
    if (res) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      getListRouteMainManage();  //เพื่อรีตาราง
    } else {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
    setConfirmLoading(false);
  };
  
  const columns: TableColumnsType = [
    { title: 'ทะเบียนรถ', dataIndex: 'license_plate', key: 'LicensePlate' },
    { title: 'สายเดินรถ', dataIndex: 'name_route', key: 'Name' },
    { title: 'วันไป', dataIndex: 'departure_day', key: 'DepartureDay' },
    { title: 'เวลาไป', dataIndex: 'departure_time', key: 'DepartureTime' },
    { title: 'วันกลับ', dataIndex: 'return_day', key: 'ReturnDay' },
    { title: 'เวลากลับ', dataIndex: 'return_time', key: 'ReturnTime' },    /*ปรับ dataIndex ให้ตรงกับ Object หรือ Interfaceที่เป็นตัวรับ*/
    {
      title: 'การจัดการ',
      key: 'actions',
      render: ( record) => (
        <>
          <Button
            onClick={() => navigate(`/admin/MainRouteEdit/${record.bustiming_id}`)}   
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}   //ปุ่มแก้ไข
          />
          <Button
            onClick={() => showModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}  //ปุ่มลบ
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];
  const showModal = (record: RouteInterface & BusInterface & busTimingInterface & any) => {
    setModalText(
      `รถทะเบียน ${record.license_plate}
      เส้นทาง  ${record.name_route} BusTiming_id ${record.bustiming_id} หรือไม่ ?`
    );
    setDeleteBustimingId(record.bustiming_id);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <SidebarAdminPage />
      <Row align="middle" gutter={24} style={{ backgroundColor: "#F7B22C", minHeight: "97vh", padding: "20px" }}>
        {contextHolder}
        <Col span={1} />
        <Col span={23}>
      <Modal
          title="คุณต้องการลบข้อมูล"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          >
        <p>{modalText}</p>
      </Modal>
          <Card
            title={<span style={{ fontSize: "24px", marginLeft: "40%" }}>ระบบจัดการเส้นทางเดินรถ</span>}
            style={{ marginTop: "50px", marginLeft: "120px", width: "1555px", height: "800px" }}
          >
            <Row gutter={24}>
              <Col span={21} />
              <Link to="/admin/AddRouteManage">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    height: "40px",
                    width: "150px",
                    marginBottom: "25px",
                    backgroundColor: "#F7B22C",
                    color: "black",
                    fontWeight: "bold",
                    transition: "background-color 0.1s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6D799")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F7B22C")}
                >
                  เพิ่มเส้นทาง
                </Button>
              </Link>
            </Row>
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    {record.routeway} {/* แสดงข้อมูล Routeway เมื่อแถวถูกขยาย */}
                  </p>
                ),
                rowExpandable: (record) => record.Name !== 'Not Expandable', // กำหนดแถวที่ไม่สามารถขยายได้
              }}
              dataSource={mainRoute}
              rowKey="bustiming_id" // กำหนดคีย์ของแต่ละแถวให้เป็น BusTimingID และต้องมีใน rowKey ด้วย
              scroll={{ y: 540 }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MainRouteManage;
