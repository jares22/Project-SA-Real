package controller

import (
	"net/http"

	"SirisakTour/config"
	"SirisakTour/entity"
	"github.com/gin-gonic/gin"
)



func AddLogin(c *gin.Context) {
	var input struct {
		Username string `json:"usernamef"`
		Password string `json:"passwordf"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	db := config.DB()

	// ตรวจสอบว่าผู้ใช้เป็นสมาชิกหรือพนักงาน
	var member entity.Member
	var employee entity.Employees

	// ตรวจสอบสมาชิกก่อน
	if err := db.Where("username = ? AND password = ?", input.Username, input.Password).First(&member).Error; err == nil {
		// ถ้าเจอสมาชิก ส่งข้อมูล role และ id
		c.JSON(http.StatusOK, gin.H{"role": "user", "id": member.ID})
		return
	}

	// ถ้าไม่เจอสมาชิก ตรวจสอบว่าเป็นพนักงาน
	if err := db.Where("username = ? AND password = ?", input.Username, input.Password).First(&employee).Error; err == nil {
		// ตรวจสอบตำแหน่ง (Position) ของพนักงาน
		if employee.Position == "Admin" {
			c.JSON(http.StatusOK, gin.H{"role": "admin", "id": employee.ID})
		} else if employee.Position == "Driver" {
			// โหลดข้อมูล Driver ที่เกี่ยวข้อง
			var driver entity.Drivers
			if err := db.Where("employee_id = ?", employee.ID).First(&driver).Error; err == nil {
				// ส่ง ID ของ Driver
				c.JSON(http.StatusOK, gin.H{"role": "driver", "id": driver.ID})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Driver not found"})
			}
		}
		return
	}

	// ถ้าไม่เจอทั้งสมาชิกและพนักงาน ส่งผลลัพธ์ว่าไม่มีสิทธิ์
	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}



func AddAccount(c *gin.Context) {
	var member struct {
		Username      string `json:"usernamef"`
		Password      string `json:"password1f"`
		Email         string `json:"emailf"`
		FirstName     string `json:"firstnamef"`
		LastName      string `json:"lastnamef"`
		Birthday      string `json:"birthdayuserf"` // รับเป็น string
	}

	// Bind JSON to struct
	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// คุณอาจต้องการทำการแปลงค่าหรือการตรวจสอบอื่น ๆ ที่นี่

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// สร้างข้อมูลสมาชิก
	newMember := entity.Member{
		Username:  member.Username,
		Password:  member.Password,
		Email:     member.Email,
		FirstName: member.FirstName,
		LastName:  member.LastName,
		Birthday:  member.Birthday,
	}

	// บันทึกข้อมูลสมาชิกลงในฐานข้อมูล
	if err := db.Create(&newMember).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Member created successfully", "data": newMember})
}

func GetNameUserByID(c *gin.Context) {
	// ดึง ID จากพารามิเตอร์ที่ส่งมา
	memberID := c.Param("id")


	var member entity.Member
	db := config.DB()

	if err := db.First(&member, memberID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"FirstName": member.FirstName,
		"LastName":  member.LastName,
	})
}
