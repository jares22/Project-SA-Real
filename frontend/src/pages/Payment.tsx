import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Col, Row, Typography, message, Modal } from 'antd';
import SideBarUsers from '../components/SideBarUsers';
import { QRCode } from 'antd';
import generatePayload from 'promptpay-qr';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone, Accept } from 'react-dropzone';
import { CreatePassenger, CreatePayment, GetlastpaymentID } from '../services/https/http';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Payment: React.FC = () => {
  const [messageApi] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();
  const [saveDataObject, setDataObject] = useState<any>(null);
  const [phoneNumber] = useState<string>('0649678830');
  const [amount, setAmount] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  console.log("RoleID from localStorage:", localStorage.getItem('RoleID'));

  // ฟังก์ชันสร้างเลข 6 หลัก
  const generatePassTicket = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));

    const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString(); // สุ่มตัวเลข 4 หลัก
    return randomLetters + randomNumbers;
  };

  useEffect(() => {
    // Set background color for body
    document.body.style.backgroundColor = "#14919B";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // ดึงข้อมูลและคำนวณราคาชำระเงิน
  useEffect(() => {
    if (location.state) {
      setDataObject(location.state);
      console.log('setDataObject', location.state);

      const distance = location.state?.dataReceivedValue?.dataReceived?.distance;
      const numPassenger = location.state?.dataReceivedValue?.dataReceived?.num_passenger;
      if (distance && numPassenger) {
        const calculatedAmount = 1.5 * distance * numPassenger;
        setAmount(calculatedAmount);
        setQrCode(generatePayload(phoneNumber, { amount: calculatedAmount }));
        console.log(`Calculated Amount: ${calculatedAmount}`);
      }
    } else {
      console.log("No state received.");
    }
  }, [location.state, phoneNumber]);

  // จัดการการอัปโหลดรูปภาพ
  useEffect(() => {
    if (images.length < 1) return;

    const newImageUrls: string[] = [];
    const newBase64Images: string[] = [];

    images.forEach((image) => {
      const imageUrl = URL.createObjectURL(image);
      newImageUrls.push(imageUrl);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          newBase64Images.push(event.target.result);
        }
      };
      reader.readAsDataURL(image);
    });

    setImageURLs(newImageUrls);
    setBase64Images(newBase64Images);
  }, [images]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length === 0) {
      setImages(acceptedFiles.slice(0, 1));
    }
  }, [images]);

  const handleRemoveImage = () => {
    setImages([]);
    setImageURLs([]);
    setBase64Images([]);
  };

  const accept: Accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    noClick: images.length > 0,
    noKeyboard: images.length > 0,
  });

  const handleConfirmPayment = async () => {
    setIsModalVisible(true);
  };

  const handleModalConfirm = async () => {
    const payloadPayment = {
      province1: saveDataObject.dataReceivedValue.dataReceived.province1,
      province2: saveDataObject.dataReceivedValue.dataReceived.province2,
      datepickerfullTime: `${saveDataObject.dataReceivedValue.dataReceived.datepickerfull} ${saveDataObject.dataReceivedValue.dataReceived.departure_time}`,
      status: 'Process',
      TimeStamp: "",
      priceTotal: saveDataObject.dataReceivedValue.dataReceived.PriceTotal,
      Image: base64Images[0] || "",
      bustimingID: saveDataObject.dataReceivedValue.dataReceived.bustiming_id,
      TransactionDate: new Date(),
    };

    const roleId = Number(localStorage.getItem('RoleID'));
    let res = await CreatePayment(payloadPayment);
    let getlastpayment = await GetlastpaymentID();

    const payloadPassengers = saveDataObject.passengersWithSeats.map((passenger: { name: string; phone_number: string; SeatID: any; }) => ({
      name: passenger.name,
      phone: passenger.phone_number,
      seatid: passenger.SeatID,
      status: "ยังไม่ขึ้นรถ",
      paymentid: getlastpayment.max_payment_id,
      pass_ticket: generatePassTicket(),
      memberid: roleId,
    }));

    let sentpassenger = await CreatePassenger(payloadPassengers);
    if (res) {
      messageApi.open({
        type: "success",
        content: "ส่งการจองสำเร็จ",
      });
      setTimeout(() => {
        navigate("/user/CheckPaymentStatus_User");
      }, 500);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
  };

  return (
    <div style={{
      backgroundColor: '#14919B',
      height: '99vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <SideBarUsers />

      <Row gutter={24}>
        <div style={{
          width: "900px",
          height: "500px",
          backgroundColor: "white",
          marginLeft: "220px",
          borderRadius: "0 0 30px 30px",
        }}>
          <div style={{
            width: "100%",
            height: "70px",
            backgroundColor: "#213A57",
            color: "white",
            display: "flex",
            alignItems: "center",
            fontWeight: "500",
          }}>
            <h2 style={{ margin: 0 }}>&nbsp;&nbsp;&nbsp;ชำระค่าโดยสาร</h2>
          </div>

          <div style={{
            height: "40px",
            backgroundColor: "#AECCD1",
            width: "280px",
            marginLeft: "80px",
            marginTop: "50px",
            color: "White",
          }}>
            <h2>&nbsp;&nbsp;&nbsp;Prompt Pay</h2>
          </div>

          <Col span={8} style={{ marginTop: '0px', marginLeft: '80px' }}>
            {qrCode ? (
              <QRCode
                errorLevel="H"
                value={qrCode}
                icon="./public/icon/LogoBus.png"
                size={256}
              />
            ) : (
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>กำลังสร้าง QR Code...</p>
            )}
          </Col>

          <Col span={8}>
            <div {...getRootProps()} style={{
              marginTop: '-290px',
              width: 420,
              minHeight: 290,
              marginLeft: "420px",
              border: '2px dashed #C2C2C2',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDragActive ? '#f0f0f0' : 'white',
              flexDirection: 'column',
            }}>
              <input {...getInputProps()} />
              {images.length === 0 ? (
                isDragActive ? (
                  <p>ปล่อยไฟล์ที่นี่...</p>
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                )
              ) : (
                <p>รูปภาพถูกอัปโหลดแล้ว</p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {imageURLs.map((imageSrc, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={imageSrc}
                      alt={`Uploaded ${idx}`}
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                      }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleConfirmPayment}
              style={{
                marginTop: '20px',
                marginLeft: "680px",
                width: "160px",
                height: "50px",
                backgroundColor: '#0B6477',
                color: 'white',
                borderRadius: '10px',
                boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
              disabled={images.length === 0}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45DFB1';
                e.currentTarget.style.borderColor = '#45DFB1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00796b';
                e.currentTarget.style.borderColor = '#00796b';
              }}
            >
              <h4>ยืนยัน</h4>
            </Button>
          </Col>
        </div>

        <Col span={8}>
          <div style={{
            marginTop: "-21px",
            marginLeft: "90px",
            width: "450px",
            minHeight: "460px",
            backgroundColor: "White",
            borderRadius: "0 0 30px 30px",
          }}>
            <div style={{
              backgroundColor: "#213A57",
              width: "100%",
              height: "70px",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <h2 style={{ margin: 0 }}>รายละเอียดการเดินทาง</h2>
            </div>

            <Paragraph><br /><br />
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ชื่อผู้โดยสาร:</strong>
            </Paragraph>
            <ul>
              {saveDataObject?.passengersWithSeats?.map((passenger: any, index: number) => (
                <li key={index}>{passenger.name} - {passenger.phone_number}</li>
              ))}
            </ul>
            <Paragraph>
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;วันเวลาเดินทางไป:</strong> {saveDataObject?.dataReceivedValue?.dataReceived?.departure_day} {saveDataObject?.dataReceivedValue?.dataReceived?.departure_time}
            </Paragraph>
            <Paragraph>
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;วันเวลาเดินทางถึง:</strong> {saveDataObject?.dataReceivedValue?.dataReceived?.return_day} {saveDataObject?.dataReceivedValue?.dataReceived?.return_time}
            </Paragraph>
            <Paragraph>
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ต้นทาง:</strong> {saveDataObject?.dataReceivedValue?.dataReceived?.province1}
            </Paragraph>
            <Paragraph>
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ปลายทาง:</strong> {saveDataObject?.dataReceivedValue?.dataReceived?.province2}
            </Paragraph>
            <Paragraph>
              <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ที่นั่ง:</strong>
              {saveDataObject?.dataReceivedValue?.selectedSeats.length > 0
                ? saveDataObject?.dataReceivedValue?.selectedSeats.join(', ')
                : 'ไม่มีข้อมูล'}
            </Paragraph>

            <Title level={4}>
              <hr />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ราคารวม:
              {(saveDataObject?.dataReceivedValue?.dataReceived?.distance * 1.5 * saveDataObject?.dataReceivedValue?.dataReceived?.num_passenger).toFixed(2)} บาท
            </Title>
          </div>
        </Col>
      </Row>

      {/* Modal สำหรับการยืนยันการจองตั๋ว */}
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={4}>ยืนยันการจองตั๋ว</Title>
          <ExclamationCircleOutlined style={{ fontSize: '50px', color: '#faad14', margin: '20px 0' }} />
          <Paragraph>
            โปรดตรวจสอบข้อมูลของท่านให้ดี เมื่อกดยืนยันระบบจะไม่มีการคืนเงิน
            <br />
            ท่านสามารถตรวจสอบได้ในหน้าสถานะการจองเปิดดูตั๋วในเมนูตั๋วโดยสาร
          </Paragraph>
          <Button type="default" onClick={() => setIsModalVisible(false)} style={{ marginRight: '10px' }}>
            กลับ
          </Button>
          <Button type="primary" onClick={handleModalConfirm}>
            ยืนยัน
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
