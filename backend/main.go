package main

import (
	"SirisakTour/config"
	"SirisakTour/controller"
	"net/http"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("/")
	{
		router.POST("/register", controller.AddAccount)
		router.POST("/login", controller.AddLogin)
		router.GET("/nameuserbyid/:id", controller.GetNameUserByID)

		/*Aut Admin*/
		router.GET("/listvehicleformanageroute", controller.ListAllVehicleForManageRoute)
		router.GET("/route", controller.ListAllroute)
		router.POST("/bustiming", controller.FormAddToBusTiming)              //กรอกฟอร์มแล้วเข้า  database
		router.GET("/listRouteMainManage", controller.GetListRouteManageMain) //แสดงค่าที่ตารางกลาง aut admin
		router.DELETE("/busTiming/:id", controller.DeleteBusTiming)           //ใช้ตอนแก้ไข
		router.GET("/bustimingMain/:id", controller.GetBusTimingMainByID)     //ใช้ตอนแก้ไข
		router.PATCH("/updatebustimingid", controller.UpdateBusTimingID)      //ใช้ตอนดึงข้อมูลอัพเดต

		/*Add User*/
		router.GET("/listdeparture", controller.GetListDeparture)
		router.GET("/listdestination", controller.GetListDestination)
		router.POST("/usersearchticket", controller.UserSearchTicket)
		router.GET("/getbustimingforusers", controller.GetBustimingForUsers)

		/*Dew*/
		router.GET("/ListVehicles", controller.ListVehicles) /*เกี่ยวกับการดึงข้อมูลในฐานข้อมูลไปโชว์ในตาราง*/
		router.GET("/ListEmployees", controller.ListEmployees)
		router.GET("/ListDrivers", controller.ListDrivers)
		router.POST("/CreateEmployees", controller.CreateEmployees)
		router.POST("/CreateVehicles", controller.CreateVehicles)
		router.POST("/CreateDrivers", controller.CreateDrivers)
		router.GET("/getlistemployees", controller.GetListEmployees) /*เกี่ยวกับข้อมูลใน drop dawn*/
		router.GET("/getlistbus", controller.GetListBus)
		router.GET("/genders", controller.ListGenders) /*เกี่ยวกับ drop dawn เพศ*/
		router.DELETE("/deletevehicleby/:id", controller.DeleteVehicleByID)
		router.DELETE("/deleteemployeeby/:id", controller.DeleteEmployeeByID)
		router.DELETE("/deletedriverby/:id", controller.DeleteDriverByID)

		router.GET("/getEmployeeIDForEdit/:id", controller.GetEmployeeIDForEdit) /* เกี่ยวกับการเเก้ไข */
		router.PATCH("/UpdateEmployeeID", controller.UpdateEmployee)

		router.GET("/getVehicleIDForEdit/:id", controller.GetVehicleIDForEdit) /* เกี่ยวกับการเเก้ไข */
		router.PATCH("/UpdateVehicleID", controller.UpdateVehicle)

		router.GET("/getDriverIDForEdit/:id", controller.GetDriverIDForEdit) /* เกี่ยวกับการเเก้ไข */
		router.PATCH("/UpdateDriverID", controller.UpdateDriver)

		/*palm*/
		//router.POST("/users", controller.CreatePassenger)
		router.GET("/seatbooking", controller.GetSeatBooking)
		// r.GET("/seats/:id", controller.GetSeats)
		// r.PATCH("/seats/:id", controller.UpdateSeat)

		/*JO*/
		//r.GET("/payments", controller.ListPayment)
		r.GET("/payment/:id", controller.GetPayment)
		r.POST("/payments", controller.CreatePayment)
		r.DELETE("/payments/:id", controller.DeletePayment)
		r.GET("/lastpaymentid", controller.GetlastpaymentID) // main.go
		r.GET("/paymentspass/:id", controller.GetPaymentsWithStatusPass)
		r.GET("/paymentsjoin", controller.GetPaymentsWithPassengers_Foradmin)
		r.GET("/paymentsjoin/:id", controller.GetPaymentsWithPassengers)
		r.POST("/passsenger", controller.CreatePassenger)
		r.PATCH("/payments", controller.UpdatePayment)
		//r.PATCH("/paymentedit/:id", controller.PaymentEdit)
		//r.PATCH("/passengeredit/:id", controller.PassengerEdit)

		/*OHM*/
		router.POST("/verify-ticket", controller.VerifyTicket)
		router.PATCH("/update-seat-status", controller.UpdateSeatStatus)
		r.GET("/bus-rounds", controller.GetBusRounds)
		r.GET("/verifiers", controller.GetVerifiers)
		router.POST("/ticket-verify", controller.TicketVerification)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server

	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}





