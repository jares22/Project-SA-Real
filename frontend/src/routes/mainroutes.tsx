import { lazy } from "react";
import { useRoutes, RouteObject} from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";

const Login = Loadable(lazy(() => import("../pages/Login")));
const Register = Loadable(lazy(() => import("../pages/register")));

const MainRouteManage = Loadable(lazy(() => import("../pages/MainRouteManage")));
const AddRouteManage = Loadable(lazy(() => import("../pages/AddRouteManage")));
const MainRouteEdit = Loadable(lazy(() => import("../pages/EditMainRouteManage")));
const UserChooseTicket = Loadable(lazy(() => import("../pages/UserChooseTicket")));
const ShowBustimingForUser = Loadable(lazy(() => import("../pages/ShowBustimingForUser")));

const Vehicles = Loadable(lazy(() => import("../pages/vehicles")));
const EmployeesAndDrivers = Loadable(lazy(() => import("../pages/employeesAnddrivers")));
const AddDataV = Loadable(lazy(() => import("../pages/addVehicles")));
const AddDataE = Loadable(lazy(() => import("../pages/addEmployees")));
const AddDataD = Loadable(lazy(() => import("../pages/addDrivers")));
const EditDataE = Loadable(lazy(() => import("../pages/editEmployees")));
const EditDataV = Loadable(lazy(() => import("../pages/editVehicles")));
const EditDataD = Loadable(lazy(() => import("../pages/editDrivers")));

const SeatSelection = Loadable(lazy(() => import('../pages/SeatSelection')));
const PassengerCreate = Loadable(lazy(() => import('../pages/passenger')));
const Verifier = Loadable(lazy(() => import("../pages/Verifier")));
const Payment = Loadable(lazy(() => import("../pages/Payment")));
const CheckPaymentStatus_User = Loadable(lazy(() => import("../pages/CheckPaymentStatus_User")));
const Check_slipt = Loadable(lazy(() => import("../pages/check_slipt")));
const User_ticket = Loadable(lazy(() => import("../pages/User_ticket")));

const AdminRoutes = (): RouteObject[] => [
  {
    path: "/", element: <MainRouteManage />,  //  มี / จะล้าง path ก่อนหน้าแล้วเขียนใหม่   ถ้าไม่มี / จะเขียนต่อ  
  },                                          //  ใช้ / เพราะเข้าตอนแรก จะไปหน้าแรกของ แต่ล่ะ Role นั้นให้เลย ไม่ต้อง login ซ้ำ
  {
    path: "/admin",
    children: [
      { index: true, element: <MainRouteManage /> },
      { path: "AddRouteManage", element: <AddRouteManage /> },
      { path: "MainRouteEdit/:id", element: <MainRouteEdit /> },
      { path: "Vehicles", element: <Vehicles /> },
      { path: "EmployeesAndDrivers", element: <EmployeesAndDrivers /> },
      { path: "AddDataV", element: <AddDataV /> },
      { path: "AddDataE", element: <AddDataE /> },
      { path: "AddDataD", element: <AddDataD /> },
      
      { path: "EditDataE/:EmployeeID", element: <EditDataE /> },
      { path: "EditDataV/:VehicleID", element: <EditDataV /> },
      { path: "EditDataD/:DriverID", element: <EditDataD /> },
      
      { path: "Check_slipt", element: <Check_slipt /> },
      { path: "*", element: <MainRouteManage /> },
    ],
  },
];

const DriverRoutes = (): RouteObject[] => [
  {
    path: "/", element: <Verifier />,
  },
  {
    path: "/driver",
    children: [
      { index: true, element: <Verifier /> },
      { path: "*", element: <Verifier /> },
    ],
  },
];

const UserRoutes = (): RouteObject[] => [
  {
    path: "/", element: <UserChooseTicket />,
  },
  {
    path: "/user",
    children: [
      { index: true, element: <UserChooseTicket /> },
      { path: "ShowBustimingForUser", element: <ShowBustimingForUser /> },
      { path: "SeatSelection", element: <SeatSelection /> },
      { path: "PassengerCreate", element: <PassengerCreate /> },
      { path: "Payment", element: <Payment /> },
      { path: "CheckPaymentStatus_User", element: <CheckPaymentStatus_User /> },
      { path: "User_ticket", element: <User_ticket /> },
      { path: "*", element: <UserChooseTicket /> },
    ],
  },
];

const MainRoutes = (): RouteObject[] => [
  {
    path: "/",
    children: [
      { index: true, element: <Login /> },
      {path: "/register", element: <Register/>},
      { path: "*", element: <Login /> },
    ],
  },
];


function ConfigRoutes() {
  const isLoggedIn = localStorage.getItem('isLogin') === 'true';
  const userRole = localStorage.getItem('userRole');
  const RoleID = localStorage.getItem('RoleID');
  console.log("isLoggedIn:", isLoggedIn);
  console.log("userRole:", userRole);
  console.log("RoleID:", RoleID);

  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    switch (userRole) {
      case 'admin':
        routes = AdminRoutes();
        break;
      case 'driver':
        routes = DriverRoutes();
        break;
      case 'user':
        routes = UserRoutes();
        break;
      default:
        routes = MainRoutes();
        break;
    }
  } else {
    routes = MainRoutes();
  }
  return useRoutes(routes);
}
export default ConfigRoutes;
