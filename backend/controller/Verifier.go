package controller

import (
	"errors"
	"net/http"
	"SirisakTour/config"
	"SirisakTour/entity"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TicketRequest struct {
	PassTicket string `json:"pass_ticket" binding:"required"`
}

type TicketResponse struct {
	IsValid     bool   `json:"isValid"`
	Message     string `json:"message"`
	PassTicket  string `json:"pass_ticket"`
	SeatStatus  string `json:"seatStatus"`
}

func VerifyTicket(c *gin.Context) {
	var req TicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, TicketResponse{
			IsValid: false,
			Message: "Invalid request format",
		})
		return
	}

	var passenger entity.Passenger
	result := config.DB().Preload("Payment").First(&passenger, "pass_ticket = ?", req.PassTicket)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Ticket verified successfully",
		"pass_ticket":   passenger.Pass_ticket,
		"name":          passenger.Name,
		"phone_number":  passenger.PhoneNumber,
		"seat":          passenger.Seat,
		"member_id":     passenger.MemberID,
		"status":        passenger.Status,
		"bus_timing_id": passenger.Payment.BustimingID,
		"passenger_id":  passenger.ID,
	})
}

type UpdateSeatStatusRequest struct {
	PassTicket string `json:"pass_ticket" binding:"required"`
	Status     string `json:"Status" binding:"required"`
}

func UpdateSeatStatus(c *gin.Context) {
	var req UpdateSeatStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request format"})
		return
	}

	var passenger entity.Passenger
	result := config.DB().Preload("Payment").Where("pass_ticket = ?", req.PassTicket).First(&passenger)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Ticket number not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database query failed", "error": result.Error.Error()})
		return
	}

	if passenger.Payment.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment record not found"})
		return
	}

	passenger.Status = req.Status
	if err := config.DB().Save(&passenger).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update seat status", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Seat status updated successfully"})
}

func GetBusRounds(c *gin.Context) {
	var busRounds []struct {
		ID            uint   `json:"id"`
		DepartureDay  string `json:"departure_day"`
		DepartureTime string `json:"departure_time"`
	}

	db := config.DB()
	result := db.Model(&entity.BusTiming{}).Select("id, departure_day, departure_time").Find(&busRounds)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, busRounds)
}

func GetVerifiers(c *gin.Context) {
	var passengers []entity.Passenger
	db := config.DB()
	bustimingID := c.Query("bustiming_id")

	if bustimingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bustiming_id is required"})
		return
	}

	bustimingIDUint, err := strconv.ParseUint(bustimingID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bustiming_id"})
		return
	}

	results := db.Preload("Payment.BusTiming").Where("payment_id IN (SELECT id FROM payments WHERE bustiming_id = ?)", uint(bustimingIDUint)).Find(&passengers)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	type TicketResponse struct {
		PassengerID uint   `json:"passenger_id"`
		PassTicket   string `json:"pass_ticket"`
		Status      string `json:"status"`
		PhoneNumber string `json:"phone_number"`
		BusID       uint   `json:"bus_id"`
		BustimingID uint   `json:"bustiming_id"`
		DepartDate  string `json:"departdate"`
		DepartTime  string `json:"departtime"`
	}

	var response []TicketResponse
	for _, passenger := range passengers {
		DepartDate := ""
		DepartTime := ""
		if passenger.Payment.BusTiming.DepartureDay != "" {
			DepartDate = passenger.Payment.BusTiming.DepartureDay
			DepartTime = passenger.Payment.BusTiming.DepartureTime
		}

		response = append(response, TicketResponse{
			PassengerID: passenger.ID,
			PassTicket:   passenger.Pass_ticket,
			Status:      passenger.Status,
			PhoneNumber: passenger.PhoneNumber,
			BusID:       passenger.Payment.BusTiming.BusID,
			BustimingID: passenger.Payment.BustimingID,
			DepartTime:  DepartTime,
			DepartDate:  DepartDate,
		})
	}

	c.JSON(http.StatusOK, response)
}

type RequestBody struct {
	PassengerID int    `json:"passenger_id" binding:"required"`
	DriverID    int    `json:"driver_id" binding:"required"`
	Status      string `json:"status" binding:"required"`
}

func TicketVerification(c *gin.Context) {
	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	db := config.DB()
	var existingVerification entity.TicketVerification
	if err := db.Where("passenger_id = ?", requestBody.PassengerID).First(&existingVerification).Error; err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking for existing records"})
		return
	}

	if existingVerification.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "A verification record for this passenger already exists"})
		return
	}

	newVerification := entity.TicketVerification{
		Verification_Time: time.Now(),
		Status:            requestBody.Status,
		DriversID:         uint(requestBody.DriverID),
		PassengerID:       uint(requestBody.PassengerID),
	}

	if result := db.Create(&newVerification); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket verification record created successfully", "data": newVerification})
}
