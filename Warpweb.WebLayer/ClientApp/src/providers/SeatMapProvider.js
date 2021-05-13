import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const SeatMapContext = React.createContext();

const SeatMapProvider = ({ children }) => {
    const [rows, setRows] = useState([]);
    const [userUpcomingTickets, setUserUpcomingTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const { isAuthenticated, token } = useAuth();
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState();
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const getSeatMap = async () => {
        if (isAuthenticated) {
            const responseSeatMap = await fetch(`/api/seatmap/publicseatmap`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            if (responseSeatMap.ok) {
                setRows(await responseSeatMap.json());
            } else if (responseSeatMap.status === 400) {
                setRows([]);
                const errorResult = await responseSeatMap.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                setRows([]);
                const errorResult = await responseSeatMap.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    const getUserTicketsForUpcomingEvents = async () => {
        if (isAuthenticated) {
            const responseTickets = await fetch('/api/tickets/userticketsupcoming', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            if (responseTickets.ok) {
                setUserUpcomingTickets(await responseTickets.json());
            } else if (responseTickets.status === 400) {
                setUserUpcomingTickets([]);
                const errorResult = await responseTickets.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                setUserUpcomingTickets([]);
                const errorResult = await responseTickets.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    const reserveSeat = async (seatId) => {
        if (isAuthenticated) {
            const ticket = userUpcomingTickets.find((t) => t.id === activeTicket);

            const ticketUpdateResponse = await fetch(`/api/tickets/reserveseat/${ticket.id}/${seatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
            });
            if (ticketUpdateResponse.ok) {
                getUserTicketsForUpcomingEvents();
                getSeatMap();
            } else if (ticketUpdateResponse.status === 400) {
                const errorResult = await ticketUpdateResponse.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await ticketUpdateResponse.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    const getActiveTicket = () => {
        return userUpcomingTickets.find((a) => a.id === activeTicket);
    };

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    return (
        <SeatMapContext.Provider
            value={{
                handleErrorDialogClose,
                errorDialogOpen,
                getActiveTicket,
                errors,
                setErrors,
                error,
                setError,
                reserveSeat,
                setActiveTicket,
                getSeatMap,
                rows,
                getUserTicketsForUpcomingEvents,
                userUpcomingTickets,
                setUserUpcomingTickets,
                setRows,
            }}
        >
            {children}
        </SeatMapContext.Provider>
    );
};

export default SeatMapProvider;
