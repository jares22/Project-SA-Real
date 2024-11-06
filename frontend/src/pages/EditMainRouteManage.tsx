import {Button,Table,DatePicker,Form,Input,InputNumber,Mentions,Select,TreeSelect,Segmented, Card,Row, Col, message, Modal} from 'antd';
import { useState, useEffect } from "react";
import { BusInterface} from "../interfaces/Ibus";
import {RouteInterface} from "../interfaces/IRoute"
import {busTimingInterface} from "../interfaces/busTiming"
import {GetListVehicle, GetListRoute,} from "../services/https/http"
import { useNavigate, useParams, Link } from "react-router-dom";
import { GetBusTimingByID, UpdateBusTimingID} from "../services/https/http";
const { Option } = Select;

const daysOfWeek = [
    { value: 'จันทร์', label: 'จันทร์' },
    { value: 'อังคาร', label: 'อังคาร' },
    { value: 'พุธ', label: 'พุธ' },
    { value: 'พฤหัสบดี', label: 'พฤหัสบดี' },
    { value: 'ศุกร์', label: 'ศุกร์' },
    { value: 'เสาร์', label: 'เสาร์' },
    { value: 'อาทิตย์', label: 'อาทิตย์' },
];   /*ต้องมีทั้ง Value lable ถึงจะใช้ option เลือกได้*/
  
const hoursOfDay = [...Array(24)].map((_, index) => ({   //00 ถึง 23 นาฬิกา
  value: index.toString().padStart(2, '0'),
  label: index.toString().padStart(2, '0'),
}));

const minOfHours = [...Array(60)].map((_, index) => ({   //00 ถึง 23 นาฬิกา
  value: index.toString().padStart(2, '0'),
  label: index.toString().padStart(2, '0'),
}));



