package entity

import "gorm.io/gorm"

type Gender struct {
	gorm.Model
	Name string

	Employees []Employees `gorm:"foreignKey:GenderID"`
}
