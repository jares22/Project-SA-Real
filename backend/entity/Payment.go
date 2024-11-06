package entity

import (

	"time"

	"gorm.io/gorm"
)

type Payment struct {

	gorm.Model
	Departure  	string
	Destination	string
	Date 		string//time.Time
	Status 		string
	Total		float32 
	Image		string `gorm:"type:longtext"`
	TransactionDate	  time.Time
	BustimingID uint
	BusTiming BusTiming `gorm:"foreignKey:BustimingID"`

	Passenger []Passenger `gorm:"foreignKey:PaymentID"`
}