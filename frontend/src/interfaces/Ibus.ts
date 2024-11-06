export interface BusInterface {
    bus_id?: number;
    license_plate?: string;   //อิงชื่อตาม ชื่อ Object ที่ส่งมา มันจะได้ Match กัน
    Type?: string;
	Brand?: string;
	Seat?: string;
}