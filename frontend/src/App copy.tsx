import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
}from "react-router-dom";
import Login from "./pages/Login";
{/*อรรถ */}
import MainRouteManage from "./pages/MainRouteManage";
import AddRouteManage from "./pages/AddRouteManage"
import MainRouteEdit from "./pages/EditMainRouteManage"
import UserChooseTicket from "./pages/UserChooseTicket"

{/***ดิวว */}
import Vehicles from "./pages/vehicles";
import EmployeesAndDrivers from "./pages/employeesAnddrivers";
import AddDataV from "./pages/addVehicles";
import AddDataE from "./pages/addEmployees";
import AddDataD from "./pages/addDrivers";

import EditDataV from "./pages/editVehicles";
import EditDataE from "./pages/editEmployees";
import EditDataD from "./pages/editDrivers";

{/*ปาม*/}
import SeatSelection from './pages/SeatSelection';
import PassengerCreate from './pages/passenger';
{/*โอม*/}
import Verifier from "./pages/Verifier";/**/
{/**Jo */}
import Payment from "./pages/Payment";
import Check_slipt from "./pages/check_slipt"; // นำเข้า Component ของหน้า CheckSlip
import CheckPaymentStatus_User from "./pages/CheckPaymentStatus_User"; 


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/*อรรถ*/}
      <Route path="/UserChooseTicket" element={<UserChooseTicket />} />
      <Route path="/MainRouteManage" element={<MainRouteManage />} />
      <Route path="/AddRouteManage" element={<AddRouteManage />} />
      <Route path="/MainRouteEdit/:id" element={< MainRouteEdit/>} />
       
       {/*ของ ดิว*/}
      <Route path="/Vehicles" element={<Vehicles />} />
      <Route path="/EmployeesAndDrivers" element={<EmployeesAndDrivers />} />
      <Route path="/AddDataV" element={<AddDataV />} />
      <Route path="/AddDataE" element={<AddDataE />} />
      <Route path="/AddDataD" element={<AddDataD />} />

      <Route path="/EditDataV" element={<EditDataV />} />
      <Route path="/EditDataE" element={<EditDataE />} />
      <Route path="/EditDataD" element={<EditDataD />} />
      
    
      
      {/*ของ palm*/}
      <Route path="/seatselection" element={<SeatSelection />} />
      <Route path="/passenger" element={<PassengerCreate />} />
      {/*ของ โอม*/}
      <Route path="/Verifier" element={<Verifier />} />
      {/**JO */}
      <Route path="/Payment" element={<Payment />} />
      <Route path="/check_slipt" element={<Check_slipt />} /> {/* เพิ่มเส้นทางไปที่หน้า check_slipt */}
      <Route path="/CheckPaymentStatus_User" element={<CheckPaymentStatus_User />} /> {/* เพิ่มเส้นทางไปที่หน้า check_slipt */}
    </Routes>
  );
}
export default App;



