import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, Input, Tag } from "antd";
import { FileOutlined, SearchOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import type { ColumnsType } from "antd/es/table";
import { GetPaymentsWithStatusPass } from "../services/https/http";
import { PaymentInterface } from "../interfaces/IfUser";
import SidebarUsers from "../components/SideBarUsers";
import dayjs from "dayjs";

// ปรับสีปุ่มให้สวยงาม
const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  borderRadius: "5px",
};

const User_ticket: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInterface[]>([]);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<PaymentInterface | null>(null);
  const [searchText, setSearchText] = useState(""); // สถานะสำหรับค้นหา

  // ฟังก์ชันเปิด Modal
  const handleOpenTicketModal = (record: PaymentInterface) => {
    setSelectedTicket(record);
    setIsTicketModalVisible(true);
  };

  // ฟังก์ชันปิด Modal
  const handleCloseTicketModal = () => {
    setIsTicketModalVisible(false);
    setSelectedTicket(null);
  };

  // Fetch payments with status 'Pass' from the server
  const getPayments = async () => {
    try {
      const res = await GetPaymentsWithStatusPass(localStorage.RoleID);
      if (res) {
        setPayments(res);
        console.log("Payments with status 'Pass' fetched:", res);
      } else {
        console.error("Failed to fetch payments with status 'Pass'");
      }
    } catch (error) {
      console.error("Error in getPayments:", error);
    }
  };

  // ฟังก์ชันสำหรับการค้นหาข้อมูลในตาราง
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // กรองข้อมูลในตารางด้วยค่าการค้นหา
  const filteredPayments = payments.filter((payment) =>
    payment.passenger_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Load payments when the component is mounted
  useEffect(() => {
    getPayments();
  }, []);

  // Define the columns for the Payment table
  const columns: ColumnsType<PaymentInterface> = [
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passenger_name",
      key: "passenger_name",
      render: (name: string) => <span style={{ fontWeight: "bold" }}>{name}</span>,
    },
    {
      title: "ต้นทาง",
      dataIndex: "departure",
      key: "departure",
      render: (departure: string) => <Tag color="blue">{departure}</Tag>,
    },
    {
      title: "ปลายทาง",
      dataIndex: "destination",
      key: "destination",
      render: (destination: string) => <Tag color="green">{destination}</Tag>,
    },
    {
      title: "วันที่เดินทาง",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "วันที่ทำรายการ",
      dataIndex: "transactiondate",
      key: "TransactionDate",
      render: (date: string) => <span>{dayjs(date).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      title: "ดูตั๋ว",
      key: "viewTicket",
      render: (text, record) => (
        <Button
          type="primary"
          icon={<FileOutlined />}
          onClick={() => handleOpenTicketModal(record)}
          style={buttonStyle}
        >
          ดูตั๋ว
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "440px",
        marginTop: "80px",
        width: "60%",
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ div
        borderRadius: "0px 0px 30px 30px", // ขอบโค้งมน
        padding: "0px", // ลด padding ของ div หลัก
      }}
    >
      {/* ส่วนหัว */}
      <div
        style={{
          backgroundColor: "#213A57", // สีพื้นหลังตรงกับส่วนหัวของตัวอย่าง
          padding: "20px",            // เพิ่ม padding ภายในส่วนหัว
          color: "white",             // ข้อความสีขาว
          textAlign: "left",          // จัดข้อความชิดซ้าย
          fontSize: "18px",           // ขนาดฟอนต์
          fontWeight: "bold",         // ความหนาของฟอนต์
          width: "100%",              // ใช้ความกว้างเต็ม div
          margin: "0",                // ไม่มีระยะห่างจากขอบ
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ color: "white", margin: 0 }}>จัดการข้อมูลการชำระเงิน</h2>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="ค้นหาผู้โดยสาร"
                value={searchText}
                onChange={handleSearch}
                prefix={<SearchOutlined style={{ color: "#888", fontSize: "18px" }} />} // เปลี่ยนสีไอคอน
                style={{
                  borderRadius: "25px",            // ทำให้ขอบมนมากขึ้น
                  width: "300px",                  // ขยายความกว้างของช่องค้นหา
                  padding: "10px 15px",            // เพิ่ม padding เพื่อความสวยงาม
                  backgroundColor: "#f0f0f0",      // สีพื้นหลังช่องค้นหา
                  border: "1px solid #ccc",        // ขอบของช่องค้นหา
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงา
                  transition: "all 0.3s ease",     // เพิ่มเอฟเฟกต์ transition
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = "0 0 10px rgba(0, 123, 255, 0.5)") // เปลี่ยนเงาเมื่อโฟกัส
                }
                onBlur={(e) =>
                  (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)") // คืนค่าเงาเมื่อไม่ได้โฟกัส
                }
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* เนื้อหาภายใน div */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",   // จัดให้อยู่ตรงกลางแนวนอน
          alignItems: "center",       // จัดให้อยู่ตรงกลางแนวตั้ง
          margin: "0 auto",           // ทำให้ margin อัตโนมัติเพื่อจัดตรงกลาง
          width: "100%",
          padding: "20px",            // เพิ่ม padding ภายในส่วนเนื้อหา
        }}
      >
        <SidebarUsers />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginLeft: "20px",
          }}
        >
          <Divider style={{ width: "80%" }} />

          <Table
            rowKey="ID"
            columns={columns}
            dataSource={filteredPayments}
            pagination={{ pageSize: 8 }}
            style={{ width: "100%" }}
          />

          {/* Modal สำหรับแสดงตั๋วและ QR โค้ด */}
          <Modal
            title={
              <div style={{ backgroundColor: "#2E5077", width: "100%", height: "60px", color: "#fff" }}>
                <h3 style={{ margin: 0, textAlign: "left", fontSize: "24px", paddingLeft: "20px" }}>
                  รายละเอียดตั๋ว
                </h3>
              </div>
            }
            visible={isTicketModalVisible}
            onCancel={handleCloseTicketModal}
            footer={null}
            className="custom-modal"
          >
            {selectedTicket && (
              <div
                style={{
                  padding: "20px",
                  fontSize: "16px",
                  backgroundColor: "#F0F0F0",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ fontFamily: "'Sriracha', cursive", textAlign: "center", fontSize: "22px", marginBottom: "10px" }}>
                  Sirisak Tour
                </div>

                <p><strong>ผู้โดยสารคนที่ 1:</strong> {selectedTicket.passenger_name}</p>
                <p><strong>วันที่เดินทาง:</strong> {selectedTicket.date}</p>
                <p><strong>ต้นทาง:</strong> {selectedTicket.departure}</p>
                <p><strong>ปลายทาง:</strong> {selectedTicket.destination}</p>
                <p><strong>ที่นั่ง:</strong> {selectedTicket.seat}</p>
                <p><strong>ยอดที่ต้องชำระ:</strong> {selectedTicket.total?.toFixed(2)} บาท</p>

                {/* แสดง QR Code */}
                {selectedTicket.pass_ticket && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <QRCodeCanvas value={selectedTicket.pass_ticket} size={150} />
                  </div>
                )}

                <div style={{ marginTop: "30px", textAlign: "right" }}>
                  <Button
                    style={{
                      backgroundColor: "#2E5077",
                      color: "white",
                      borderRadius: "30px",
                      padding: "10px 20px",
                      fontSize: "16px",
                    }}
                    onClick={handleCloseTicketModal}
                  >
                    กลับ
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default User_ticket;
