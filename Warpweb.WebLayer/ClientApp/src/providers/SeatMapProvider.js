import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const SeatMapContext = React.createContext();

const SeatMapProvider = ({ children }) => {

    const [rows, setRows] = useState([]);
    const [userUpcomingTickets, setUserUpcomingTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const { isAuthenticated, token } = useAuth();
    const [errors, setErrors] = useState("");

    const getSeatMap = async (mainEventId) => {

        if (isAuthenticated) {
            const responseSeatMap = await fetch(`/api/seatmap/publicseatmap/${mainEventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            if (responseSeatMap.ok) {
                setRows(await responseSeatMap.json());
            }
            
            else {
                const error = await responseSeatMap.json(); 
                setErrors(error.message);
            }
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

    const reserveSeat = async (seatId) => {
        if (isAuthenticated) {

            const ticket = userUpcomingTickets.find(t => t.id === activeTicket);

            const ticketUpdateResponse = await fetch(`/api/tickets/reserveseat/${ticket.id}/${seatId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST'
            });

            if (ticketUpdateResponse.ok) {
                setActiveTicket(null);
                getUserTicketsForUpcomingEvents();
            }
        }
    }

    return <SeatMapContext.Provider value={{ errors, reserveSeat, setActiveTicket, getSeatMap, rows, getUserTicketsForUpcomingEvents, userUpcomingTickets }}>{children}</SeatMapContext.Provider>;

};

export default SeatMapProvider;