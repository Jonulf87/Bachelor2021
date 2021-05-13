import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useCurrentEvent from '../hooks/useCurrentEvent';

export const SeatMapAdminContext = React.createContext();

const SeatMapAdminProvider = ({ children }) => {

    const [rows, setRows] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [rowName, setRowName] = useState("");
    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [error, setError] = useState(null);

    const { currentEvent } = useCurrentEvent();

    const gridSize = 20;

    const { isAuthenticated, token } = useAuth();

    const updateRowPosition = (name, xPos, yPos) => {
        const row = rows.find(r => r.rowName === name);
        row.xPos = xPos;
        row.yPos = yPos;
        setRows(oldValue => [...oldValue.filter(r => r.rowName !== name), row])
    }

    const addRow = () => {
        if (numberOfSeats == "") return;
        if (rowName == "") return;
        if (rowNameAlreadyExists()) {
            setError("Rad med dette navnet eksisterer allerede.");
            return;
        }
        setError(null);

        const seats = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            seats.push({
                seatNumber: i
            })
        }

        const row = {
            numberOfSeats: numberOfSeats,
            xPos: 0,
            yPos: 0,
            isVertical: false,
            rowName: rowName,
            seats: seats,
            ticketTypeIds: []
        }

        setRows(oldValue => [...oldValue, row]);
    }

    const updateRowData = (oldRowName, newRowName, newNumberOfSeats, newTicketTypeIds) => {
        const oldArrayWithoutEditedRow = [...rows.filter(r => r.rowName !== oldRowName)];
        const row = rows.find(r => r.rowName === oldRowName);
        const oldNumberOfSeats = row.numberOfSeats;

        row.rowName = newRowName;
        row.numberOfSeats = newNumberOfSeats;
        row.ticketTypeIds = newTicketTypeIds;

        if (oldNumberOfSeats > newNumberOfSeats) {
            row.seats = row.seats.slice(0, newNumberOfSeats);
        }
        else if (oldNumberOfSeats < newNumberOfSeats) {
            for (let i = oldNumberOfSeats; i < newNumberOfSeats; i++) {
                row.seats.push({
                    seatNumber: i + 1
                });
            }
        }
        oldArrayWithoutEditedRow.push(row);
        setRows(oldArrayWithoutEditedRow);
        //setRows(oldValue => [...oldValue.filter(r => r.rowName !== oldRowName), row])
    }

    const submitRows = async () => {
        if (isAuthenticated) {
            await fetch('/api/seatmap/storeseatmap', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(rows)
            });
        }
    }

    const getSeatMap = async () => {

        if (isAuthenticated) {
            const responseSeatMap = await fetch('/api/seatmap/getseatmap', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            setRows(await responseSeatMap.json());

            const responseTicketTypes = await fetch('/api/tickettypes/tickettypes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            setTicketTypes(await responseTicketTypes.json());
        }
    }


    const rowNameAlreadyExists = () => {
        return rows.some(a => a.rowName.toLowerCase() === rowName.toLowerCase());
    }

    return <SeatMapAdminContext.Provider value={{ setRows, getSeatMap, rows, error, gridSize, numberOfSeats, rowName, setNumberOfSeats, setRowName, ticketTypes, rowNameAlreadyExists, submitRows, addRow, updateRowPosition, updateRowData }}>{children}</SeatMapAdminContext.Provider>;

};

export default SeatMapAdminProvider;