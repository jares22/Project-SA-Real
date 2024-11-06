import React, { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, Tag, Tooltip, Card, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetPaymentsWithPassengers } from "../services/https/http";
import { PaymentInterface } from "../interfaces/IfUser";
import SidebarUsers from "../components/SideBarUsers";

const { Title, Text } = Typography;

const CheckPaymentStatus_User: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // เปลี่ยนสีพื้นหลังของหน้า
  useEffect(() => {
    document.body.style.backgroundColor = "#14919B";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // กำหนดคอลัมน์ของตาราง
  const columns: ColumnsType<PaymentInterface> = [
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passenger_name",
      key: "passenger_name",
      render: (name: string) => (
        <Tooltip title="ชื่อผู้โดยสาร">
          <Text strong>{name}</Text>
        </Tooltip>
      ),
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
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "ที่นั่ง",
      dataIndex: "seat",
      key: "seat",
      render: (seat: string) => <Tag color="volcano">{seat}</Tag>,
    },
    {
      title: "ยอดที่ต้องชำระ",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <Text style={{ fontWeight: "bold", color: "#3f8600" }}>
          {total?.toFixed(2)} บาท
        </Text>
      ),
    },
    {
      title: "สถานะการชำระเงิน",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "Pass") {
          return <Tag color="green">ตรวจสอบแล้ว</Tag>;
        } else if (status === "Process") {
          return <Tag color="orange">ยังไม่ตรวจสอบ</Tag>;
        } else {
          return <Tag color="red">ชำระเงินไม่สำเร็จ</Tag>;
        }
      },
    },
  ];

  // ฟังก์ชันดึงข้อมูลการชำระเงิน
  const getPayments = async () => {
    try {
      const res = await GetPaymentsWithPassengers(localStorage.RoleID);
      if (res) {
        setPayments(res);
      }
    } catch (error) {
      console.error("Error in getPayments:", error);
    }
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลการชำระเงิน และตั้งค่าให้ดึงข้อมูลทุก ๆ 5 วินาที
  useEffect(() => {
    getPayments();
    const interval = setInterval(() => {
      getPayments();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", width: "100%" }}>
      <SidebarUsers />
      <Card
        style={{
          width: "1200px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {contextHolder}
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Title level={3}>จัดการข้อมูลการชำระเงิน</Title>
          </Col>
        </Row>
        <Divider />
        <Table
          rowKey="payment_id"
          columns={columns}
          dataSource={payments}
          pagination={{ pageSize: 8 }}
          style={{ marginTop: "20px", borderRadius: "10px" }}
        />
      </Card>
    </div>
  );
};

export default CheckPaymentStatus_User;
