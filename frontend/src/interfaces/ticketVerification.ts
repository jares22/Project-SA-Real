// TicketVerification represents the structure for ticket verification data
export interface TicketVerification {
    //[x: string]: string;
    bus_id: number;
    passenger_id: number;
    phone_number: string;
    status: string;
    pass_ticket: string; 
    bustiming_id?: number;
    departure_day?: string;
    departure_time?: string;
}

// TicketVerificationResponse represents the response structure for ticket verification
export interface TicketVerificationResponse {
    isValid: boolean;
    pass_ticket?: string;
    seatStatus?: string;
    message?: string;
}


// UpdateSeatStatusRequest represents the request body for updating seat status
export interface UpdateSeatStatusRequest {
    pass_ticket: string;
    Status: string;
}

// src/interfaces/Ticket.ts

  
export interface CreateTicketVerification {
    //[x: string]: string;
    passenger_id: number;
    driver_id: number;
    status: string;
}
