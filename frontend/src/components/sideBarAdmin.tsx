import { FunctionComponent} from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./sideBarAdmin.css";

const handleLogout = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userRole');
    // หากต้องการลบค่าที่เกี่ยวข้องอื่น ๆ ก็สามารถเพิ่มได้ที่นี่
    window.location.href = "/"; // เปลี่ยนเส้นทางไปยังหน้า Login หรือหน้าที่ต้องการ
  };

const sideBarAdmin: FunctionComponent = () => {
   
return (
<>
<html></html>
<div className="sidebar">
  <div className="picsirisakHandfront">
      <img src="../public/icon/sirisakHandfront.png"/>
  </div>
  <p className="Menu-Admin">Menu Admin</p>
  <Link to="/admin/Vehicles">
  <div className="bttSideBar">
      <img src="../public/icon/bus.png" className="picicon"/>
      <b>ระบบจัดการข้อมูลรถ</b>
  </div>
  </Link>
  <Link to="/admin/EmployeesAndDrivers">
  <div className="bttSideBar">
      <img src="../public/icon/driver.png" className="picicon"/>
      <b>ระบบจัดการข้อมูลคนขับ</b>
  </div>
  </Link>
  <Link to="/admin/MainRouteManage">
  <div className="bttSideBar">
      <img src="../public/icon/way.png" className="picicon"/>
      <b>ระบบจัดการเส้นทางเดินรถ</b>
  </div>
  </Link>
  <Link to="/admin/check_slipt">
  <div className="bttSideBar">
      <img src="../public/icon/digital-wallet.png" className="picicon"/>
      <b>ยืนยันการชำระเงิน</b>
  </div>
  </Link>
  <Link to = "/" onClick={handleLogout}>
  <div className="bttSideBarLogout">
      <h3>Log out</h3>
  </div>
  </Link>
</div>
</>
    );
  };
  
  export default sideBarAdmin;
  