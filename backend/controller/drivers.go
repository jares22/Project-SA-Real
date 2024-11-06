package controller

import (
	"net/http"
	"SirisakTour/config"
	"SirisakTour/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ListDrivers(c *gin.Context) {

	var drivers []entity.Drivers

	db := config.DB()
	results := db.Find(&drivers)  /*// Get all records    result := db.Find(&users) // SELECT * FROM users;*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, drivers) 
	
	//ถ้าการดึงข้อมูลสำเร็จ ฟังก์ชันจะส่ง HTTP 200 (OK)
	//ทำเป็นไฟล์ JSON
	//พร้อมกับ JSON ที่ประกอบด้วยรายการผู้ใช้ที่ถูกเก็บใน users.
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func CreateDrivers(c *gin.Context) {
	var d entity.Drivers  //ใช้  .(dot) object ต่างๆ เช่น  user.password    user.lastname   สร้างตัวแปร user ที่จะใช้สำหรับเก็บข้อมูลผู้ใช้

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&d); err != nil { //c.ShouldBindJSON(&user) เพื่อแปลงเนื้อหาของคำร้องขอ JSON เป็นออบเจ็กต์ user
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB() //เชื่อมต่อกับฐานข้อมูล:

	// สร้าง User
	u := entity.Drivers{
		EmployeeID: d.EmployeeID, // ตั้งค่าฟิลด์ FirstName
		BusID:      d.BusID,      // ตั้งค่าฟิลด์ LastName
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u}) //ส่งการตอบกลับด้วยสถานะ 201 (Created) และข้อมูลที่ถูกสร้าง (ออบเจ็กต์ u) ในรูปแบบ JSON
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

func DeleteDriverByID(c *gin.Context) {  //(15)

	id := c.Param("id")  //รับ id จาก URL Parameter
	db := config.DB()
	if tx := db.Exec("DELETE FROM drivers WHERE id = ?", id); tx.RowsAffected == 0 {  //
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})    //tx.RowsAffected เป็นการตรวจสอบว่ามีแถวใดถูกลบหรือไม่   ถ้าค่าของ tx.RowsAffected == 0 หมายความว่าไม่มีแถวใดถูกลบ
		return                                                           //ถ้าไม่มีแถวใดถูกลบ (RowsAffected == 0  ระบบจะส่งการตอบกลับ HTTP 400 (BadRequest) พร้อมกับข้อความ "id not found" เพื่อบอกว่าไม่พบ id ที่ผู้ใช้ต้องการลบ.
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})   //ถ้าการลบสำเร็จ   ระบบจะส่งการตอบกลับ HTTP 200 (OK) พร้อมกับข้อความ "Deleted successful" เพื่อบอกว่าการลบข้อมูลสำเร็จแล้ว.

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

func GetDriverIDForEdit(c *gin.Context) {
	// รับค่า ID จาก URL parameters
	id := c.Param("id")

	// สร้างตัวแปรสำหรับเก็บข้อมูลพนักงาน
	var driver entity.Drivers
	DB := config.DB()

	// ค้นหาพนักงานจากฐานข้อมูลโดยใช้ ID
	if err := DB.First(&driver, id).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดหรือไม่เจอพนักงาน จะส่งข้อความ error กลับไป
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลทุกฟิลด์ของ driver ออกในรูปแบบ JSON
	response := gin.H{
		"DriverID":        driver.ID,
		"EmployeeID":      driver.EmployeeID,
		"BusID":           driver.BusID,
	}

	// ส่งข้อมูลออกในรูปแบบ JSON
	c.JSON(http.StatusOK, response)
}

func UpdateDriver(c *gin.Context) {
    // รับข้อมูลจาก request body
    var input struct {
        EmployeeID uint  `json:"EmployeeID"`
        BusID      uint  `json:"BusID"`
        ID         uint  `json:"DriverID"` // ใช้ ID แทน driverID
    }

    // ตรวจสอบว่าการรับข้อมูลจาก request body สำเร็จหรือไม่
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    DB := config.DB()

    // ค้นหาพนักงานที่มี ID ตรงกับที่ระบุ
    var driver entity.Drivers
    if err := DB.First(&driver, input.ID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // อัปเดตข้อมูลพนักงาน
    driver.EmployeeID  = input.EmployeeID
    driver.BusID       = input.BusID

    // ตรวจสอบว่าการบันทึกข้อมูลสำเร็จหรือไม่
    if err := DB.Save(&driver).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งข้อมูลที่อัปเดตแล้วกลับไป
    c.JSON(http.StatusOK, gin.H{
        "message": "อัปเดตข้อมูลสำเร็จ",
        "driver":  driver,
    })
}




