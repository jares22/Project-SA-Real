package controller

import (
	"net/http"

	"SirisakTour/config"
	"SirisakTour/entity"

	"github.com/gin-gonic/gin"
	
)

func CreatePassenger(c *gin.Context) {
    var passengers []struct {
        MemberID    uint    `json:"memberid"`
        Name        string  `json:"name"`
        Phone       string  `json:"phone"`
        Status      string  `json:"status"`
        SeatID      int32   `json:"seatid"` // ใช้ int32 สำหรับ SeatID
        PaymentID   uint    `json:"paymentid"`
        Pass_ticket   string    `json:"pass_ticket"`
    }

    // Bind JSON to the passengers slice
    if err := c.ShouldBindJSON(&passengers); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Loop through each passenger and save them to the database
    for _, passenger := range passengers {
        p := entity.Passenger{
            MemberID:    passenger.MemberID,
            Name:        passenger.Name,
            Status:      passenger.Status,
            PhoneNumber: passenger.Phone,
            Seat:        passenger.SeatID, // แปลง int32 เป็น uint ถ้าจำเป็น
            PaymentID:   passenger.PaymentID,
            Pass_ticket: passenger.Pass_ticket,
        }

        // Save each passenger to the database
        if err := db.Create(&p).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(http.StatusCreated, gin.H{"message": "All passengers created successfully"})
}

func PassengerEdit(c *gin.Context) {
    id := c.Param("id")  // ดึง id จาก URL
    var payment entity.Payment
    var passenger entity.Passenger

    // ดึงข้อมูล payment ที่จะอัปเดตจากฐานข้อมูล
    if err := config.DB().First(&payment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
        return
    }

    // ดึงข้อมูล passenger ที่เกี่ยวข้องกับ payment นี้
    if err := config.DB().Where("payment_id = ?", id).First(&passenger).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
        return
    }

    // ผูกข้อมูล JSON ที่ได้รับจาก frontend กับตัวแปร payment และ passenger
    var input struct {
        PaymentID     uint    `json:"payment_id"`
        PassengerName string  `json:"passenger_name"`
        PhoneNumber   string  `json:"phone_number"`
        Departure     string  `json:"departure"`
        Destination   string  `json:"destination"`
        Date          string  `json:"date"`
        Seat          string  `json:"seat"`
        Total         float32 `json:"total"`
        Image         string  `json:"image"`
        Status        string  `json:"status"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // อัปเดตค่าของ payment
    payment.Departure = input.Departure
    payment.Destination = input.Destination
    payment.Date = input.Date
    payment.Total = input.Total
    payment.Image = input.Image
    payment.Status = input.Status

    // อัปเดตค่าของ passenger
    passenger.Name = input.PassengerName
    passenger.PhoneNumber = input.PhoneNumber

    // ทำการอัปเดตข้อมูลในตาราง payments
    if err := config.DB().Model(&payment).Updates(payment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment"})
        return
    }

    // ทำการอัปเดตข้อมูลในตาราง passengers
    if err := config.DB().Model(&passenger).Updates(passenger).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update passenger"})
        return
    }

    // ส่งผลลัพธ์กลับไป
    c.JSON(http.StatusOK, gin.H{"message": "Payment and Passenger updated successfully", "payment": payment, "passenger": passenger})
}





func GetSeatBooking(c *gin.Context) {
	db := config.DB()

	var seats []string
	bustimingID := c.Query("bustiming_id") // ดึง bustiming_id จาก query parameter

	// ตรวจสอบว่ามี bustiming_id หรือไม่
	if bustimingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bustiming_id is required"})
		return
	}

	// ทำการ query ข้อมูลที่นั่งโดยใช้ bustiming_id
	err := db.Table("passengers").
		Select("passengers.Seat").
		Joins("JOIN payments ON passengers.payment_id = payments.ID").
		Where("payments.bustiming_id = ?", bustimingID).
		Where("payments.Status = ? OR payments.Status = ?", "Pass", "ตรวจสอบแล้ว").
		Find(&seats).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่นั่งกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"seats": seats})
}
