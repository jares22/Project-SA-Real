package entity

import (
	"gorm.io/gorm"
)

type Route struct {
	gorm.Model
	NameRoute	string
	Routeway 	string    

	BusTiming []BusTiming `gorm:"foreignKey:RouteID"`
}