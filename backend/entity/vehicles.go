package entity

import "gorm.io/gorm"

type Vehicles struct {
	gorm.Model

	Type            string
	BusRegistration string
	Brand           string
	Series          string
	Year            int32
	EngineAndPower  string
	FuelTank        int32
	Seat           	int32

	Drivers []Drivers `gorm:"foreignKey:BusID"`
	BusTiming []BusTiming `gorm:"foreignKey:BusID"`
}
