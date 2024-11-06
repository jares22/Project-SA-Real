package entity

import (

	"time"

	"gorm.io/gorm"
)

type TicketVerification struct {

	gorm.Model
	Verification_Time  	time.Time
	Status				string

	DriversID uint
	Drivers Drivers `gorm:"foreignKey:DriversID"`

	PassengerID uint
	Passenger Passenger `gorm:"foreignKey:PassengerID"`


}