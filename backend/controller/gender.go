package controller

import (
	"SirisakTour/config"
	"SirisakTour/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /genders
func ListGenders(c *gin.Context) {
	var genders []entity.Gender

	db := config.DB()
	if err := db.Find(&genders).Error; err != nil {
		// ตรวจสอบว่าเกิดข้อผิดพลาดในการดึงข้อมูลหรือไม่
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่าพบข้อมูลหรือไม่
	if len(genders) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No genders found"})
		return
	}

	c.JSON(http.StatusOK, genders)
}



