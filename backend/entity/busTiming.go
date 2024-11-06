package entity

import (
	"gorm.io/gorm"
)

type BusTiming struct {
	gorm.Model
	DepartureDay  string
	DepartureTime string
	ReturnDay     string
	ReturnTime    string

	BusID   uint
	Vehicles  Vehicles `gorm:"foreignKey:BusID"`

	RouteID uint
	Route   Route `gorm:"foreignKey:RouteID"`

	Payment []Payment `gorm:"foreignKey:BustimingID"`
}

/* 
SELECT p.Seat
FROM passengers p
JOIN payments pay ON p.payment_id = pay.ID
WHERE pay.bustiming_id = 1
AND (pay.Status = 'Pass' OR pay.Status = 'ตรวจสอบแล้ว');
*/