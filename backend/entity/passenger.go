package entity

import (

	"gorm.io/gorm"
)

type Passenger struct {
	gorm.Model
	Pass_ticket string 
	Name		string
	PhoneNumber	string
	Status		string
	Seat		int32

	MemberID 	uint
	Member 	Member `gorm:"foreignKey:MemberID"`

	PaymentID 	uint
	Payment 	Payment	`gorm:"foreignKey:PaymentID"`

	TicketVerification []TicketVerification `gorm:"foreignKey:PassengerID"`
	

}
