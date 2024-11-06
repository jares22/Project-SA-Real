import { ReactNode } from "react";

export interface PaymentInterface {
  date: ReactNode;
  phone_number: any;
  passenger_name: ReactNode;
  seat: ReactNode;
  payment_id?: number;                     // รหัสการชำระเงิน
   departure?: string;               // ต้นทาง
   destination?: string;             // ปลายทาง
   Date?: string;                    // วันที่เดินทาง
   Status?: string;                  // สถานะการชำระเงิน เช่น Pending, Completed
   TransactionDate?: Date
   total?: number;                   // จำนวนเงินทั้งหมด
   image?: string;                   // ข้อมูลภาพสลิปการชำระเงิน ใช้ string สำหรับ base64 หรือ URL ของภาพ
   BustimingID?: number;             // รหัสเวลาเดินรถที่เชื่อมโยง
 }
 