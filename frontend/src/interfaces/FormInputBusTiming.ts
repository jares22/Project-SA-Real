export interface FormInputBusTimingInterface {
    departure_dayf?: string;
    return_dayf?: string;
    departure_hourf?: string;
    return_hourf?: string;
    departure_minutef?: string;
    return_minutef?: string;                  /*ตั้งชื่อตาม  ชื่อ Object ๋Json ที่ส่งมาจาก Form ตอนกดส่ง name ของฟอร์มจะกลายเป็นหัวข้อ JSON*/
    route_idf?: number;
    bus_idf?: number;
}