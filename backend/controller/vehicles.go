package controller

import (
	"SirisakTour/config"
	"SirisakTour/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ListVehicles(c *gin.Context) {

	var vehicles []entity.Vehicles

	db := config.DB()
	results := db.Find(&vehicles) /*// Get all records    result := db.Find(&users)
	// SELECT * FROM users;*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, vehicles)

	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func CreateVehicles(c *gin.Context) {
	var v entity.Vehicles    //ใช้  .(dot) object ต่างๆ เช่น  user.password    user.lastname   สร้างตัวแปร user ที่จะใช้สำหรับเก็บข้อมูลผู้ใช้

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&v); err != nil { //c.ShouldBindJSON(&user) เพื่อแปลงเนื้อหาของคำร้องขอ JSON เป็นออบเจ็กต์ user
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB() //เชื่อมต่อกับฐานข้อมูล:

	// สร้าง User
	u := entity.Vehicles{
		Type:            v.Type,            // ตั้งค่าฟิลด์ FirstName
		BusRegistration: v.BusRegistration, // ตั้งค่าฟิลด์ LastName
		Brand:           v.Brand,
		Series:          v.Series,
		Year:            v.Year,
		EngineAndPower:  v.EngineAndPower,
		FuelTank:        v.FuelTank,
		Seat:            v.Seat,
	}
	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u}) //ส่งการตอบกลับด้วยสถานะ 201 (Created) และข้อมูลที่ถูกสร้าง (ออบเจ็กต์ u) ในรูปแบบ JSON
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// เป็ยฟังชั่นที่เกี่ยวกับการนำข้อมูลไปเเสดงบน drop dawn
func GetListBus(c *gin.Context) {
	type BusResponse struct {
		BusID           uint   `json:"BusID"`           /*ให้ตรงกับ interface เเล้วจะใช้ง่ายขึ้น*/
		Type            string `json:"Type"`
		BusRegistration string `json:"BusRegistration"`
		Series          string `json:"Series"`
		Year            int    `json:"Year"`
		Brand           string `json:"Brand"`
		Seat            int    `json:"Seat"`
	}

	var buses []entity.Vehicles
	var busResponses []BusResponse

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// ค้นหาข้อมูลรถทั้งหมด
	if err := db.Select("id,type, bus_registration,brand,seat").Find(&buses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// แปลงข้อมูลรถทั้งหมดให้เป็นโครงสร้าง BusResponse
	for _, bus := range buses {
		busResponses = append(busResponses, BusResponse{
			BusID:           bus.ID,
			Type:            bus.Type,
			BusRegistration: bus.BusRegistration,
			Series:          bus.Series,
			Year:            int(bus.Year),
			Brand:           bus.Brand,
			Seat:            int(bus.Seat),
		})
	}

	// ส่งข้อมูลออกไปในรูปแบบ JSON Array
	c.JSON(http.StatusOK, busResponses)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func DeleteVehicleByID(c *gin.Context) { //(15)

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM vehicles WHERE id = ?", id); tx.RowsAffected == 0 { //
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"}) //tx.RowsAffected เป็นการตรวจสอบว่ามีแถวใดถูกลบหรือไม่   ถ้าค่าของ tx.RowsAffected == 0 หมายความว่าไม่มีแถวใดถูกลบ
		return                                                        //ถ้าไม่มีแถวใดถูกลบ (RowsAffected == 0  ระบบจะส่งการตอบกลับ HTTP 400 (BadRequest) พร้อมกับข้อความ "id not found" เพื่อบอกว่าไม่พบ id ที่ผู้ใช้ต้องการลบ.
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"}) //ถ้าการลบสำเร็จ   ระบบจะส่งการตอบกลับ HTTP 200 (OK) พร้อมกับข้อความ "Deleted successful" เพื่อบอกว่าการลบข้อมูลสำเร็จแล้ว.

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func GetVehicleIDForEdit(c *gin.Context) {
	// รับค่า ID จาก URL parameters
	id := c.Param("id")

	// สร้างตัวแปรสำหรับเก็บข้อมูลพนักงาน
	var vehicle entity.Vehicles
	DB := config.DB()

	// ค้นหาพนักงานจากฐานข้อมูลโดยใช้ ID
	if err := DB.First(&vehicle, id).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดหรือไม่เจอพนักงาน จะส่งข้อความ error กลับไป
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลทุกฟิลด์ของ employee ออกในรูปแบบ JSON (ไม่รวม Drivers)
	response := gin.H{
		"BusID":              vehicle.ID,
		"Type":            vehicle.Type,
		"BusRegistration": vehicle.BusRegistration,
		"Brand":           vehicle.Brand,
		"Series":          vehicle.Series,
		"Year":            vehicle.Year,
		"EngineAndPower":  vehicle.EngineAndPower,
		"FuelTank":        vehicle.FuelTank,
		"Seat":            vehicle.Seat, /*ด้านซ้ายตรงส่งข้อมูลออก หัวข้อ Json*/
	}

	// ส่งข้อมูลออกในรูปแบบ JSON
	c.JSON(http.StatusOK, response)
}

func UpdateVehicle(c *gin.Context) {
	// รับข้อมูลจาก request body
	var input struct {
		Type            string `json:"Type"`
		BusRegistration string `json:"BusRegistration"`
		Brand           string `json:"Brand"`
		Series          string `json:"Series"`
		Year            int    `json:"Year"`
		EngineAndPower  string `json:"EngineAndPower"`
		FuelTank        int    `json:"FuelTank"`
		Seat            int    `json:"Seat"`
		VehicleID       uint   `json:"vehicleID"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := config.DB()

	// ค้นหาพนักงานที่มี ID ตรงกับที่ระบุ
	var vehicle entity.Vehicles
	if err := DB.First(&vehicle, input.VehicleID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูลพนักงาน
	vehicle.Type            = input.Type
	vehicle.BusRegistration = input.BusRegistration
	vehicle.Brand           = input.Brand
	vehicle.Series          = input.Series
	vehicle.Year            = int32(input.Year)          // แปลง int เป็น int32
	vehicle.EngineAndPower  = input.EngineAndPower
	vehicle.FuelTank        = int32(input.FuelTank)      // แปลง int เป็น int32
	vehicle.Seat            = int32(input.Seat)          // แปลง int เป็น int32

	if err := DB.Save(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่อัปเดตแล้วกลับไป
	c.JSON(http.StatusOK, vehicle)
}
