package controller

import (
	"net/http"
	"SirisakTour/config"
	"github.com/gin-gonic/gin"
)

func GetListDeparture(c *gin.Context) {
	type Province struct {
		Province string `json:"province1"`
	}
	
	var provinces []Province

	// ดึงข้อมูลจาก config.DB ที่ถูกตั้งค่าไว้ใน config
	db := config.DB()

	// ใช้คำสั่ง SQL ดึงข้อมูล province2 และเรียงลำดับจากน้อยไปมาก
	if err := db.Raw("SELECT DISTINCT province1 AS province FROM route_data ORDER BY province1 ASC").Scan(&provinces).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูล province2 ในรูปแบบ JSON
	c.JSON(http.StatusOK, provinces)
}

func GetListDestination(c *gin.Context) {
	type Province struct {
		Province string `json:"province2"`
	}

	var provinces []Province

	// ดึงข้อมูลจาก config.DB ที่ถูกตั้งค่าไว้ใน config
	db := config.DB()

	// ใช้คำสั่ง SQL ดึงข้อมูล province2 และเรียงลำดับจากน้อยไปมาก
	if err := db.Raw("SELECT DISTINCT province2 AS province FROM route_data ORDER BY province2 ASC").Scan(&provinces).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูล province2 ในรูปแบบ JSON
	c.JSON(http.StatusOK, provinces)
}

//อ็อบเจ็กต์ที่มี property province จะเอาไปใช้ง่าย



