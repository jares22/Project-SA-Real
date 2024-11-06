import { FunctionComponent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import React, {useState, useEffect } from 'react';
import {GetNameUserByID} from "../services/https/http";
import "./SideBarUsers.css";

const handleLogout = () => {
  localStorage.removeItem('isLogin');
  localStorage.removeItem('userRole');
  localStorage.removeItem('RoleID');
  window.location.href = "/"; 
};

const SideBarUsers: FunctionComponent = () => {
  const [NameUserByIDValue, SetNameUserByID] = useState<{ FirstName: string, LastName: string } | null>(null);

  const getNameUserByID = async () => {
    const RoleID = localStorage.getItem('RoleID');
    console.log("SideBarUser-RoleID:", RoleID);
    
    let res = await GetNameUserByID(Number(RoleID));
    console.log('GetNameUserByID: ', res);
    if (res) {
      SetNameUserByID(res); 
    }
  };
  
  useEffect(() => {
    getNameUserByID();
  }, []); 

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sidebar Users</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        />
        <link rel="icon" href="../public/picSidebarUser/ohm.png" />
        <link rel="stylesheet" href="./SideBarUsers.css" />
      </head>
      <body>
        <div className="sidebarUser">
          <div className="picsirisakHandfrontUser">
            <img src="../public/picSidebarUser/sirisakHandfront.png" />
          </div>
          <span>
            {/* <img className="picUser" src="../public/picSidebarUser/palm.png" alt="User" /> */}
            <p className="txtUserNameUser">{NameUserByIDValue ? `${NameUserByIDValue.FirstName} ${NameUserByIDValue.LastName}` : 'Loading...'}</p>
          </span>
          <hr className="lineHrUser" />
          <p className="menuUserAdmin">Menu User</p>
          <Link to = "/user/UserChooseTicket">
            <div className="bttSideBarUser">
              <img src="../public/picSidebarUser/home.png" className="piciconUser" />
              <b>หน้าแรก</b>
            </div>
          </Link>
          <Link to="/user/ShowBustimingForUser">
            <div className="bttSideBarUser">
              <img src="../public/picSidebarUser/bus.png" className="piciconUser" />
              <b>ตารางเดินรถ</b>
            </div>
          </Link>
          <Link to="/user/CheckPaymentStatus_User">
            <div className="bttSideBarUser">
              <img src="../public/picSidebarUser/medical-report.png" className="piciconUser" />
              <b>สถานะการจอง</b>
            </div>
          </Link>
          <Link to = "/user/User_ticket">
          <div className="bttSideBarUser">
            <img src="../public/picSidebarUser/tickets.png" className="piciconUser" />
            <b>ตั๋วโดยสาร</b>
          </div>
          </Link>
          <Link to = "/" onClick={handleLogout}>
                <div className="bttSideBarLogoutUser">
                    <h3>Log out</h3>
                </div>
          </Link>
        </div>
        
      </body>
    </html>
  );
};

export default SideBarUsers;
