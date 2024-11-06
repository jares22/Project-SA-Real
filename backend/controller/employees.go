package controller

import (
	"SirisakTour/config"
	"SirisakTour/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func ListEmployees(c *gin.Context) {

	var employees []entity.Employees

	db := config.DB()
	results := db.Find(&employees) /*// Get all records    result := db.Find(&users) // SELECT * FROM users;*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)

	//ถ้าการดึงข้อมูลสำเร็จ ฟังก์ชันจะส่ง HTTP 200 (OK)
	//ทำเป็นไฟล์ JSON
	//พร้อมกับ JSON ที่ประกอบด้วยรายการผู้ใช้ที่ถูกเก็บใน users.
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func CreateEmployees(c *gin.Context) {
	var e entity.Employees //ใช้  .(dot) object ต่างๆ เช่น  user.password    user.lastname   สร้างตัวแปร user ที่จะใช้สำหรับเก็บข้อมูลผู้ใช้

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&e); err != nil { //c.ShouldBindJSON(&user) เพื่อแปลงเนื้อหาของคำร้องขอ JSON เป็นออบเจ็กต์ user
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB() //เชื่อมต่อกับฐานข้อมูล:



	// ค้นหา gender ด้วย id
	var gender entity.Gender
	db.First(&gender, e.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

	// สร้าง User
	u := entity.Employees{
		Username:    e.Username,
		Password:    e.Password,
		FirstName:   e.FirstName, // ตั้งค่าฟิลด์ FirstName
		LastName:    e.LastName,  // ตั้งค่าฟิลด์ LastName
		PhoneNumber: e.PhoneNumber,
		Position:    e.Position,
		Address:     e.Address,
		GenderID:    e.GenderID,
		Gender:      gender, // โยงความสัมพันธ์กับ Entity Gender

	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u}) //ส่งการตอบกลับด้วยสถานะ 201 (Created) และข้อมูลที่ถูกสร้าง (ออบเจ็กต์ u) ในรูปแบบ JSON
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GetListEmployees ฟังก์ชั่นที่เกี่ยวกับการนำข้อมูลไปเเสดงที่ drop dawn
func GetListEmployees(c *gin.Context) {

	type EmployeeResponse struct {
		EmployeeID  int    `json:"EmployeeID"`
		FirstName   string `json:"FirstName"`
		LastName    string `json:"LastName"`
		PhoneNumber string `json:"PhoneNumber"`
		Position    string `json:"Position"`
	}

	var employees []entity.Employees
	var employeeResponses []EmployeeResponse

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// ค้นหาข้อมูลพนักงานทั้งหมด
	/*ตรง Select อ้างอิงชื่อ column จากใน sql lite*/
	if err := db.Select("id, first_name,last_name,position,phone_number").Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// แปลงข้อมูลพนักงานทั้งหมดให้เป็นโครงสร้าง EmployeeResponse
	for _, emp := range employees {
		employeeResponses = append(employeeResponses, EmployeeResponse{
			EmployeeID:  int(emp.ID),
			FirstName:   emp.FirstName,
			LastName:    emp.LastName,
			PhoneNumber: emp.PhoneNumber,
			Position:    emp.Position,
		})
	}

	// ส่งข้อมูลออกไปในรูปแบบ JSON Array
	c.JSON(http.StatusOK, employeeResponses)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

func DeleteEmployeeByID(c *gin.Context) { //(15)

	id := c.Param("id") //รับ id จาก URL Parameter
	db := config.DB()
	if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 { //
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"}) //tx.RowsAffected เป็นการตรวจสอบว่ามีแถวใดถูกลบหรือไม่   ถ้าค่าของ tx.RowsAffected == 0 หมายความว่าไม่มีแถวใดถูกลบ
		return                                                        //ถ้าไม่มีแถวใดถูกลบ (RowsAffected == 0  ระบบจะส่งการตอบกลับ HTTP 400 (BadRequest) พร้อมกับข้อความ "id not found" เพื่อบอกว่าไม่พบ id ที่ผู้ใช้ต้องการลบ.
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"}) //ถ้าการลบสำเร็จ   ระบบจะส่งการตอบกลับ HTTP 200 (OK) พร้อมกับข้อความ "Deleted successful" เพื่อบอกว่าการลบข้อมูลสำเร็จแล้ว.

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

func GetEmployeeIDForEdit(c *gin.Context) {
	// รับค่า ID จาก URL parameters
	id := c.Param("id")

	// สร้างตัวแปรสำหรับเก็บข้อมูลพนักงาน
	var employee entity.Employees
	DB := config.DB()

	// ค้นหาพนักงานจากฐานข้อมูลโดยใช้ ID
	if err := DB.First(&employee, id).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดหรือไม่เจอพนักงาน จะส่งข้อความ error กลับไป
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลทุกฟิลด์ของ employee ออกในรูปแบบ JSON (ไม่รวม Drivers)
	response := gin.H{
		"EmployeeID":  employee.ID,
		"Username":    employee.Username,
		"Password":    employee.Password,
		"FirstName":   employee.FirstName,
		"LastName":    employee.LastName,
		"PhoneNumber": employee.PhoneNumber,
		"Position":    employee.Position,
		"Address":     employee.Address,
		"GenderID":    employee.GenderID,
		 /*ด้านซ้ายตรงส่งข้อมูลออก หัวข้อ Json*/
	}

	// ส่งข้อมูลออกในรูปแบบ JSON
	c.JSON(http.StatusOK, response)
}

func UpdateEmployee(c *gin.Context) {
	// รับข้อมูลจาก request body
	var input struct {

		Username    string `json:"Username"`                    
		Password    string `json:"Password"`                 
		FirstName   string `json:"FirstName"`
		LastName    string `json:"LastName"`
		PhoneNumber string `json:"PhoneNumber"`
		Position    string `json:"Position"`
		Address     string `json:"Address"`
		GenderID    uint   `json:"GenderID"`
		EmployeeID  uint   `json:"EmployeeID"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := config.DB()

	// ค้นหาพนักงานที่มี ID ตรงกับที่ระบุ
	var employee entity.Employees
	if err := DB.First(&employee, input.EmployeeID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูลพนักงาน
	employee.Username      = input.Username
	employee.Password      = input.Password
	employee.FirstName     = input.FirstName
	employee.LastName      = input.LastName
	employee.PhoneNumber   = input.PhoneNumber
	employee.Position      = input.Position
	employee.Address       = input.Address
	employee.GenderID      = input.GenderID

	if err := DB.Save(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่อัปเดตแล้วกลับไป
	c.JSON(http.StatusOK, employee)
}





