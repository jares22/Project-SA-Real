import { useState, useEffect } from "react";  //ชื่อ UserInterface ต้องเหมือนกับใน Interface 
import { Table, Button, Col, Row, message, Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GetAllVehicles, DeleteVehicleByID} from "../services/https/http";
import type { ColumnsType } from "antd/es/table";
import { FunctionComponent } from "react";
import SidebarAdminPage from "../components/sideBarAdmin";
import { Link,useNavigate } from 'react-router-dom';  /*เอาไว้ลิงค์ไปหน้าต่างๆ*/
import { VehiclestInterface } from "../interfaces/ifVehicles";

const Vehicles: FunctionComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
    const [modalText, setModelText] = useState<string>();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [SetDeleteVehicleValue, setDeleteVehicleByID] = useState<Number>();
    const columns: ColumnsType<VehiclestInterface> = [
        {
          title: "BusID",
          dataIndex: "ID", 
          width: "100px"

        },
        {
          title: "Type",
          dataIndex: "Type",   /* ใน Database ชื่อมันเป็นยังไงตอนรับต้องอิงตามนั้น*/
          key: "5555",
          width: "90px"
        },        
        {
          title: "BusRegistration",
          dataIndex: "BusRegistration",  //อิง Object JSON ที่รีเทินออกจาก data base จาก ชื่อนี้ 
          key: "password",
          width: "200px"
        },
        {
          title: "Brand",
          dataIndex: "Brand",
          width: "200px"
        },

        {
          title: "Series",
          dataIndex: "Series",
          width: "200px"
        },

        {
          title: "Year",
          dataIndex: "Year",
          width: "150px"
        },
        
        
        {
          title: "EngineAndPower",
          dataIndex: "EngineAndPower",  //อิง Object JSON ที่รีเทินออกจาก data base จาก ชื่อนี้ 
          width: "300px"
        },
        
        {
          title: "FuelTank",
          dataIndex: "FuelTank",
          width: "140px"
        },
        
        {
          title: "Seat",
          dataIndex: "Seat",
          width: "140px"
        },
            
        {
          title: "จัดการ",
          dataIndex: "Manage",
          key: "manage",
          

          
          render: (text, record, index) => (
            <>
              
              <Button shape="circle" icon={<EditOutlined />} size={"large"} 
               onClick={() => navigate(`/admin/EditDataV/${record.ID}`)} // ปุ่มเเก้ไข
          /> 
              
              
              <Button 
                onClick={() => showModelVehicle(record)}
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
    
      const showModelVehicle = (record: VehiclestInterface) => {
        setModelText(`คุณต้องการลบข้อมูลรถคันที่ ${record.ID} ทะเบียนรถ : ${record.BusRegistration}  ยี่ห้อ : ${record.Brand} ใช่หรือไม่?`);
        setDeleteVehicleByID(record.ID);
        setOpen(true); // จะเปิดโมดัล
      };

    const [vehicles, setVehicless] = useState<VehiclestInterface[]>([]);

    const getAllVehicles = async () => {
    let res = await GetAllVehicles();
      console.log(res);
     if (res) {
        setVehicless(res);
     }
    };

    const handleOkVehicle = async () => {
      setConfirmLoading(true);
      // console.log("Delete Vehicle 888 : ",SetDeleteVehicleValue);
      let res = await DeleteVehicleByID(Number(SetDeleteVehicleValue));
      // console.log("Delete Vehicle: ",res);
      
      if (res) {
        setOpen(false);
        messageApi.open({type: "success",content: "ลบข้อมูลสำเร็จ",});
        
        getAllVehicles();  //เพื่อรีตาราง
      
      } else {
        setOpen(false);
        messageApi.open({ type: "error", content: "เกิดข้อผิดพลาด !",});
      }
      
      setConfirmLoading(false);
    
    };

    const handleCancel = () => {
      setOpen(false);
    }

    useEffect(() => {   //ทำครั้งแรกที่มาหน้านี้ มานี้แล้วจะทำฟังก์ชั่นี้ทันที   1
      getAllVehicles();
    }, []);
  return (

      <div style={{backgroundColor: "#fdeb49", width: "98.5vw", height: "945px", position: "absolute", margin: "0px 0px 0px 0px"}}>
      <SidebarAdminPage />
      <h1 style={{marginLeft: "550px"}}>ระบบจัดการข้อมูลรถและพนักงาน (Manage Detailing)</h1> 
      <Row gutter={24} style={{margin: "80px 0px 0px 80px"}}>
          {contextHolder}
          
          <Modal
          title="ต้องการลบข้อมูล" 
          open={open} onOk={handleOkVehicle} 
          confirmLoading={confirmLoading} 
          onCancel={handleCancel}>
          <p>{modalText}</p>
          </Modal>

          <img src="../public/icon/WhiteBus.png" className="picicon" style={{ width: '200px', height: '100px',marginLeft: "70px",marginTop: "-50px" }} />
          <img src="../public/icon/REDWhiteBus.png" className="picicon" style={{ width: '200px', height: '200px',marginLeft: "120px",marginTop: "-90px" }} />
          <img src="../public/icon/GOLDBus.png" className="picicon" style={{ width: '150px', height: '120px',marginLeft: "170px",marginTop: "-60px" }} />
          <img src="../public/icon/BLACKBus.png" className="picicon" style={{ width: '200px', height: '200PX',marginLeft: "190px",marginTop: "-90px" }} />
          <img src="../public/icon/YELLOWBLUEBus.png" className="picicon" style={{ width: '250px', height: '250px',marginLeft: "150px",marginTop: "-110px" }} />
          <Col span={12} >
          <Card title="จัดการข้อมูลรถ (Vehicles Manage)" style={{marginLeft: "0px",backgroundColor: "#82b954",width: "1780px", height: "68vh"}}>
            <Row gutter={24}>
            <Col span={20}/>
              <Link to="/admin/AddDataV">
              <Button type="primary" style={{marginLeft: "1550px",marginBottom: "20px", backgroundColor: "green" }}>เพิ่มข้อมูลรถ (Add Vehicles)</Button>
              </Link>
            
            </Row>
            <Table rowKey="ID" columns={columns} dataSource={vehicles} pagination={false} scroll={{ y: 430 } }/> 
          </Card>
          </Col>
          
      </Row>
      </div>

  );
}

export default Vehicles;



