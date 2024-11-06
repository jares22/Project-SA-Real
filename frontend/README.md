go mod init ...ชื่อโมดูล...

go get -u github.com/gin-gonic/gin
หรือ
ตรวจสอบเวอร์ชันของ gin ที่รองรับ Go รุ่นของคุณ
go list -m -versions github.com/gin-gonic/gin
ใช้เวอร์ชันที่เข้ากันได้
go get github.com/gin-gonic/gin@<version>
เช่น -->>
go get github.com/gin-gonic/gin@v1.10.0

go get -u gorm.io/gorm

go get -u gorm.io/driver/sqlite

go get -u github.com/dgrijalva/jwt-go   

go get -u golang.org/x/crypto@v0.16.0


***************************************************************************************************************************
--ลงตามนี้ ใช้ react@17.x.x React Version 17.X.X เพราะ react-qr-reader เวอร์ชัน 3.0.0-beta-1 ต้องการ react เวอร์ชัน 16 หรือ 17 เท่านั้น
npm install react@17 react-dom@17

จะได้
-node_modules
-package-lock.json
-package.json

แล้วค่อย ติดตั้ง react-qr-reader
npm install react-qr-reader

npm run dev ได้เลย
----------------------------------------------------------------------------------------------------------------------

ติดตั้ง react-router-dom
npm install react-router-dom

ติดตั้ง antd
npm install antd


ติดตั้ง moment
npm install moment


ติดตั้งaxios
npm install axios

ติดตั้ง promptpay
npm install promptpay-qr


ติดตั้ง dropzone
npm install react-dropzone


ติดตั้ง vite
npm create vite@latest


npm install react-qr-reader --legacy-peer-deps



npm install --legacy-peer-deps

 npm install qrcode.react --force