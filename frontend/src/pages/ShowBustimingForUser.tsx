import {Button,Table, Card,Row, Col, message, Modal} from 'antd';
import {RouteInterface} from "../interfaces/IRoute"
import {BusInterface} from "../interfaces/Ibus"
import {busTimingInterface} from "../interfaces/busTiming"
import {GetBustimingForUsers } from "../services/https/http";
import  { useState, useEffect } from 'react';
import type { TableColumnsType } from 'antd';
import SideBarUsers from '../components/SideBarUsers';

function ShowBustimingForUser() {
    const [BustimingForUsersValue, setBustimingForUsers] = useState<RouteInterface & BusInterface & busTimingInterface[]>([]);

    const columns: TableColumnsType = [
        // { title: 'ทะเบียนรถ', dataIndex: 'license_plate', key: 'LicensePlate', render: (text) => (<span style={{ fontSize: '18px' }}> {text}</span>)},
        { title: 'สายเดินรถ', dataIndex: 'name_route', key: 'Name', render: (text) => (<span style={{ fontSize: '18px' }}> {text}</span>)},
        { title: 'วันไป', dataIndex: 'departure_day', key: 'DepartureDay', render: (text) => (<span style={{ fontSize: '18px' }}> {text}</span>)},
        { title: 'เวลาไป', dataIndex: 'departure_time', key: 'DepartureTime', render: (text) => (<span style={{ fontSize: '18px' }}> {text}</span>)},
    ];
    
    const getBustimingForUser = async () => {
        let res = await GetBustimingForUsers();
        console.log('getBustimingForUser' ,res);
        setBustimingForUsers(res); 
      };

    useEffect(() => {
        getBustimingForUser();
    }, []);

  return (
    <div style={{ backgroundColor: '#14919B', height: '99vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <SideBarUsers />
      <Card title={<span style={{ fontSize: "24px", marginLeft: "660px" }}>ตารางเดินรถ</span>}
            style={{ marginTop: "50px", marginLeft: "120px", width: "1555px", height: "800px" }}
        >
        <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 , fontSize: '18px'}}>
                    ลำดับการเดินรถ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.routeway} {/* แสดงข้อมูล Routeway เมื่อแถวถูกขยาย */}
                  </p>
                ),
                rowExpandable: (record) => record.Name !== 'Not Expandable', // กำหนดแถวที่ไม่สามารถขยายได้
              }}
              dataSource={BustimingForUsersValue}
              rowKey="bustiming_id" // กำหนดคีย์ของแต่ละแถวให้เป็น BusTimingID และต้องมีใน rowKey ด้วย
              scroll={{ y: 640 }}
              pagination={false}
              
            />
        </Card>
    </div>
  );
}

export default ShowBustimingForUser;