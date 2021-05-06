import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const SeatMapContext = React.createContext();

const SeatMapProvider = ({ children }) => {

    const [rows, setRows] = useState([]);
    const [userUpcomingTickets, setUserUpcomingTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const { isAuthenticated, token } = useAuth();

    const getSeatMap = async () => {

        if (isAuthenticated) {
            const responseSeatMap = await fetch('/api/seatmap/publicseatmap', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            setRows(await responseSeatMap.json());
        }

    }

    const getUserTicketsForUpcomingEvents = async () => {
        if (isAuthenticated) {
            const responseTickets = await fetch('/api/tickets/userticketsupcoming', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            setUserUpcomingTickets(await responseTickets.json());
        }
    }

    const reserveSeat = async (seatNumber, rowName) => {
        if (isAuthenticated) {

            const ticket = userUpcomingTickets.find(t => t.id === activeTicket);

            ticket.rowName = rowName;
            ticket.seatNumber = seatNumber;

            const ticketUpdateResponse = await fetch('/api/tickets/setseatnumber', {
                headers: {
                    'Authentication': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(ticket)
            });

            if (ticketUpdateResponse.ok) {
                setActiveTicket(null);
                getUserTicketsForUpcomingEvents();
            }
        }
    }

    return <SeatMapContext.Provider value={{ setActiveTicket, getSeatMap, rows, getUserTicketsForUpcomingEvents, userUpcomingTickets }}>{children}</SeatMapContext.Provider>;

};

export default SeatMapProvider;