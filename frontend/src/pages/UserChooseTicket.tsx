import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Select, Row, message } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SideBarUsers from '../components/SideBarUsers';
import { GetListDeparture, GetListdestination, userSearchTicket } from '../services/https/http';
import {Link, useNavigate} from 'react-router-dom';

const { Option } = Select;

const province_departure = ['กรุงเทพมหานคร', 'นครราชสีมา'];

function UserChooseTicket() {
  const [messageApi, contextHolder] = message.useMessage();
  const [dayOfWeek, setDayOfWeek] = useState<string>();
  const [saveSearchTicket, setSaveSearchTicket] = useState<any[]>([]);
  const [departureData, setListdeparture] = useState<any[]>([]);
  const [destinationData, setListdestination] = useState<any[]>([]);
  const [num_passengerValue, setNum_passenger] = useState</*string*/any>();

  const [departure, setDeparture] = useState<string | null>(null); // กำหนดชนิดให้เป็น string หรือ null
  const [destination, setDestination] = useState<string | null>(null);
  

  const calculateArrivalTime = (departureDay: string, departureTime: string, travelTime: number) => {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);

    // สร้างวันที่เริ่มต้นที่เวลาต้นทาง
    const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayIndex = dayNames.indexOf(departureDay);
    
    // ถ้าหากไม่พบวันใน array ให้คืนค่า error
    if (dayIndex === -1) throw new Error('Invalid departure day');
  
    // สร้างวันเริ่มต้น (ตอนนี้เป็นวันที่ 1 ของเดือนและตั้งเวลาเป็นเวลาเดินทาง)
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + ((dayIndex - departureDate.getDay() + 7) % 7));
    departureDate.setHours(depHours);
    departureDate.setMinutes(depMinutes);
  
    // เพิ่มเวลาเดินทาง (นาที)
    departureDate.setMinutes(departureDate.getMinutes() + travelTime);
  
    // เก็บค่าเวลาใหม่หลังจากคำนวณเสร็จแล้ว
    const arrivalHours = departureDate.getHours();
    const arrivalMinutes = departureDate.getMinutes();
  
    // แปลงวันเป็นชื่อวันภาษาไทย
    const arrivalDayIndex = departureDate.getDay();
    const arrivalDay = dayNames[arrivalDayIndex];
  
    // จัดรูปแบบเวลา
    const formattedArrivalTime = `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
  
    // คำนวณว่าเวลาไปถึงน้อยกว่าหรือเท่ากับเวลาที่ออก
    const originalDepartureMinutes = depHours * 60 + depMinutes;
    const arrivalMinutesTotal = arrivalHours * 60 + arrivalMinutes;
    const isNextDay = arrivalMinutesTotal < originalDepartureMinutes;
    
    // วันถัดไปถ้าการเดินทางผ่านคืน
    const CalculateDay = isNextDay ? dayNames[(dayIndex + 1) % 7] : arrivalDay;
  
    // เก็บค่าลงในตัวแปร
    const CalculateTime = formattedArrivalTime;
  
    // Return ค่าแยกกันได้ทั้งเวลาและวัน
    return { CalculateTime, CalculateDay };
};


// Function to format travel time into hours and minutes
const formatTravelTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours} ชม. ${minutes} น.`;
};




  const handleDepartureChange = (value: string | null) => {
    setDeparture(value); // อัพเดตค่าต้นทาง
    if (value === destination) {
      message.error('ต้นทางและปลายทางต้องไม่ซ้ำกัน');
      setDestination(null); // รีเซ็ตค่าปลายทางหากเลือกซ้ำกับต้นทาง
      //เพิ่มถ้าเลือกต้นทาง  ก็จะคิวลี่ข้อมูลเฉาพาะ   ต้นทาง   --   ปลายทางที่มี
    }
  };

  const handleDestinationChange = (value: string | null) => {
    setDestination(value); // อัพเดตค่าปลายทาง
    if (value === departure) {
      message.error('ต้นทางและปลายทางต้องไม่ซ้ำกัน');
      setDestination(null); // รีเซ็ตค่าปลายทางหากเลือกซ้ำกับต้นทาง
      //เพิ่ม ถ้าเลือกปลายทาง ก็จะคิวลี่  เฉพาะปลายทางที่มี 
    }
  };

  const dayOfWeekMap: { [key: string]: string } = {
    Sunday: 'อาทิตย์',
    Monday: 'จันทร์',
    Tuesday: 'อังคาร',
    Wednesday: 'พุธ',
    Thursday: 'พฤหัสบดี',
    Friday: 'ศุกร์',
    Saturday: 'เสาร์',
  };


  const [DateFullFormat, setSelectedDateFull] = useState<string>('');
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      const dayOfWeek = date.format('dddd');
      const dayOfWeekThai = dayOfWeekMap[dayOfWeek] || dayOfWeek;
      console.log('dayOfWeekThai', dayOfWeekThai);
      setDayOfWeek(dayOfWeekThai);
      setSelectedDateFull(date.format('DD-MM-YYYY'));
    }
  };

  
  const navigate = useNavigate();
  //const [formattedDataValue, setFormattedData] = useState<any>(null);
  const ClickBuyTicket = (ticket: any) => {
    // เรียกฟังก์ชัน calculateArrivalTime เพื่อคำนวณ CalculateDay และ CalculateTime
    const arrivalDetails = calculateArrivalTime(ticket.departure_day, ticket.departure_time, ticket.time);
  
    // Create an object with both num_passengerValue and ticket information
    const formattedData = {
      ...ticket, // Spread ticket information
      num_passenger: num_passengerValue, // Add num_passengerValue
      datepickerfull: DateFullFormat,
      
      ArrivalDay: arrivalDetails.CalculateDay, // รวม CalculateDay
      ArrivalTime: arrivalDetails.CalculateTime, // รวม CalculateTime

      PriceTotal: ticket.distance * 1.5 * num_passengerValue,
    };
  
    // Log or use the combined data
    console.log('Click Buy Ticket:', formattedData);
    //setFormattedData(formattedData);
  
    // ใช้ navigate เพื่อส่งข้อมูล
    navigate('/user/SeatSelection', { state: formattedData });  //ส่งผ่านตัวแปรปกติ
  };
  


  const clickToSearchTicket = async (values: any) => {
    console.log('OriginalSearchTicket: ', values);
    setNum_passenger(values.num_passengers);
    const formattedData = {
      departure_day: dayOfWeek,
      province1: values.departure,
      province2: values.destination,
      num_passenger: values.num_passengers,
      datePicker: DateFullFormat
    };

    console.log('Formatted Data SearchTicket: ', formattedData);

    try {
      const res = await userSearchTicket(formattedData);
      if (res.data) {
        setSaveSearchTicket(res.data); //เอาข้อมูลย่อยที่อยู่ข้างใน data อีกรอบ
        console.log('Ticket From Database: ', res.data);
        messageApi.open({
          type: 'success',
          content: 'ค้นพบเส้นทางเดินรถ',
        });
      } else {
        setSaveSearchTicket([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่มีเส้นทางเดินรถนี้กรุณาเลือกจังหวัดใหม่!',
        });
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล !',
      });
    }
  };


  const getListDeparture = async () => {
    try {
      const DepartureJson = await GetListDeparture();
      console.log('ListProvince_departure', DepartureJson);
      if (Array.isArray(DepartureJson)) {
        setListdeparture(DepartureJson);
      }
    } catch (error) {
      console.error('Error fetching departure:', error);
    }
  };

  const getListdestination = async () => {
    try {
      const DestinationJson = await GetListdestination();
      console.log('ListProvince_destination', DestinationJson);
      if (Array.isArray(DestinationJson)) {
        setListdestination(DestinationJson);
      }
    } catch (error) {
      console.error('Error fetching destination:', error);
    }
  };



  useEffect(() => {
    getListDeparture();
    getListdestination();
  }, []);
  
  return (
    <div style={{ backgroundColor: '#14919B', height: '99vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      {contextHolder}
      <SideBarUsers />
      <div style={{ position: 'relative', width: '1700px', height: '900px', backgroundColor: '#D9D9D9' }}>
        <div style={{ position: 'absolute', top: 0, width: '100%', height: '60px', backgroundColor: '#213A57', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0, fontFamily: 'Kanit, sans-serif', fontSize: '28px', letterSpacing: '2px' }}>จองตั๋วโดยสาร</h2>
        </div>
        <div style={{ paddingTop: '60px' }}>
          <Form name="AdddManageRoute" layout="vertical" autoComplete="off" onFinish={clickToSearchTicket}>
            <Card style={{ width: '1620px', height: '220px', marginTop: '10px', marginLeft: '40px' }} title={<span style={{ fontSize: '20px', fontFamily: 'Kanit, sans-serif' }}>เลือกเส้นทาง</span>}>
              <div style={{ maxHeight: '200px' }}>
                <Row gutter={24}>
                  
                  <Col span={6}>
                    <Form.Item label="ต้นทาง" name="departure" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{ width: '250px' }}>
                      <Select showSearch allowClear placeholder="Select a province1" optionFilterProp="children" onChange={handleDepartureChange}  filterOption={(input, option) => typeof option?.children === 'string' && option.children.includes(input)}>
                         {departureData
                        .filter((departure) => departure.province1 !== destination) // กรองต้นทางไม่ให้ซ้ำกับปลายทาง
                        .map((departure) => (
                          <Option key={departure.province1} value={departure.province1}>
                            {departure.province1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col span={6}>
                    <Form.Item label="ปลายทาง" name="destination" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{ width: '250px' }}>
                      <Select showSearch allowClear placeholder="Select a province2" optionFilterProp="children" onChange={handleDestinationChange} filterOption={(input, option) => typeof option?.children === 'string' && option.children.includes(input)}>
                        {destinationData
                        .filter((destination) => destination.province2 !== departure) // กรองปลายทางไม่ให้ซ้ำกับต้นทาง
                        .map((destination) => (
                          <Option key={destination.province2} value={destination.province2}>
                            {destination.province2}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item initialValue={1} label="จำนวนผู้โดยสาร" name="num_passengers" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{ width: '250px' }}>
                      <InputNumber min={1} max={3} defaultValue={1}  />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                  <Form.Item label="วันเดินทาง" name="user_departure" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{ width: '320px' }}>
                    <DatePicker name='DatePicker' style={{ width: '100%' }} onChange={handleDateChange} 
                      disabledDate={(current) => { 
                      const today = moment().startOf('day'); 
                      const maxDay = moment().add(62, 'days').endOf('day');
                        return current && (current < today || current > maxDay);
                      }}
                    />
                  </Form.Item>
                  </Col>

                </Row>

                <Row gutter={24} style={{ marginTop: '0px', display: 'flex', justifyContent: 'center' }}>
                  <Col>
                    <Button type="primary" htmlType="submit" shape="default" style={{ backgroundColor: '#14919B', width: '200px', height: '35px' }}>
                      <p style={{ fontFamily: 'Kanit, sans-serif', letterSpacing: '1px', margin: 0 }}>ค้นหาเส้นทาง</p>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Form>

          <Card style={{  width: '1620px', height: '580px', marginTop: '18px',marginBottom: '18px', marginLeft: '40px', overflowY: 'auto' }}  title={<span style={{ fontSize: '20px', fontFamily: 'Kanit, sans-serif' }}>เลือกตั๋วโดยสาร</span>}>
            
            <Row gutter={24}>
              {saveSearchTicket.map((ticket) => (
                <Col span={8} key={ticket.bustiming_id}> 
                  
                  <div style={{marginBottom: '10px', height: '200px',width: '480px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.4)', padding: '16px', display: 'flex', flexDirection: 'column',justifyContent: 'space-between',fontFamily: 'Kanit, sans-serif',fontSize: '16px',position: 'relative',boxSizing: 'border-box' }}>
                    <table border={0} style={{ width: '100%', tableLayout: 'fixed' }}>
                      
                      {/*แถว1*/ }
                      <tr style={{  textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: "15px", marginBottom: '8px' }}>
                        <td style={{ width: '50px', verticalAlign: "middle"}}>
                          <img src="../../public/icon/startpoint.png" alt="startpoint icon" style={{ width: '100%', height: 'auto', display: 'block' }}/>
                        </td>
                        <td style={{ width: '130px', verticalAlign: "middle"}}>
                          {ticket.province1}
                        </td>
                        <td style={{ width: '80px'}}>
                          {ticket.departure_day}
                        </td>
                        <td style={{ width: '60px', verticalAlign: "middle"}}>
                          {ticket.departure_time} น.
                        </td>
                        <td style={{ width: '25px',verticalAlign: "middle", padding: '5px 0px 0px 5px' }}>
                          <img src="../../public/icon/clock.png" alt="clock icon" style={{ width: '25px', height: '25px' }} />
                        </td>
                        <td style={{ width: '90px', verticalAlign: "middle"}}>
                          {formatTravelTime(ticket.time)}
                        </td>
                      </tr>


                      {/*แถว2*/}
                      <tr style={{  height: '60px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: "22px", marginBottom: '8px' }}>
                        <td style={{ width: '50px', verticalAlign: "middle"}}>
                          <img src="../../public/icon/arrow.png" alt="startpoint icon" style={{ width: '100%', height: 'auto', display: 'block' }}/>
                        </td>
                        <td colSpan={2} style={{ width: '600px', color: '#14919B', padding: '0px 0px 0px 30px' }}>
                          Type: {ticket.vehicle_type}
                        </td>
                        <td colSpan={3} style={{ width: '100px', color: '#FF4D4F', fontWeight: 'bold', textAlign: 'center' ,letterSpacing: '1px'}}>
                          ราคา: {ticket.distance * 1.5 * num_passengerValue} บาท
                        </td>
                      </tr>

                      {/* แถวที่ 3 */}
                      <tr style={{  textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: "15px"}}>
                        <td style={{ width: '50px', verticalAlign: "middle"}}>
                          <img src="../../public/icon/endpoint.png" alt="startpoint icon" style={{ width: '100%', height: 'auto', display: 'block' }}/>
                        </td>
                        <td style={{ width: '130px', verticalAlign: "middle"}}>
                          {ticket.province2}
                        </td>
                        <td style={{ width: '80px'}}>
                          {calculateArrivalTime(ticket.departure_day, ticket.departure_time, ticket.time).CalculateDay}
                        </td>
                        <td style={{ width: '60px', verticalAlign: "middle"}}>
                          {calculateArrivalTime(ticket.departure_day, ticket.departure_time, ticket.time).CalculateTime} น.
                        </td>
                        <td colSpan={2} style={{ verticalAlign: "middle", padding: '0px 0px 0px 25px' }}>
                          <button onClick={() => ClickBuyTicket(ticket)} style={{ backgroundColor: '#14919B', color: 'white', border: 'none', borderRadius: '5px',width: '80px',height: '35px',cursor: 'pointer',fontFamily: 'Kanit, sans-serif',letterSpacing: '1px',justifySelf: 'center'}}>
                            Buy
                          </button>
                        </td>
                      </tr>
                      
                    </table>
                  </div>
                </Col>
              ))}
            </Row>
            
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserChooseTicket;