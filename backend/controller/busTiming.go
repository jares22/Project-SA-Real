package controller

import (
	"SirisakTour/config"
	"SirisakTour/entity"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// แก้
func ListAllVehicleForManageRoute(c *gin.Context) {
	// สร้าง struct สำหรับการรับผลลัพธ์ที่เราต้องการ โดยใช้ชื่อฟิลด์ตามที่ต้องการส่งออก
	type VehicleResponse struct {
		BusID        uint   `json:"bus_id"`        // ส่งออกเป็น bus_id
		LicensePlate string `json:"license_plate"` // ส่งออกเป็น license_plate
	}

	var vehicleResponses []VehicleResponse

	db := config.DB()
	// ใช้คำสั่ง SQL เพื่อดึงเฉพาะ ID (VehicleID) และ BusRegistration (LicensePlate)
	results := db.Table("vehicles").Select("id as bus_id, bus_registration as license_plate").Scan(&vehicleResponses)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// ส่งออกข้อมูลที่ดึงมาในรูปแบบ JSON
	c.JSON(http.StatusOK, vehicleResponses)
}

// แก้  Bus -->> Vehicles
func FormAddToBusTiming(c *gin.Context) {
	var bustiming struct {
		BusID         int    `json:"bus_id"`
		DepartureDay  string `json:"departure_day"`
		DepartureTime string `json:"departure_time"`
		ReturnDay     string `json:"return_day"`
		ReturnTime    string `json:"return_time"`
		RouteID       int    `json:"route_id"`
	}

	// Bind JSON to struct
	if err := c.ShouldBindJSON(&bustiming); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Connect to database
	db := config.DB()

	// Create and save BusTiming
	busTiming := entity.BusTiming{
		DepartureDay:  bustiming.DepartureDay,
		DepartureTime: bustiming.DepartureTime,
		ReturnDay:     bustiming.ReturnDay,
		ReturnTime:    bustiming.ReturnTime,
		BusID:         uint(bustiming.BusID),
		RouteID:       uint(bustiming.RouteID),
	}

	if err := db.Create(&busTiming).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": busTiming})
}


func DeleteBusTiming(c *gin.Context) { //(15)

	id := c.Param("id") //รับ id จาก URL Parameter
	db := config.DB()
	if tx := db.Exec("DELETE FROM bus_timings WHERE id = ?", id); tx.RowsAffected == 0 { //
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"}) //tx.RowsAffected เป็นการตรวจสอบว่ามีแถวใดถูกลบหรือไม่   ถ้าค่าของ tx.RowsAffected == 0 หมายความว่าไม่มีแถวใดถูกลบ
		return                                                        //ถ้าไม่มีแถวใดถูกลบ (RowsAffected == 0  ระบบจะส่งการตอบกลับ HTTP 400 (BadRequest) พร้อมกับข้อความ "id not found" เพื่อบอกว่าไม่พบ id ที่ผู้ใช้ต้องการลบ.
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"}) //ถ้าการลบสำเร็จ   ระบบจะส่งการตอบกลับ HTTP 200 (OK) พร้อมกับข้อความ "Deleted successful" เพื่อบอกว่าการลบข้อมูลสำเร็จแล้ว.

}

func UpdateBusTimingID(c *gin.Context) {
	var input struct {
		BusID           uint   `json:"bus_idf"`
		DepartureDay    string `json:"departure_dayf"`
		DepartureHour   string `json:"departure_hourf"`
		DepartureMinute string `json:"departure_minutef"`
		ReturnDay       string `json:"return_dayf"`
		ReturnHour      string `json:"return_hourf"`
		ReturnMinute    string `json:"return_minutef"`
		RouteID         uint   `json:"route_idf"`
		BusTimingID     uint   `json:"bustiming_id"`
	}

	// Bind the incoming JSON payload to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create an updated BusTiming object
	updatedBusTiming := entity.BusTiming{
		DepartureDay:  input.DepartureDay,
		DepartureTime: input.DepartureHour + ":" + input.DepartureMinute,
		ReturnDay:     input.ReturnDay,
		ReturnTime:    input.ReturnHour + ":" + input.ReturnMinute,
		BusID:         input.BusID,
		RouteID:       input.RouteID,
	}
	db := config.DB()
	// Update the record in the database
	result := db.Model(&entity.BusTiming{}).Where("id = ?", input.BusTimingID).Updates(updatedBusTiming)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Return a success response
	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขรอบรถสำเร็จ"}) //ตรงที่ปริ้น ออก
}

///แก้////
// func UserSearchTicket(c *gin.Context) {
// 	// รับค่าจาก request body
// 	var input struct {
// 		DepartureDay string `json:"departure_day"`
// 		Province1    string `json:"province1"`
// 		Province2    string `json:"province2"`
// 	}

// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// โครงสร้างข้อมูลที่เราต้องการจะส่งออก
// 	type BusDetails struct {
// 		BusTimingID    uint    `json:"bustiming_id"`
// 		DepartureDay   string  `json:"departure_day"`
// 		DepartureTime  string  `json:"departure_time"`
// 		ReturnDay      string  `json:"return_day"`
// 		ReturnTime     string  `json:"return_time"`
// 		LicensePlate   string  `json:"license_plate"`
// 		NameRoute      string  `json:"name_route"`
// 		Routeway       string  `json:"routeway"`
// 		Distance       float32 `json:"distance"`
// 		Time           int     `json:"time"`
// 		Province1      string  `json:"province1"`
// 		Province2      string  `json:"province2"`
// 	}

// 	// ใช้โครงสร้างข้อมูลชั่วคราวเพื่อดึงข้อมูลจากฐานข้อมูล
// 	var tempResults []struct {
// 		ID             uint    `json:"id"`
// 		DepartureDay   string  `json:"departure_day"`
// 		DepartureTime  string  `json:"departure_time"`
// 		ReturnDay      string  `json:"return_day"`
// 		ReturnTime     string  `json:"return_time"`
// 		LicensePlate   string  `json:"license_plate"`
// 		NameRoute      string  `json:"name_route"`
// 		Routeway       string  `json:"routeway"`
// 	}

// 	db := config.DB()

// 	// Query ข้อมูลจากตาราง BusTiming, Vehicles, และ Route
// 	err := db.Table("bus_timings").
// 		Select(`bus_timings.id as id, bus_timings.departure_day, bus_timings.departure_time, bus_timings.return_day,
// 			bus_timings.return_time, vehicles.bus_registration as license_plate, routes.name_route, routes.routeway`).
// 		Joins("JOIN vehicles ON bus_timings.bus_id = vehicles.id").
// 		Joins("JOIN routes ON bus_timings.route_id = routes.id").
// 		Where("bus_timings.departure_day = ?", input.DepartureDay).
// 		Where("routes.routeway LIKE ?", input.Province1 + "%" + input.Province2 + "%").
// 		Find(&tempResults).Error

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่าพบข้อมูลหรือไม่
// 	if len(tempResults) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "ไม่พบข้อมูลที่ตรงกับเงื่อนไข"})
// 		return
// 	}

// 	// สร้างรายการของผลลัพธ์ที่มีหลายข้อมูล
// 	var busDetailsList []BusDetails

// 	for _, tempResult := range tempResults {
// 		// Query ข้อมูลจากตาราง Route
// 		var routeData entity.RouteData
// 		err = db.Where("province1 = ? AND province2 = ?", input.Province1, input.Province2).First(&routeData).Error

// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}

// 		// รวมข้อมูลที่ได้จาก RouteData เข้ากับข้อมูล BusDetails
// 		busDetail := BusDetails{
// 			BusTimingID:   tempResult.ID,
// 			DepartureDay:  tempResult.DepartureDay,
// 			DepartureTime: tempResult.DepartureTime,
// 			ReturnDay:     tempResult.ReturnDay,
// 			ReturnTime:    tempResult.ReturnTime,
// 			LicensePlate:  tempResult.LicensePlate,
// 			NameRoute:     tempResult.NameRoute,
// 			Routeway:      tempResult.Routeway,
// 			Province1:     routeData.Province1,
// 			Province2:     routeData.Province2,
// 			Distance:      routeData.Distance,
// 			Time:          routeData.Time,
// 		}

// 		// เพิ่มผลลัพธ์ที่ได้ใน list
// 		busDetailsList = append(busDetailsList, busDetail)
// 	}

// 	// ส่งผลลัพธ์ออกเป็น JSON
// 	c.JSON(http.StatusOK, gin.H{
// 		"data": busDetailsList,
// 	})
// }

// func UserSearchTicket(c *gin.Context) {
// 	// รับค่าจาก request body
// 	var input struct {
// 		DepartureDay string `json:"departure_day"`
// 		Province1    string `json:"province1"`
// 		Province2    string `json:"province2"`
// 	}

// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// โครงสร้างข้อมูลที่เราต้องการจะส่งออก
// 	type BusDetails struct {
// 		BusTimingID    uint    `json:"bustiming_id"`
// 		DepartureDay   string  `json:"departure_day"`
// 		DepartureTime  string  `json:"departure_time"`
// 		ReturnDay      string  `json:"return_day"`
// 		ReturnTime     string  `json:"return_time"`
// 		LicensePlate   string  `json:"license_plate"`
// 		NameRoute      string  `json:"name_route"`
// 		Routeway       string  `json:"routeway"`
// 		VehicleType    string  `json:"vehicle_type"` // เพิ่มฟิลด์สำหรับ vehicle type
// 		Distance       float32 `json:"distance"`
// 		Time           int     `json:"time"`
// 		Province1      string  `json:"province1"`
// 		Province2      string  `json:"province2"`
// 	}

// 	// ใช้โครงสร้างข้อมูลชั่วคราวเพื่อดึงข้อมูลจากฐานข้อมูล
// 	var tempResults []struct {
// 		ID             uint    `json:"id"`
// 		DepartureDay   string  `json:"departure_day"`
// 		DepartureTime  string  `json:"departure_time"`
// 		ReturnDay      string  `json:"return_day"`
// 		ReturnTime     string  `json:"return_time"`
// 		LicensePlate   string  `json:"license_plate"`
// 		NameRoute      string  `json:"name_route"`
// 		Routeway       string  `json:"routeway"`
// 		VehicleType    string  `json:"vehicle_type"` // เพิ่มฟิลด์ vehicle type
// 	}

// 	db := config.DB()

// 	// Query ข้อมูลจากตาราง BusTiming, Vehicles, และ Route
// 	err := db.Table("bus_timings").
// 		Select(`bus_timings.id as id, bus_timings.departure_day, bus_timings.departure_time, bus_timings.return_day,
// 			bus_timings.return_time, vehicles.bus_registration as license_plate, vehicles.type as vehicle_type, routes.name_route, routes.routeway`).
// 		Joins("JOIN vehicles ON bus_timings.bus_id = vehicles.id").
// 		Joins("JOIN routes ON bus_timings.route_id = routes.id").
// 		Where("bus_timings.departure_day = ?", input.DepartureDay).
// 		Where("routes.routeway LIKE ?", input.Province1+"%"+input.Province2+"%").
// 		Find(&tempResults).Error

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่าพบข้อมูลหรือไม่
// 	if len(tempResults) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "ไม่พบข้อมูลที่ตรงกับเงื่อนไข"})
// 		return
// 	}

// 	// สร้างรายการของผลลัพธ์ที่มีหลายข้อมูล
// 	var busDetailsList []BusDetails

// 	for _, tempResult := range tempResults {
// 		// Query ข้อมูลจากตาราง Route
// 		var routeData entity.RouteData
// 		err = db.Where("province1 = ? AND province2 = ?", input.Province1, input.Province2).First(&routeData).Error

// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}

// 		// รวมข้อมูลที่ได้จาก RouteData เข้ากับข้อมูล BusDetails
// 		busDetail := BusDetails{
// 			BusTimingID:   tempResult.ID,
// 			DepartureDay:  tempResult.DepartureDay,
// 			DepartureTime: tempResult.DepartureTime,
// 			ReturnDay:     tempResult.ReturnDay,
// 			ReturnTime:    tempResult.ReturnTime,
// 			LicensePlate:  tempResult.LicensePlate,
// 			NameRoute:     tempResult.NameRoute,
// 			Routeway:      tempResult.Routeway,
// 			VehicleType:   tempResult.VehicleType, // เพิ่ม vehicle type ที่ดึงมาจาก tempResult
// 			Province1:     routeData.Province1,
// 			Province2:     routeData.Province2,
// 			Distance:      routeData.Distance,
// 			Time:          routeData.Time,
// 		}

// 		// เพิ่มผลลัพธ์ที่ได้ใน list
// 		busDetailsList = append(busDetailsList, busDetail)
// 	}

// 	// ส่งผลลัพธ์ออกเป็น JSON
// 	c.JSON(http.StatusOK, gin.H{
// 		"data": busDetailsList,
// 	})
// }

// โค้ดนี้ใช้ได้
func UserSearchTicket(c *gin.Context) {
	type RouteData struct {
		gorm.Model
		Province1 string
		Province2 string
		Distance  float32
		Time      int
	}
	// รับค่าจาก request body
	var input struct {
		DepartureDay string `json:"departure_day"`
		Province1    string `json:"province1"`
		Province2    string `json:"province2"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// โครงสร้างข้อมูลที่เราต้องการจะส่งออก
	type BusDetails struct {
		BusTimingID   uint    `json:"bustiming_id"`
		DepartureDay  string  `json:"departure_day"`
		DepartureTime string  `json:"departure_time"`
		ReturnDay     string  `json:"return_day"`
		ReturnTime    string  `json:"return_time"`
		LicensePlate  string  `json:"license_plate"`
		NameRoute     string  `json:"name_route"`
		Routeway      string  `json:"routeway"`
		Distance      float32 `json:"distance"`
		Time          int     `json:"time"`
		Province1     string  `json:"province1"`
		Province2     string  `json:"province2"`
		EndTimeWay    int     `json:"endtimeway"` // เพิ่มฟิลด์สำหรับ EndTimeWay
		VehicleType   string  `json:"vehicle_type"`
	}

	// ใช้โครงสร้างข้อมูลชั่วคราวเพื่อดึงข้อมูลจากฐานข้อมูล
	var tempResults []struct {
		ID            uint   `json:"id"`
		DepartureDay  string `json:"departure_day"`
		DepartureTime string `json:"departure_time"`
		ReturnDay     string `json:"return_day"`
		ReturnTime    string `json:"return_time"`
		LicensePlate  string `json:"license_plate"`
		NameRoute     string `json:"name_route"`
		Routeway      string `json:"routeway"`
		VehicleType   string `json:"vehicle_type"`
	}

	db := config.DB()

	// Query ข้อมูลจากตาราง BusTiming, Vehicles, และ Route   //เพิ่ม type vehicle
	err := db.Table("bus_timings").
		Select(`bus_timings.id as id, 
            bus_timings.departure_day, 
            bus_timings.departure_time, 
            bus_timings.return_day, 
            bus_timings.return_time, 
            vehicles.bus_registration as license_plate, 
            vehicles.type as vehicle_type,  -- เพิ่มการแสดงประเภทของยานพาหนะ
            routes.name_route, 
            routes.routeway`).
		Joins("JOIN vehicles ON bus_timings.bus_id = vehicles.id").
		Joins("JOIN routes ON bus_timings.route_id = routes.id").
		Where("bus_timings.departure_day = ?", input.DepartureDay).
		Where("routes.routeway LIKE ?", input.Province1+"%"+input.Province2+"%").
		Find(&tempResults).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่าพบข้อมูลหรือไม่
	if len(tempResults) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "ไม่พบข้อมูลที่ตรงกับเงื่อนไข"})
		return
	}

	// สร้างรายการของผลลัพธ์ที่มีหลายข้อมูล
	var busDetailsList []BusDetails

	for _, tempResult := range tempResults {
		// แยกชื่อจังหวัดจาก NameRoute
		routeParts := strings.Split(tempResult.NameRoute, "-")
		var provincestart, provinceend string
		if len(routeParts) >= 2 {
			provincestart = routeParts[0]
			provinceend = routeParts[1] // ใช้จังหวัดสุดท้ายจากการแยก
		}

		// Query ข้อมูลจากตาราง RouteData
		var longrouteData RouteData
		err = db.Where("province1 = ? AND province2 = ?", provincestart, provinceend).First(&longrouteData).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		var subrouteData RouteData
		err = db.Where("province1 = ? AND province2 = ?", input.Province1, input.Province2).First(&subrouteData).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// รวมข้อมูลที่ได้จาก RouteData เข้ากับข้อมูล BusDetails
		busDetail := BusDetails{
			BusTimingID:   tempResult.ID,
			DepartureDay:  tempResult.DepartureDay,
			DepartureTime: tempResult.DepartureTime,
			ReturnDay:     tempResult.ReturnDay,
			ReturnTime:    tempResult.ReturnTime,
			LicensePlate:  tempResult.LicensePlate,
			NameRoute:     tempResult.NameRoute,
			Routeway:      tempResult.Routeway,
			Province1:     input.Province1,
			Province2:     input.Province2,
			Distance:      subrouteData.Distance,
			Time:          subrouteData.Time,
			EndTimeWay:    longrouteData.Time, // ใช้ Time จาก routeData เป็น EndTimeWay
			VehicleType:   tempResult.VehicleType,
		}

		// เพิ่มผลลัพธ์ที่ได้ใน list
		busDetailsList = append(busDetailsList, busDetail)
	}

	// ส่งผลลัพธ์ออกเป็น JSON
	c.JSON(http.StatusOK, gin.H{
		"data": busDetailsList,
	})
}

// /แก้
func GetListRouteManageMain(c *gin.Context) {
	// โครงสร้างสำหรับเก็บข้อมูลรวม Route และ BusTimings
	var routeMain []struct {
		BusID         uint   `json:"bus_id"`         // ชื่อฟิลด์ใน JSON
		LicensePlate  string `json:"license_plate"`  // ชื่อฟิลด์ใน JSON
		NameRoute     string `json:"name_route"`     // ชื่อฟิลด์ใน JSON
		Routeway      string `json:"routeway"`       // ชื่อฟิลด์ใน JSON
		DepartureDay  string `json:"departure_day"`  // ชื่อฟิลด์ใน JSON
		DepartureTime string `json:"departure_time"` // ชื่อฟิลด์ใน JSON
		ReturnDay     string `json:"return_day"`     // ชื่อฟิลด์ใน JSON
		ReturnTime    string `json:"return_time"`    // ชื่อฟิลด์ใน JSON
		BustimingID   uint   `json:"bustiming_id"`   // ชื่อฟิลด์ใน JSON
		RouteID       uint   `json:"route_id"`       // ชื่อฟิลด์ใน JSON
	}

	// สร้างการเชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลจากฐานข้อมูลรวมกับ ID ของ BusTiming และเรียงลำดับตาม BusTimingID
	err := db.Table("routes r").
		Select("r.id as route_id, v.id as bus_id, v.bus_registration as license_plate, r.name_route as name_route, r.routeway as routeway, bt.departure_day as departure_day, bt.departure_time as departure_time, bt.return_day as return_day, bt.return_time as return_time, bt.id as bustiming_id").
		Joins("JOIN bus_timings bt ON bt.route_id = r.id").
		Joins("JOIN vehicles v ON bt.bus_id = v.id").
		Order("bt.id ASC").
		Scan(&routeMain).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch route data", "details": err.Error()})
		return
	}

	// ส่งข้อมูลในรูปแบบ JSON
	c.JSON(http.StatusOK, routeMain)
}

// /แก้
func GetBusTimingMainByID(c *gin.Context) {
	// ดึง ID จากพารามิเตอร์ที่ส่งมา
	busTimingID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลรวม Route และ BusTimings
	var routeMainByID []struct {
		BusID         uint   `json:"bus_id"`         // ใช้ snake_case ตามที่คุณต้องการใน JSON
		LicensePlate  string `json:"license_plate"`  // ใช้ snake_case สำหรับ LicensePlate
		RouteID       uint   `json:"route_id"`       // เพิ่ม RouteID
		NameRoute     string `json:"name_route"`     // เปลี่ยนจาก Name เป็น NameRoute ตามความต้องการของคุณ
		Routeway      string `json:"routeway"`       // ใช้ snake_case สำหรับ Routeway
		DepartureDay  string `json:"departure_day"`  // ใช้ snake_case สำหรับ DepartureDay
		DepartureTime string `json:"departure_time"` // ใช้ snake_case สำหรับ DepartureTime
		ReturnDay     string `json:"return_day"`     // ใช้ snake_case สำหรับ ReturnDay
		ReturnTime    string `json:"return_time"`    // ใช้ snake_case สำหรับ ReturnTime
		BusTimingID   uint   `json:"bustiming_id"`   // เปลี่ยนเป็น snake_case สำหรับ BusTimingID
	}

	// สร้างการเชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลจากฐานข้อมูลและกรองด้วย BusTimingID
	err := db.Table("routes r").
		Select("v.id as bus_id, v.bus_registration as license_plate, r.id as route_id, r.name_route as name_route, r.routeway as routeway, bt.departure_day as departure_day, bt.departure_time as departure_time, bt.return_day as return_day, bt.return_time as return_time, bt.id as bustiming_id").
		Joins("JOIN bus_timings bt ON bt.route_id = r.id").
		Joins("JOIN vehicles v ON bt.bus_id = v.id"). // เปลี่ยนจาก buses เป็น vehicles
		Where("bt.id = ?", busTimingID).              // กรองด้วย BusTimingID ที่ส่งเข้ามา
		Scan(&routeMainByID).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลในรูปแบบ JSON
	c.JSON(http.StatusOK, routeMainByID)
}

func GetBustimingForUsers(c *gin.Context) {
	// โครงสร้างสำหรับเก็บข้อมูลที่เราต้องการ
	var routeMain []struct {
		BustimingID   uint   `json:"bustiming_id"`   // ชื่อฟิลด์ใน JSON
		NameRoute     string `json:"name_route"`     // ชื่อฟิลด์ใน JSON
		Routeway      string `json:"routeway"`       // ชื่อฟิลด์ใน JSON
		DepartureDay  string `json:"departure_day"`  // ชื่อฟิลด์ใน JSON
		DepartureTime string `json:"departure_time"` // ชื่อฟิลด์ใน JSON
		LicensePlate  string `json:"license_plate"`  // ชื่อฟิลด์ใน JSON
	}

	// สร้างการเชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลจากฐานข้อมูลเฉพาะฟิลด์ที่ต้องการ และเรียงลำดับตาม BusTimingID
	err := db.Table("routes r").
		Select("bt.id as bustiming_id, r.name_route as name_route, r.routeway as routeway, bt.departure_day as departure_day, bt.departure_time as departure_time, v.bus_registration as license_plate").
		Joins("JOIN bus_timings bt ON bt.route_id = r.id").
		Joins("JOIN vehicles v ON bt.bus_id = v.id").
		Order("bt.id ASC").
		Scan(&routeMain).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch route data", "details": err.Error()})
		return
	}

	// ส่งข้อมูลในรูปแบบ JSON
	c.JSON(http.StatusOK, routeMain)
}
