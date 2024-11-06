package controller

import (
	"net/http"
	"SirisakTour/config"
	"github.com/gin-gonic/gin"
)

// Struct สำหรับการตอบกลับ JSON ที่ประกอบด้วยฟิลด์ที่ต้องการ
type RouteResponse struct {
	RouteID   uint   `json:"route_id"`   // เปลี่ยนชื่อฟิลด์ ID เป็น routeID
	NameRoute string `json:"name_route"` // ฟิลด์ที่ต้องการส่งออก
	Routeway  string `json:"routeway"`   // ฟิลด์ที่ต้องการส่งออก
}

func ListAllroute(c *gin.Context) {
	var routeResponses []RouteResponse

	db := config.DB()
	// ใช้คำสั่ง SQL เพื่อดึงข้อมูลทั้งหมดจาก Route และเปลี่ยนชื่อฟิลด์ ID เป็น RouteID
	results := db.Table("routes").Select("id as route_id, name_route, routeway").Scan(&routeResponses)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// ส่งออกข้อมูลที่ดึงมาในรูปแบบ JSON
	c.JSON(http.StatusOK, routeResponses)
}
