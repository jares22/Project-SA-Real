import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import SideBarUsers from "../../components/SideBarUsers";
import { SeatsInterface } from "../../interfaces/ISeat";
import { confirmSeatBooking, CheckSeatBooks } from "../../services/https/http";
import './SeatSelection.css'; // Import the CSS styles

const SeatSelection: React.FC = () => {
  const location = useLocation();
  const [dataReceived, setDataReceived] = useState<any>(null);
  const [numPassengers, setNumPassengers] = useState<number>(0);
  const [SeatBookValue, setSeatBook] = useState<any>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<Set<number>>(new Set()); // Track occupied seats

  const checkSeatBook = async () => {
    let SeatBookJson = await CheckSeatBooks(dataReceived.bustiming_id);
    console.log('SeatBook', SeatBookJson);
    if (SeatBookJson) {
      setSeatBook(SeatBookJson);
      // Extract seat numbers from the JSON response and update state
      const seatsFromResponse = SeatBookJson.seats.map((seat: string) => parseInt(seat, 10));
      setOccupiedSeats(new Set(seatsFromResponse));
    }
  };

  useEffect(() => {
    if (location.state) {
      setDataReceived(location.state);
      setNumPassengers(location.state.num_passenger || 0);
    }
  }, [location.state]);

  useEffect(() => {
    if (dataReceived) {
      checkSeatBook();
      console.log('dataReceived = ', dataReceived);
      console.log('dataReceivedPassenger = ', dataReceived.num_passenger);
    }
  }, [dataReceived]);

  const [seats, setSeats] = useState<SeatsInterface[]>(
    Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      seatNumber: `Seat ${index + 1}`,
      isOccupied: false,
    }))
  );

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeats((prevSelectedSeats) => {
      const isSelected = prevSelectedSeats.includes(seatId);
      const canSelectMore = !isSelected && selectedSeats.length < numPassengers;

      if (isSelected) {
        console.log(`Seat ${seatId} deselected.`);
        return prevSelectedSeats.filter((id) => id !== seatId);
      } else if (canSelectMore) {
        console.log(`Seat ${seatId} selected.`);
        return [...prevSelectedSeats, seatId];
      } else {
        console.log('Cannot select more seats than the number of passengers.');
        return prevSelectedSeats;
      }
    });
  };

  const markSeatsAsBooked = (seatIds: number[]) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seatIds.includes(seat.id) ? { ...seat, isOccupied: true } : seat
      )
    );
  };

  useEffect(() => {
    console.log('Current selected seats:', selectedSeats);
  }, [selectedSeats]);

  const handleConfirm = async () => {
    if (selectedSeats.length === numPassengers) {
      console.log('Seats confirmed:', selectedSeats);
      const response = await confirmSeatBooking(selectedSeats);

      if (response.success) {
        console.log('Booking confirmed by backend.');
        markSeatsAsBooked(selectedSeats);
        navigate('/user/PassengerCreate', { state: { selectedSeats, dataReceived } });
      } else {
        console.log('Booking failed.');
      }
    } else {
      console.log('Please select the correct number of seats.');
    }
  };

  const generateGridCells = (seats: SeatsInterface[]): JSX.Element[] => {
    const cells: JSX.Element[] = [];

    for (let row = 0; row < 9; row++) {  // 9 rows
      const rowCells: JSX.Element[] = [];

      // Left side (3 seats)
      for (let col = 0; col < 3; col++) {
        const seatId = row * 6 + col + 1;  // Calculate seat ID for the left side
        const seat = seats.find(seat => seat.id === seatId);

        if (seat) {
          rowCells.push(
            <div
              key={seat.id}
              className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''} ${occupiedSeats.has(seat.id) ? 'occupied' : ''}`}
              onClick={() => !occupiedSeats.has(seat.id) && handleSeatSelect(seat.id)}
              aria-disabled={occupiedSeats.has(seat.id)}
              aria-label={`Seat ${seat.id} ${occupiedSeats.has(seat.id) ? 'Occupied' : 'Available'}`}
              style={{
                width: '80px', // เพิ่มความกว้างของที่นั่ง
                height: '80px', // เพิ่มความสูงของที่นั่ง
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '10px', // เพิ่มช่องว่างระหว่างที่นั่ง
                padding: '10px', // เพิ่ม padding ภายในกล่องที่นั่ง
                border: '1px solid #ccc', // เพิ่มเส้นขอบบางๆ
                borderRadius: '8px', // ให้มุมกลม
              }}
            >
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className={`seat-avatar ${occupiedSeats.has(seat.id) ? 'occupied' : (selectedSeats.includes(seat.id) ? 'selected' : '')}`}
              />
              <div style={{ marginTop: '5px' }}>{seat.id}</div>
            </div>
          );
        }
      }

      // Add middle space (gap)
      rowCells.push(
        <div key={`spacer-${row}`} className="spacer" />  // This is the gap between left and right
      );

      // Right side (6 seats)
      for (let col = 3; col < 6; col++) {
        const seatId = row * 6 + col + 1;
        const seat = seats.find(seat => seat.id === seatId);

        if (seat) {
          rowCells.push(
            <div
              key={seat.id}
              className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''} ${occupiedSeats.has(seat.id) ? 'occupied' : ''}`}
              onClick={() => !occupiedSeats.has(seat.id) && handleSeatSelect(seat.id)}
              aria-disabled={occupiedSeats.has(seat.id)}
              aria-label={`Seat ${seat.id} ${occupiedSeats.has(seat.id) ? 'Occupied' : 'Available'}`}
              style={{
                width: '80px', // เพิ่มความกว้างของที่นั่ง
                height: '80px', // เพิ่มความสูงของที่นั่ง
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '10px', // เพิ่มช่องว่างระหว่างที่นั่ง
                padding: '10px', // เพิ่ม padding ภายในกล่องที่นั่ง
                border: '1px solid #ccc', // เพิ่มเส้นขอบบางๆ
                borderRadius: '8px', // ให้มุมกลม
              }}
            >
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className={`seat-avatar ${occupiedSeats.has(seat.id) ? 'occupied' : (selectedSeats.includes(seat.id) ? 'selected' : '')}`}
              />
              <div style={{ marginTop: '5px' }}>{seat.id}</div>
            </div>
          );
        }
      }

      cells.push(
        <div key={`row-${row}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          {rowCells}
        </div>
      );
    }

    return cells;
  };

  return (
    <div style={{ backgroundColor: '#14919B', height: '100vh', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <SideBarUsers />
      <div style={{ position: 'relative', width: '1580px', height: '90vh', backgroundColor: '#D9D9D9' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '60px',
          backgroundColor: '#213A57',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <h2 style={{ color: 'white', margin: 0, fontFamily: 'Kanit, sans-serif', fontSize: '28px', letterSpacing: '2px' }}>
            เลือกที่นั่ง
          </h2>
        </div>

        <div style={{ marginTop: '5%', width: '90%', maxWidth: '1000px', marginLeft: '130px', height: '80vh', overflow: 'auto' }}>
          <Card>
            <div className="seat-grid">
              <div style={{ textAlign: 'center'}}>
                  <div style={{fontFamily: 'Kanit, sans-serif', fontSize: '28px'}}>
                  หน้ารถ
                  </div>
                  <hr style={{ width: "70%" }}></hr>
                <Space>
                  <div>
                  <img src="../../public/icon/ladder.png" style={{ width: '110px', marginRight: "10px"}}/>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '320px'}}>
                    <UserOutlined style={{ fontSize: '2vw', color: 'black' }} />
                    <div>พนักงานขับ 2</div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <UserOutlined style={{ fontSize: '2vw', color: 'black' }} />
                    <div>พนักงานขับ 1</div>
                  </div>
                </Space>
              </div>
              <hr style={{ width: "70%" }}></hr>
              {generateGridCells(seats)}
              <hr style={{ width: "70%" }}></hr>
              <div style={{fontFamily: 'Kanit, sans-serif', fontSize: '28px', textAlign: 'center'}}>
                  ท้ายรถ
              </div>
                  
            </div>
          </Card>
        </div>

        <Card style={{ position: 'absolute', right: 20, top: '9.5%', width: 'auto', marginRight: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '20px', color: 'gray' }} />
              <p style={{ margin: 0 }}>Available</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '20px', color: 'red' }} />
              <p style={{ margin: 0 }}>Occupied</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '20px', color: '#87d068' }} />
              <p style={{ margin: 0 }}>Selected</p>
            </div>
          </div>
        </Card>
        
        <Card style={{ position: 'absolute', right: 20, top: '25%', width: 'auto', marginRight: '60px' }}>
          <div>
          <h2>รายละเอียดการเดินทาง</h2>
          <p><b>วันเวลาเดินทางไป :</b>  {dataReceived?.departure_day} ที่ {dataReceived?.datepickerfull}<br/></p>
          <p><b>จุดหมาย :</b>  {dataReceived?.province1} -{'>'} {dataReceived?.province2}<br/></p>
          <p><b>เวลา :</b>  {dataReceived?.departure_time} -{'>'} {dataReceived?.ArrivalTime}<br/></p>
          <p><b>จำนวนผู้โดยสาร :</b>  {dataReceived?.num_passenger} ที่นั่ง<br/></p>
          <p><b>ราคารวม :</b>  {dataReceived?.distance * 1.5 * dataReceived?.num_passenger} บาท<br/></p>
          </div>
        </Card>

        <Space

          style={{ position: 'absolute', top: '60%', right: '20px' }}
        >
          <Button
            htmlType="button" onClick={() => navigate(-1)}
            style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px' }}
          >
            ย้อนกลับ
          </Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={selectedSeats.length !== numPassengers} // ตรวจสอบ length ของ array selectedSeats
            style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px', marginRight: '100px' }}
          >
            ยืนยัน
          </Button>
        </Space>

      </div>
    </div>
  );
};

export default SeatSelection;
