package entity

import (
	"gorm.io/gorm"
)

type RouteData struct {
	gorm.Model
	Province1 	string
	Province2 	string
	Distance  	int
	Time		int
}