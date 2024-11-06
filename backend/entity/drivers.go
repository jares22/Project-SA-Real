package entity

import "gorm.io/gorm"

type Drivers struct {
	gorm.Model

	EmployeeID uint
	Employees  Employees `gorm:"foreignKey:EmployeeID"`

	BusID   uint
	Vehicle Vehicles `gorm:"foreignKey:BusID"`
}
