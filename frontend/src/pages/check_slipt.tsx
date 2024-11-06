import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message, Input } from "antd";
import { DeleteOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { DeletePaymentByID, UpdatePayment } from "../services/https/http";
import { PaymentInterface } from "../interfaces/IfUser";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/sideBarAdmin";
import dayjs from "dayjs";
import { GetPaymentsWithPassengers_Foradmin } from "../services/https/http";
import { PassengerEdit } from "../services/https/http"; // import ฟังก์ชัน PassengerEdit

const { Search } = Input;

const CheckSlip: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInterface[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentInterface[]>(payments); // สร้าง state สำหรับข้อมูลที่กรอง
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [isSlipModalVisible, setIsSlipModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentInterface | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<PaymentInterface | null>(null);



  useEffect(() => {
    document.body.style.backgroundColor = "#F6C360";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const columns: ColumnsType<PaymentInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "payment_id",
      key: "id",
    },
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passenger_name",
      key: "passenger_name",
    },
    {
      title: "ต้นทาง",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "ปลายทาง",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "วันที่เดินทาง",
      dataIndex: "date",
      key: "Date",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "ที่นั่ง",
      dataIndex: "seat",
      key: "seat",
    },
    {
      title: "สถานะการชำระเงิน",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "Pass") {
          return <span style={{ color: "#33B833", fontSize: "16px", fontWeight: "bold" }}>ตรวจสอบแล้ว</span>;
        } else if (status === "Process") {
          return <span style={{ color: "#D79619", fontSize: "16px", fontWeight: "bold" }}>ยังไม่ตรวจสอบ</span>;
        } else {
          return <span style={{ color: "red", fontSize: "16px", fontWeight: "bold" }}>ชำระเงินไม่สำเร็จ</span>;
        }
      },
    },
    {
      title: "วันที่ทำรายการ",
      dataIndex: "transactiondate",
      key: "TransactionDate",
      render: (date: string) => <span>{dayjs(date).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      title: "สลิปการชำระเงิน",
      dataIndex: "image",
      key: "image",
      render: (text: string, record: any) => (
        <Button
          type="link"
          style={{
            width: "150px",                // ขนาดปุ่ม
            backgroundColor: "#F7B22C",    // สีพื้นหลังสวยงาม
            color: "white",                // สีตัวหนังสือ
            borderRadius: "8px",           // ขอบโค้งมน
            padding: "10px",               // เพิ่มพื้นที่ภายในปุ่ม
            fontWeight: "",            // ข้อความหนา
            textAlign: "center",           // จัดข้อความให้อยู่กลาง
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",  // เงาให้ดูนูนขึ้น
            transition: "background-color 0.3s ease",     // เพิ่มเอฟเฟกต์ transition
          }}
          onClick={() => handleOpenSlipModal(record)}
        >
          คลิกเพื่อตรวจสอบ
        </Button>
      ),
    },
    
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginLeft: 10 }} shape="circle" icon={<DeleteOutlined />} size={"large"} danger />
        </>
      ),
    }
  ];

  const handleSearch = (value: string) => {
    const filteredData = payments.filter((payment) =>
      payment.passenger_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPayments(filteredData);
  };

  useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  const getPayments = async () => {
    try {
      let res = await GetPaymentsWithPassengers_Foradmin();
      if (res) {
        setPayments(res);
      } else {
        console.error("Failed to fetch payments with passengers");
      }
    } catch (error) {
      console.error("Error in getPayments:", error);
    }
  };

  const showModal = (val: PaymentInterface) => {
    setModalText(`คุณต้องการลบข้อมูลการชำระเงิน ID: ${val.payment_id} หรือไม่ ?`);
    setDeleteId(val.payment_id);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    let res = await DeletePaymentByID(deleteId);
    if (res) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      getPayments();
    } else {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenSlipModal = (record: PaymentInterface) => {
    setSelectedRecord(record);
    setIsSlipModalVisible(true);
  };

  const handleCloseSlipModal = () => {
    setIsSlipModalVisible(false);
    setSelectedRecord(null);
  };

  const handleConfirmBooking = async () => {
    if (selectedRecord) {
      try {
        const payloadUpdatePayment = {
          paymentid: selectedRecord.payment_id,
          status: 'Pass',
        };
        const updatedStatus = await UpdatePayment(payloadUpdatePayment);
        if (updatedStatus) {
          message.success("สถานะการชำระเงินถูกอัปเดตเป็น 'ตรวจสอบสลิปแล้ว'");
          getPayments();
          handleCloseSlipModal();
        } else {
          message.error("ไม่สามารถอัปเดตสถานะการชำระเงินได้");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        message.error("เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน");
      }
    }
  };

  const handleConfirmUnBooking = async () => {
    if (selectedRecord) {
      try {
        const payloadUpdatePayment = {
          paymentid: selectedRecord.payment_id,
          status: 'did not pass',
        };
        const updatedStatus = await UpdatePayment(payloadUpdatePayment);
        if (updatedStatus) {
          message.success("สถานะการชำระเงินถูกอัปเดตเป็น 'ชำระเงินไม่สำเร็จ'");
          getPayments();
          handleCloseSlipModal();
        } else {
          message.error("ไม่สามารถอัปเดตสถานะการชำระเงินได้");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        message.error("เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน");
      }
    }
  };

 const handleDeleteAll = async () => {
  try {
    // เรียกใช้งาน DeletePaymentByID สำหรับทุก payment
    const promises = payments.map((payment) => DeletePaymentByID(payment.payment_id));
    const results = await Promise.all(promises);

    console.log("Delete results:", results); // ล็อกผลลัพธ์เพื่อเช็คว่าแต่ละรายการลบได้สำเร็จหรือไม่

    // ตรวจสอบว่าไม่มีค่า false หรือ undefined ในผลลัพธ์
    if (results.every((res) => res === true)) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูลบางรายการ");
      getPayments(); // เรียกข้อมูลใหม่หลังจากลบ
    } else {
      message.success("ลบข้อมูลการชำระเงินทั้งหมดสำเร็จ");
      getPayments();
    }
  } catch (error) {
    console.error("Error deleting all payments:", error);
    message.error("เกิดข้อผิดพลาดในการลบข้อมูลทั้งหมด");
  }
};


  useEffect(() => {
    getPayments();
    const interval = setInterval(() => {
      getPayments();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", marginLeft: "250px", marginTop: "40px", width: "1600px", backgroundColor: "white", borderRadius: "20px 20px 0 0" }}>
      <SidebarAdmin />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1, marginLeft: "20px" }}>
        {contextHolder}
        <Row style={{ width: "80%", marginTop: "20px" }}>
          <Col span={12}>
            <h2>จัดการข้อมูลการชำระเงิน</h2>
          </Col>
          <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
            <Space>
            <Search
  placeholder="ค้นหาชื่อผู้โดยสาร"
  onChange={(e) => handleSearch(e.target.value)} // ใช้ onChange แทน onSearch
  allowClear
  style={{ width: 300 }}
/>
              <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteAll}>
                ลบข้อมูลทั้งหมด
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ width: "80%" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: 20 }}>
          <Table rowKey="id" columns={columns} dataSource={filteredPayments} />
        </div>
        <Modal title="ลบข้อมูล ?" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
          <p>{modalText}</p>
        </Modal>
        <Modal
  title={null}  // ซ่อนชื่อ title ของ modal
  visible={isSlipModalVisible}
  onCancel={handleCloseSlipModal}
  footer={null}
  width={900}
  style={{ borderRadius: '12px', overflow: 'hidden' }}  // เพิ่มขอบมน
>
  {selectedRecord && (
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* ภาพสลิปทางซ้าย */}
      <div style={{ flex: 1, padding: '10px', backgroundColor: '#F6F6F6', borderRadius: '12px' }}>
        <img
          src={selectedRecord.image}
          alt="Payment Slip"
          style={{ width: '100%', borderRadius: '12px' }}
        />
      </div>
      
      {/* รายละเอียดทางขวา */}
      <div style={{ flex: 1, padding: '10px 20px', backgroundColor: '#EDEDED', borderRadius: '12px' }}>
        <p style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}><strong>ยอดที่ต้องชำระ:</strong></p>
        <Input 
          style={{
            marginBottom: '20px',
            backgroundColor: '#f5f5f5', 
            border: 'none', 
            height: '40px', 
            borderRadius: '8px',
            color:"#888888",
          }} 
          value={selectedRecord.total?.toFixed(2)} 
          disabled
        />
        <p style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}><strong>วันที่ชำระ:</strong></p>
        <Input 
          style={{
            marginBottom: '20px',
            backgroundColor: '#f5f5f5', 
            border: 'none', 
            height: '40px', 
            borderRadius: '8px',
            color:"#888888",
          }} 
          value={dayjs(selectedRecord.transactiondate).format("DD/MM/YYYY")} 
          disabled
        />
        <p style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}><strong>เวลาชำระ:</strong></p>
        <Input 
          style={{
            marginBottom: '20px',
            backgroundColor: '#f5f5f5', 
            border: 'none', 
            height: '40px', 
            borderRadius: '8px',
            color:"#888888",
          }} 
          value={dayjs(selectedRecord.transactiondate).format("HH:mm")} 
          disabled
        />
        
        {/* ปุ่มยืนยันและกลับ */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button 
            style={{ 
              marginRight: '10px', 
              backgroundColor: '#CCCCCC', 
              color: '#333', 
              borderRadius: '8px',
              padding: '10px 20px',
              border: 'none',
            }} 
            onClick={handleCloseSlipModal}
          >
            กลับ
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirmUnBooking} 
            style={{ 
              marginRight: '10px', 
              backgroundColor: '#FF4D4F', 
              color: 'white', 
              borderRadius: '8px',
              padding: '10px 20px',
              border: 'none',
            }}
          >
            ชำระเงินไม่สำเร็จ
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirmBooking} 
            style={{ 
              backgroundColor: '#FFD700', 
              color: '#333', 
              borderRadius: '8px', 
              padding: '10px 20px', 
              border: 'none',
              
            }}
          >
            ยืนยันข้อมูล
          </Button>
        </div>
      </div>
    </div>
  )}
</Modal>

      </div>
    </div>
  );
};

export default CheckSlip;
