package entity

import "gorm.io/gorm"

type Employees struct {
	gorm.Model

	Username  string
	Password  string
	FirstName   string
	LastName    string
	PhoneNumber string
	Position    string
	Address     string

	Drivers []Drivers `gorm:"foreignKey:EmployeeID"`

	GenderID  uint
	Gender    Gender  `gorm:"foreignKey:GenderID"`
}
