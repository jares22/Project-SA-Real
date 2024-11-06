import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Card, Table, Space, Button, Divider, Form, Input, message, Select } from "antd";
import { VerifyTicket, GetVerifiers, UpdateSeatStatus, fetchBusRounds, TicketVerifycation } from "../services/https/http";
import { TicketVerification } from "../interfaces/ticketVerification";
import type { ColumnsType } from "antd/es/table";
import { BusRound } from "../interfaces/busrounds";
import { Link } from 'react-router-dom';
import QrScanner from "react-qr-scanner";
import './Verification.css';

interface QRScannerProps {
    onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
    const [startScan, setStartScan] = useState(false);

    const handleScan = (data: any) => {
        if (data) {
            onScan(data.text);
            setStartScan(false);
            message.success("QR Code scanned successfully!");
        }
    };

    const handleError = (error: any) => {
        message.error("Error scanning QR Code");
    };

    return (
        <div className="qr-code-container">
            <Button onClick={() => setStartScan(!startScan)} className="qr-scan-button">
                {startScan ? 'Stop Scan' : 'Start QR Scan'}
            </Button>

            {startScan && (
                <div className="qr-scanner">
                    <QrScanner
                        onError={handleError}
                        onScan={handleScan}
                        facingMode="environment"
                        style={{ width: '100%', height: '100%' }} // apply styles using the style prop
                    />
                </div>
            )}
        </div>
    );
};

const { Option } = Select;

const Verifier: React.FC = () => {
    const columns: ColumnsType<TicketVerification> = [
        {
            title: "Ticket Number",
            dataIndex: "pass_ticket",
            key: "passTicket",
        },
        {
            title: "Seat Status",
            dataIndex: "status",
            key: "seatStatus",
            render: (status) => {
                let color = status === "ตรวจสอบแล้ว" ? "green" : "red";
                return <span style={{ color }}>{status}</span>;
            },
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phoneNumber",
        },
        {
            title: "Bus ID",
            dataIndex: "bus_id",
            key: "busID",
        },
        {
            title: "Depart Day",
            dataIndex: "departdate",
            key: "departdate",
        },
        {
            title: "Depart Time",
            dataIndex: "departtime",
            key: "departtime",
        },
    ];

    const [verifierValue, setVerifier] = useState<TicketVerification[] & any>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [busRounds, setBusRounds] = useState<BusRound[]>([]);
    const [selectedRound, setSelectedRound] = useState<string>("");

    const refreshVerifierData = async () => {
        if (selectedRound) {
            const bustiming_id = selectedRound.split(',')[2].trim();
            const newResult = await GetVerifiers(bustiming_id);
            setVerifier(newResult);
        }
    };

    const handleVerification = async (values: TicketVerification) => {
        setLoading(true);
        try {
            const result = await VerifyTicket(values);
            if (result) {
                let newStatus = result.status === "ยังไม่ขึ้นรถ" ? "ตรวจสอบแล้ว" : "สถานะปัจจุบันไม่สามารถตรวจสอบได้";
                await UpdateSeatStatus({
                    pass_ticket: result.pass_ticket!,
                    Status: newStatus,
                });
                messageApi.success(`การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.pass_ticket}, สถานะที่นั่ง: ${newStatus}`);

                const storedDriverId = localStorage.getItem("driver_id");
                const driverId = storedDriverId ? parseInt(storedDriverId, 10) : 1;

                const ticketVerificationData = {
                    passenger_id: result.passenger_id,
                    driver_id: driverId,
                    status: newStatus,
                };

                await TicketVerifycation(ticketVerificationData);
                form.resetFields();
                await refreshVerifierData();
            } else {
                messageApi.error(`ตั๋วไม่ถูกต้อง! ${result.message}`);
            }
        } catch (error) {
            messageApi.error(`เกิดข้อผิดพลาดในการเชื่อมต่อ! ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        messageApi.info("การกรอกข้อมูลถูกยกเลิก");
    };

    const getBusRounds = async () => {
        try {
            const res = await fetchBusRounds();
            if (res) setBusRounds(res);
        } catch (error) {
            message.error("Error fetching bus rounds");
        }
    };

    const FindBusTimeTickets = async (values: any) => {
        const bustiming_id = values.findBusTimeTicket.split(',')[2].trim();
        try {
            const result = await GetVerifiers(bustiming_id);
            setVerifier(result);
            messageApi.success("ค้นหาตั๋วสำเร็จ!");
        } catch {
            messageApi.error("ค้นหาตั๋วล้มเหลว!");
        }
    };

    const handleRoundChange = (value: string) => {
        setSelectedRound(value);
        messageApi.info(`คุณเลือกวันเวลาเดินทาง: ${value.split(',')[0]} เวลา ${value.split(',')[1]}`);
    };

    const handleQRScan = (data: string) => {
        if (data) form.setFieldsValue({ pass_ticket: data });
        else message.error("No QR code detected.");
    };

    useEffect(() => {
        getBusRounds();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userRole');
        localStorage.removeItem('RoleID');
        window.location.href = "/";
    };

    return (
        <div className="container">
            {contextHolder}
            <Row gutter={[16, 16]} style={{ flex: 1, height: "100%", overflow: "hidden" }}>
                <Col xs={24} sm={12}>
                    <Card className="card">
                        <h1 className="title-main">ตรวจสอบตั๋ว</h1>
                        <Divider />
                        <Form form={form} layout="vertical" onFinish={handleVerification}>
                            <Form.Item label="หมายเลขตั๋ว" name="pass_ticket" rules={[{ required: true, message: "กรุณากรอกหมายเลขตั๋ว!" }]}>
                                <Input placeholder="กรอกหมายเลขตั๋วที่นี่" className="ant-input" />
                            </Form.Item>
                            <Row justify="end">
                                <Space>
                                    <Button onClick={handleCancel} className="button-primary">ยกเลิก</Button>
                                    <Button type="primary" htmlType="submit" icon={<PlusOutlined /> } loading={loading} className="button-primary" >
                                        ตรวจสอบ
                                    </Button>
                                </Space>
                            </Row>
                        </Form>
                        <Divider />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <QRScanner onScan={handleQRScan} />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12}>
                    <Card className="card" style={{ position: "relative", paddingBottom: "60px" }}>
                        <h2 className="title-secondary">รายการตั๋ว</h2>
                        <Form onFinish={FindBusTimeTickets}>
                            <Form.Item name="findBusTimeTicket" rules={[{ required: true, message: "กรุณาเลือกวันและเวลาเดินทาง!" }]}>
                                <Select placeholder="เลือกวันและเวลาเดินทาง" onChange={handleRoundChange} style={{ borderColor: "#6E683B" }}>
                                    {busRounds.map((round) => (
                                        <Option key={round.id} value={`${round.departure_day}, ${round.departure_time}, ${round.id}`}>
                                            {round.departure_day} - {round.departure_time}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Row justify="end">
                                <Button type="primary" htmlType="submit" className="button-primary">ค้นหาตั๋ว</Button>
                            </Row>
                        </Form>
                        <Divider />
                        <Table columns={columns} dataSource={verifierValue} rowKey="passenger_id" scroll={{ y: 550 }} pagination={false} />
                        <Link to="/" onClick={handleLogout} style={{ position: "absolute", bottom: "20px", right: "20px" }}>
                            <Button className="button-primary">Log out</Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Verifier;
