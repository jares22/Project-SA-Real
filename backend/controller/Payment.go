package controller

import (
	"SirisakTour/config"
	"SirisakTour/entity"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreatePayment(c *gin.Context) {
	var input struct {
		Province1       string  `json:"province1"`
		Province2       string  `json:"province2"`
		DatepickerFull  string  `json:"datepickerfullTime"`
		Status          string  `json:"status"`
		Timestamp       string  `json:"TimeStamp"`
		PriceTotal      float32 `json:"priceTotal"`
		Image           string  `json:"Image"`
		BustimingID     uint    `json:"bustimingID"`
		Pass_ticket     string
		TransactionDate time.Time
	}

	// Bind the incoming JSON payload to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create a new Payment object
	newPayment := entity.Payment{
		Departure:       input.Province1,      // ค่าจาก input
		Destination:     input.Province2,      // ค่าจาก input
		Date:            input.DatepickerFull, // ค่าจาก input
		Status:          input.Status,         // ค่าจาก input 
		Total:           input.PriceTotal,     // ค่าจาก input
		Image:           input.Image,          // ค่าจาก input
		BustimingID:     input.BustimingID,    // ค่าจาก input
		TransactionDate: input.TransactionDate,
	}

	db := config.DB()

	// Save the new Payment record to the database
	if err := db.Create(&newPayment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return a success response
	c.JSON(http.StatusCreated, gin.H{"message": "Payment created successfully", "data": newPayment})
}

func UpdatePayment(c *gin.Context) {
	var input struct {
		PaymentID uint   `json:"paymentid"` // รอรับ paymentid
		Status    string `json:"status"`    // รอรับ status
	}

	// Bind JSON to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()

	// ค้นหา Payment โดยใช้ PaymentID
	var payment entity.Payment
	result := db.First(&payment, input.PaymentID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment ID not found"})
		return
	}

	// อัปเดต status
	payment.Status = input.Status

	// บันทึกการเปลี่ยนแปลง
	if err := db.Save(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func GetPayment(c *gin.Context) {
	var payment entity.Payment
	ID := c.Param("id")
	// เรียกใช้ฐานข้อมูลจาก config
	db := config.DB()
	// ดึงข้อมูลจากฐานข้อมูลโดยใช้ SQL query
	if err := db.Raw("SELECT * FROM payments WHERE id = ?", ID).Scan(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูล Payment กลับไปยัง client
	c.JSON(http.StatusOK, gin.H{"data": payment})
}

func DeletePayment(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM payments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

func GetlastpaymentID(c *gin.Context) {
	var maxID struct {
		MaxPaymentID uint `gorm:"column:max_payment_id"`
	}

	// Connect to the database
	db := config.DB()

	// Execute the query to get the maximum payment ID
	if err := db.Raw("SELECT MAX(id) AS max_payment_id FROM payments").Scan(&maxID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the max payment ID in the response
	c.JSON(http.StatusOK, gin.H{"max_payment_id": maxID.MaxPaymentID})
}

func GetPaymentsWithStatusPass(c *gin.Context) {
	var results []struct {
		ID          uint    `json:"payment_id"`
		Name        string  `json:"passenger_name"`
		Departure   string  `json:"departure"`
		Destination string  `json:"destination"`
		Date        string  `json:"date"`
		PhoneNumber string  `json:"phone_number"`
		Seat        string  `json:"seat"`
		Total       float32 `json:"total"`
		Pass_ticket       string `json:"pass_ticket"`
		Image       string  `json:"image"`
		Status      string  `json:"status"`
		TransactionDate time.Time `json:"transactiondate"`
	}

	// ดึง memberID จาก parameter
	memberID := c.Param("id")

	// Query เพื่อดึงข้อมูลการชำระเงินที่มี status = 'Pass' และ member_id ตรงกับที่ส่งมา
	query := `
        SELECT 
            payments.id, 
            passengers.name, 
            payments.departure, 
            payments.destination, 
			payments.transaction_date,
            payments.date, 
            passengers.phone_number,
			passengers.Pass_ticket,
            passengers.seat, 
            payments.total,
			payments.image,
            payments.status 
        FROM payments
        JOIN passengers ON passengers.payment_id = payments.id
        WHERE passengers.member_id = ? AND payments.status = ?
		ORDER BY payments.id  DESC
    `

	// รัน query โดยใช้ memberID ที่ส่งมาและกรอง status = 'Pass'
	if err := config.DB().Raw(query, memberID, "Pass").Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับในรูปแบบ JSON
	c.JSON(http.StatusOK, results)
}

func GetPaymentsWithPassengers(c *gin.Context) {
	// ดึง id จาก query parameter หรือ path parameter
	memberID := c.Param("id") 

	var results []struct {
		ID          uint    `json:"payment_id"`
		Name        string  `json:"passenger_name"`
		Departure   string  `json:"departure"`
		Destination string  `json:"destination"`
		Date        string  `json:"date"`
		PhoneNumber string  `json:"phone_number"`
		Seat        string  `json:"seat"`
		Total       float32 `json:"total"`
		Image       string  `json:"image"`
		Status      string  `json:"status"`
	
	}

	query := `
        SELECT 
            payments.id, 
            passengers.name, 
            payments.departure, 
            payments.destination, 
            payments.date, 
            passengers.phone_number, 
            passengers.seat, 
            payments.total,
			payments.image,
            payments.status 
        FROM payments
        JOIN passengers ON passengers.payment_id = payments.id
        WHERE passengers.member_id = ?
		ORDER BY payments.id  DESC
    `

	// รัน query โดยใช้เงื่อนไขที่ส่งมาจาก memberID
	if err := config.DB().Raw(query, memberID).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}


func GetPaymentsWithPassengers_Foradmin(c *gin.Context) {
	var results []struct {
		ID          uint    `json:"payment_id"`
		PassengerID uint    `json:"passenger_id"`  // เพิ่ม passenger_id ใน struct
		Name        string  `json:"passenger_name"`
		Departure   string  `json:"departure"`
		Destination string  `json:"destination"`
		Date        string  `json:"date"`
		PhoneNumber string  `json:"phone_number"`
		Seat        string  `json:"seat"`
		Total       float32 `json:"total"`
		Image       string  `json:"image"`
		Status      string  `json:"status"`
		TransactionDate string `json:"transactiondate"`
	}

	query := `
        SELECT 
            payments.id, 
            passengers.id AS passenger_id,  -- เพิ่มการดึง passenger_id
            passengers.name, 
            payments.departure, 
            payments.destination, 
            payments.date, 
            passengers.phone_number, 
            passengers.seat, 
            payments.total,
            payments.image,
            payments.transaction_date,
            payments.status 
        FROM payments
        JOIN passengers ON passengers.payment_id = payments.id
        ORDER BY payments.id DESC
    `

	// รัน query โดยตรง
	if err := config.DB().Raw(query).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลผลลัพธ์กลับไป
	c.JSON(http.StatusOK, results)
}


