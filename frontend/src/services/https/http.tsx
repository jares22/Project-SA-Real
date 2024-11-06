import axios from "axios";//นำเข้าไลบรารี axios ซึ่งใช้สำหรับการส่ง HTTP requests
import { LoginInInterface } from "../../interfaces/ILogin";
/**อรรถ */
import { busTimingInterface } from "../../interfaces/busTiming";
import { BusInterface } from "../../interfaces/Ibus";
import { RouteInterface } from "../../interfaces/IRoute";
import { AddtoBusTiming } from "../../interfaces/IAddtoBusTiming";
/***ดิวว */
import { VehiclestInterface } from "../../interfaces/ifVehicles";
import { EmployeesInterface } from "../../interfaces/ifEmployees";
import { DriverstInterface } from "../../interfaces/ifDrivers";
/***palm */
import { UsersInterface } from "../../interfaces/IUser";
import { SeatsInterface } from "../../interfaces/ISeat";
/***ohm */
import { TicketVerification, UpdateSeatStatusRequest,CreateTicketVerification } from "../../interfaces/ticketVerification";
import { BusRound } from "../../interfaces/busrounds";

/***JO */
import { PaymentInterface } from "../../interfaces/IfUser";


const apiUrl = "http://localhost:8000";
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

async function AddLogin(data: LoginInInterface) {
  return await axios   //ฟังก์ชันใช้คำสั่ง await เพื่อรอผลลัพธ์ (response) จากการทำ POST 
    .post(`${apiUrl}/login`, data, requestOptions)
    .then((res) => res)  //.then((res) => res): ถ้า request สำเร็จ (API ตอบกลับด้วย status code 2xx) ฟังก์ชันจะคืนค่า response (res) ของ API กลับไปให้ฟังก์ชันที่เรียกใช้งาน SignIn
    .catch((e) => e.response);  //ถ้า request ล้มเหลว (เช่น เกิดข้อผิดพลาด หรือ API ตอบกลับด้วย status code 4xx หรือ 5xx) ฟังก์ชันจะจับข้อผิดพลาดด้วย .catch() แ
}

async function AddRegister(data: any) {
  return await axios   //ฟังก์ชันใช้คำสั่ง await เพื่อรอผลลัพธ์ (response) จากการทำ POST 
    .post(`${apiUrl}/register`, data, requestOptions)
    .then((res) => res)  //.then((res) => res): ถ้า request สำเร็จ (API ตอบกลับด้วย status code 2xx) ฟังก์ชันจะคืนค่า response (res) ของ API กลับไปให้ฟังก์ชันที่เรียกใช้งาน SignIn
    .catch((e) => e.response);  //ถ้า request ล้มเหลว (เช่น เกิดข้อผิดพลาด หรือ API ตอบกลับด้วย status code 4xx หรือ 5xx) ฟังก์ชันจะจับข้อผิดพลาดด้วย .catch() แ
}

