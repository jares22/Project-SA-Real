export interface busTimingInterface {
  bus_idf: any;
  route_idf: any;
  bustiming_id?: number; // ใช้เป็น primary key ของตาราง
  departure_day?: string;    //อิงชื่อตาม ชื่อ Object ที่ส่งมา มันจะได้ Match กัน
  return_day?: string;
  departure_time?: string;
  return_time?: string;
  route_id?: number;
  bus_id?: number;
}