function EditMainRouteManage() {
  
  const [messageApi, contextHolder] = message.useMessage();
  const [mainRouteEdit, setMainRouteEdit] = useState<any[]>([]);
  const navigate = useNavigate();
  let { id } = useParams();
  console.log('bustiming_id = ', id);    //ปริ้น Bustimming ที่ส่งมา
  const [form] = Form.useForm();

  const [bus, setBus] = useState<BusInterface[]>([]);/* เอา bus ไปใช้ในDROP DOWN */
  const getListBus = async () => {
    let res = await GetListVehicle();
    console.log('ListBusPageEdit', res);
    if (res) {
      setBus(res);  //เอาไว้เซ็ตค่าเข้า ตาราง dropdown
    }
  };

  const [route, setRoute] = useState<RouteInterface[]>([]);
  const getListRoute = async () => {
    let res = await GetListRoute();
    console.log('ListRoutePageEdit', res);
    if (res) {
      setRoute(res);  //เอาไว้เซ็ตค่าเข้า ตาราง dropdown
    }
  };

  
  const [busTimingID, setBusTimingID] = useState<busTimingInterface[]>([]);  //ใช้ ทั้งแมพ ใช้ทั้งเซ้ต ฟิวเริ่มต้นแก้ไข
  const getBustimingByID = async () => {   //(7)
    let res = await GetBusTimingByID(Number(id)); //(8) โยน ID ไป
    console.log('GetBusTimingByID: ', res);
    if (res) {
      setBusTimingID(res); 
      const departureTime = res[0].departure_time.split(':');    /*แยก ชั่วโมง  นาที*/
      const returnTime = res[0].return_time.split(':');
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({    //เซ็ตค่าเข้า Form  (15)  และ Name ใน Form ต้องตรงกับส่ววนนี้
        bus_idf: `${res[0].license_plate}----${res[0].bus_id}`,  //ต้อง [0] เพรามีแค่ข้อมูลเดียว
        departure_dayf: res[0].departure_day,
        departure_hourf: departureTime[0],                             //ด้านซ้าย คือ Name ของแต่ล่ะ Form ด้านควาคือค่าที่จะเอามาใส่
        departure_minutef: departureTime[1],   
        return_dayf: res[0].return_day,
        return_hourf: returnTime[0],
        return_minutef: returnTime[1],   
        route_idf: `${res[0].route_id}---${res[0].name_route}****${res[0].routeway}`,
      });
    }
  };

  const clickAddUpdateBusTiming = async (values: busTimingInterface & RouteInterface & BusInterface) => {
    console.log('BeforSplit: ', values);
    const bus_id = values.bus_idf.split("----")[1];  // แยกเฉพาะค่าที่อยู่ก่อน "----"
    const route_id = values.route_idf.split("---")[0]; // แยกเฉพาะค่าที่อยู่ก่อน "---"
    const updatedValues = {
      ...values,
      bustiming_id: Number(id),    // แปลง id เป็น number โดยตรงที่นี่    //เพิ่ม ID ของ BusTiming                     
      bus_idf: Number(bus_id),
      route_idf: Number(route_id),    //เอาค่าใหม่ที่แยกไว้มาใส่
    };
    console.log("updatedValuesAndSplit>> ", updatedValues);
    let res = await UpdateBusTimingID(updatedValues);
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/admin");
      }, 1500);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }
  };

  useEffect(() => {
      getListBus();
      getListRoute();
      getBustimingByID();
  }, []);
  return (
  <div style={{ backgroundColor: '#F7B22C', height: '99vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  {contextHolder}
  <div style={{ position: 'relative', width: '1700px', height: '780px', backgroundColor: '#f8f0e0' }}>
        <div style={{ position: 'absolute', top: 0, width: '100%', height: '60px', backgroundColor: '#3c312b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0, fontFamily: 'Kanit, sans-serif', fontSize: '28px', letterSpacing: '2px' }}>แก้ไขรอบรถ</h2>
        </div>
  <Form    //layout="vertical" หมายถึง label จะอยู่ด้านบนของ input field แต่ละอัน
  form={form}    /* อย่าลืม */
  name="AdddManageRoute" layout="vertical" autoComplete="off" /*ปิดการเติมข้อมูลอัตโนมัติของเบราว์เซอร์*/
  onFinish={clickAddUpdateBusTiming}
  >
      <Row gutter={24}>
        <Col span={1}/>
          <Col span={22}>
              <Card style={{ height: "650px",marginTop: "90px", padding: "50px 0px 0px 150px", boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.3)'}}>
                  
                  <Form.Item label="BusID" name="bus_idf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{width: "500px"}}>
                    <Select allowClear /*คือปุ่มกากบาทล้างค่าที่เลือก*/ style={{height: "40px"}}>      
                      {bus.map(bus => (//.map(): เป็นเมธอดที่ใช้ในการวนซ้ำ (loop) ผ่านแต่ละวัตถุใน array และสร้าง array ใหม่ขึ้นมาจากผลลัพธ์ของการดำเนินการบนแต่ละวัตถุใน array ดั้งเดิม
                        <Option/*ค่าที่อยู่ใน option จะเป็นค่าที่ถูกส่งไป ถ้าอยู่ข้างนอกจะแค่แสดงออก*/ key={bus.bus_id}>{bus.license_plate}----{bus.bus_id}</Option> /*ต้องระบุ Key กับ Value เข้าไปด้วยถึงไม่ขึ้นแดง*/))}
                    </Select>
                  </Form.Item>

                  <div style={{ display: 'flex', gap: '30px' }}>
                      <Form.Item
                          label="วันเดินทางไป" name="departure_dayf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                          <Select  options={daysOfWeek} style={{height: "40px"}}/>
                      </Form.Item>
                      <Form.Item name="departure_hourf" label="นาฬิกา" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}>
                        <Select style={{width: "80px", height: "40px"}} options={hoursOfDay} />
                      </Form.Item>
                      <Form.Item name="departure_minutef" label="นาที" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} /* width ใน Form คือความกว้างของ Form ทั้งหมด*/>
                        <Select style={{width: "80px", height: "40px"}} options={minOfHours}/*width ในนี้คือความกว้่างของช่อง *//>
                      </Form.Item>
                  </div>

                  <div style={{ display: 'flex', gap: '30px' }}>
                      <Form.Item label="วันเดินทางกลับ" name="return_dayf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                          <Select options={daysOfWeek} style={{height: "40px"}}/>
                      </Form.Item>
                      <Form.Item name="return_hourf" label="นาฬิกา" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}>
                        <Select style={{width: "80px", height: "40px"}} options={hoursOfDay}/>
                      </Form.Item>
                      <Form.Item name="return_minutef" label="นาที" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} /* width ใน Form คือความกว้างของ Form ทั้งหมด*/>
                        <Select style={{width: "80px", height: "40px"}} options={minOfHours}/*width ในนี้คือความกว้่างของช่อง *//>
                      </Form.Item>
                  </div>

                  <Form.Item label="สายรถ" name="route_idf" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                    <Select allowClear style={{width: "1100px", height: "40px"}}>      
                        {route.map(route => (
                          <Option key={route.route_id}>{route.route_id}---{route.name_route}&nbsp;&nbsp;&nbsp;&nbsp;{route.routeway}</Option>))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item style={{marginLeft: "880px"}}>
                    <Link to="/admin">
                        <Button type="primary" htmlType="submit" style={{fontWeight: "bold", backgroundColor: "#3c312b", width: "100px",height: "38px", color: "white"}}>
                        Cancel
                        </Button>
                    </Link>
                    <Button type="primary" htmlType="submit"  style={{fontWeight: "bold", color: "#3c312b", backgroundColor: "#F7B22C", width: "100px",height: "38px", margin: "20px 20px 0px 20px"}}>
                      Update
                    </Button>
                  </Form.Item>

              </Card>
          </Col>
      </Row>
  </Form>
  </div>
  </div>
  );
}
export default EditMainRouteManage;