async function GetNameUserByID(id: Number | undefined) {   //(10)
  const requestOptions = {
    method: "GET"
  };
  let res = await fetch(`${apiUrl}/nameuserbyid/${id}`, requestOptions) //(11)
    
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

/**JO *******************************************************************/
async function GetPayment() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/payments`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function DeletePaymentByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE"
  };

  let res = await fetch(`${apiUrl}/payments/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

async function GetPaymentById(id: Number | undefined) {
  const requestOptions = {
    method: "GET"
  };

  let res = await fetch(`${apiUrl}/payments/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function CreatePayment(data: PaymentInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/payments`, requestOptions)
    .then((res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function UpdatePayment(data: any) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/payments`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetlastpaymentID() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/lastpaymentid`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
    .then((res) => {
      if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}
async function GetPaymentsWithPassengers(id: any): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // เรียก API ไปที่ endpoint ของ backend พร้อมกับส่ง id เป็น query parameter
    const res = await fetch(`${apiUrl}/paymentsjoin/${id}`, requestOptions); 

    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching data:", res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function GetPaymentsWithPassengers_Foradmin(): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // เรียก API ไปที่ endpoint ของ backend พร้อมกับส่ง id เป็น query parameter
    const res = await fetch(`${apiUrl}/paymentsjoin`, requestOptions); 

    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching data:", res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}



async function GetPaymentsWithStatusPass(id: any): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // เรียก API ไปที่ endpoint ของ backend พร้อมกับส่ง id เป็น query parameter
    const res = await fetch(`${apiUrl}/paymentspass/${id}`, requestOptions); 

    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching data:", res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}



/*JO*----------------------------------------------------------------------- */
/*ดิว*************************************************************************************/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function GetAllVehicles() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/ListVehicles`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
    .then((res) => {
      if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}



export async function GetAllEmployees() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/ListEmployees`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
    .then((res) => {
      console.log(res);
      if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}



export async function GetAllDrivers() {
  const requestOptions = {
    method: "GET",
    headers: {"Content-Type": "application/json", },
  };

  let res = await fetch(`${apiUrl}/ListDrivers`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
    .then((res) => {
      console.log(res);
      if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function CreateVehicles(data: VehiclestInterface) {
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
};

let rres = await fetch(`${apiUrl}/CreateVehicles`, requestOptions)
  .then((rres) => {
    console.log(rres);
    if (rres.status == 201) {
      return rres.json();
    } else {
      return false;
    }
  });

return rres;
}



async function CreateEmployees(data: EmployeesInterface) { /*เอาข้อมูลจากที่ intf ใส่ฟังก์ชั่น*/
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
};
console.log('ก่อนเข้า backend จริงๆ',requestOptions)

let res = await fetch(`${apiUrl}/CreateEmployees`, requestOptions)
  .then((res) => {
    if (res.status == 201) {
      return res.json();
    } else {
      return false;
    }
  });

return res;
}

async function CreateDrivers(data: DriverstInterface) {
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
};

let res = await fetch(`${apiUrl}/CreateDrivers`, requestOptions)
  .then((res) => {
    console.log(res);
    if (res.status == 201) {
      return res.json();
    } else {
      return false;
    }
  });

return res;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function GetListEmployees() {
const requestOptions = {
  method: "GET",
  headers: {"Content-Type": "application/json", },
};

let res = await fetch(`${apiUrl}/getlistemployees`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
  .then((res) => {
    console.log(res);
    if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
      return res.json();
    } else {
      return false;
    }
  });

return res;
}

async function GetListBuss() {
const requestOptions = {
  method: "GET",
  headers: {"Content-Type": "application/json", },
};

let res = await fetch(`${apiUrl}/getlistbus`, requestOptions) //ตอนBackend ส่งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
  .then((res) => {
    console.log(res.json);
    if (res.status == 200) {    //HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
      return res.json();
    } else {
      return false;
    }
  });

return res;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function DeleteVehicleByID(id: Number | undefined) {//(13)
const requestOptions = {
  method: "DELETE"
};

let res = await fetch(`${apiUrl}/deletevehicleby/${id}`, requestOptions)
  .then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

return res;
}


async function DeleteEmployeeByID(id: Number | undefined) {//(13)
const requestOptions = {
  method: "DELETE"
};

let res = await fetch(`${apiUrl}/deleteemployeeby/${id}`, requestOptions)
  .then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

return res;
}


async function DeleteDriverByID(id: Number | undefined) {//(13)
const requestOptions = {
  method: "DELETE"
};

let res = await fetch(`${apiUrl}/deletedriverby/${id}`, requestOptions)
  .then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

return res;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function GetEmployeeByID(id: Number | undefined) {   //(10)
  const requestOptions = {
    method: "GET"
  };
  let res = await fetch(`${apiUrl}/getEmployeeIDForEdit/${id}`, requestOptions) //(11)
    
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function UpdateEmployee(data: EmployeesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/UpdateEmployeeID`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function GetVehicleByID(id: Number | undefined) {   //(10)
  const requestOptions = {
    method: "GET"
  };
  let res = await fetch(`${apiUrl}/getVehicleIDForEdit/${id}`, requestOptions) //(11)
    
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function UpdateVehicle (data: VehiclestInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/UpdateVehicleID`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetDriverByID (id: Number | undefined) {   //(10)
  const requestOptions = {
    method: "GET"
  };
  let res = await fetch(`${apiUrl}/getDriverIDForEdit/${id}`, requestOptions) //(11)
    
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function UpdateDriver(data: DriverstInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/UpdateDriverID`, requestOptions)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" };
      }
    });

  return res;
}

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*ดิว------------------------------------------------------------------------------------- */

/*โอม*************************************************************************************/
// Verify Ticket Function
export async function VerifyTicket(data: TicketVerification) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/verify-ticket`, requestOptions).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// Get Verifiers Function
export async function GetVerifiers(bustiming_id?: string): Promise<TicketVerification[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const url = bustiming_id ? `${apiUrl}/verifiers?bustiming_id=${bustiming_id}` : `${apiUrl}/ticket`;
  const res = await fetch(url, requestOptions);
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error("Failed to fetch verifiers");
  }
}

// Update Seat Status Function
export async function UpdateSeatStatus(data: UpdateSeatStatusRequest): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/update-seat-status`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update seat status");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}

// Fetch Bus Rounds Function
export async function fetchBusRounds(): Promise<BusRound[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`${apiUrl}/bus-rounds`, requestOptions);
    if (response.ok) {
      const data: BusRound[] = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch bus rounds");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}

export async function TicketVerifycation(data: CreateTicketVerification) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/ticket-verify`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    throw error;
  }
}


/*โอม------------------------------------------------------------------------------------- */


/*palm*************************************************************************************/

async function CreatePassenger(data: UsersInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/passsenger`, requestOptions)
    .then((res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

export async function confirmSeatBooking(seatIds: number[]) {
  console.log(seatIds); // You can remove this later when you use seatIds in logic
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => resolve({ success: true }), 1);
  });
}




async function CheckSeatBooks(bustimingId: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/seatbooking?bustiming_id=${bustimingId}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

/*palm------------------------------------------------------------------------------------- */


/*อรรถ ********************************************************************************/
//แก้
async function GetListVehicle() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/listvehicleformanageroute`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
      .then((res) => {
        if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
}


async function GetListRoute() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/route`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function FormAddToBusTiming(data: AddtoBusTiming) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), /*  data บอกว่าคือ  USER*/
  };

  let res = await fetch(`${apiUrl}/bustiming`, requestOptions)   /* /users ตรงนี้บอกว่าคือการ POST ของ USER หาตั้งนาน */  
    .then((res) => {  /*ตรวจสอบผลลัพธ์ในบล็อกของ .then()*/    /* ใช้ await เพื่อรอการตอบกลับจากเซิร์ฟเวอร์และเก็บผลลัพธ์ไว้ในตัวแปร res */ 
      if (res.status == 201) {   /*รหัสสถานะ 201 หมายถึง "Created" ซึ่งบ่งบอกว่าข้อมูลใหม่ถูกสร้างสำเร็จ*/
        return res.json();/*หากสถานะเป็น 201 จะทำการแปลงการตอบกลับเป็น JSON และส่งกลับค่า */
      } else {
        return false;
      }
    });

  return res;  /*ส่งค่าผลลัพธ์สุดท้าย (ซึ่งจะเป็น JSON หรือ false) ออกจากฟังก์ชัน */
}


async function GetListRouteMainManage() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/listRouteMainManage`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function DeleteBusTimingByID(id: Number | undefined) {//(13)
  const requestOptions = {
    method: "DELETE"
  };

  let res = await fetch(`${apiUrl}/busTiming/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}



async function GetBusTimingByID(id: Number | undefined) {   //(10)
  const requestOptions = {
    method: "GET"
  };
  let res = await fetch(`${apiUrl}/bustimingMain/${id}`, requestOptions) //(11)
    
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function UpdateBusTimingID(data: BusInterface & busTimingInterface & RouteInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/updatebustimingid`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


/*ด้านล่าง User ***************************/
async function GetListDeparture() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/listdeparture`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}



async function GetListdestination() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/listdestination`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function userSearchTicket(formattedData: any) {
  const requestOptions = {
    method: "POST", // เปลี่ยนเป็น POST แทน GET
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData), // ส่งข้อมูลในรูปแบบ JSON
  };

  let res = await fetch(`${apiUrl}/usersearchticket`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetBustimingForUsers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/getbustimingforusers`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}



/*อรรถ -----------------------------------------------------------------------------------------------*/


export {
    AddLogin,
    AddRegister,
    GetNameUserByID,
  /**อรรถ */
    GetListVehicle,
    GetListRoute,
    FormAddToBusTiming,
    GetListRouteMainManage,
    DeleteBusTimingByID,
    GetBusTimingByID,
    UpdateBusTimingID, 
    GetListDeparture,
    GetListdestination,
    userSearchTicket,
    GetBustimingForUsers,

    /**ดิว */
    CreateEmployees, /* ส่วนสร้างข้อมูล */
    CreateVehicles, 
    CreateDrivers,
    GetListEmployees, /* ส่วน drop dawn */ 
    GetListBuss,
    GetGenders, /* ส่วน drop dawn เพศ */ 
    DeleteVehicleByID, /* ส่วนลบข้อมูล */ 
    DeleteEmployeeByID,
    DeleteDriverByID,
    
    GetEmployeeByID, /* ส่วนอัพเดตจะเป็นคู่ */
    UpdateEmployee,
    GetVehicleByID, 
    UpdateVehicle,
    GetDriverByID, 
    UpdateDriver,


    /**palm */
    
    CreatePassenger,
    CheckSeatBooks,


    /**JO */
    GetPayment,
    CreatePayment,
    DeletePaymentByID,
    GetPaymentById,
    UpdatePayment,
    GetlastpaymentID,
    GetPaymentsWithPassengers,
    GetPaymentsWithPassengers_Foradmin,
    GetPaymentsWithStatusPass,
};
  