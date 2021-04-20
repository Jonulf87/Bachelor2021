import { CircularProgress, TableCell, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function TicketTypeAdminRowDetails({ rowData, rowMeta }) {

    const [ticketType, setTicketType] = useState(null);
    const ticketTypeId = rowData[0]

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getTicketType = async () => {
            if (isAuthenticated) {
                const responseTicketType = await fetch(`/api/tickettypes/type/${ticketTypeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultTicketType = await responseTicketType.json();
                setTicketType(resultTicketType);
            }
        }
        getTicketType();

    }, [isAuthenticated])

    if (ticketType === null) return (<TableRow><TableCell colSpan={4}><CircularProgress /></TableCell></TableRow>)

    return (
        <>
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    Navn:
                </TableCell>
                <TableCell colSpan={1}>
                    {ticketType.descriptionName}
                </TableCell>
                
            </TableRow>
        </>
    )
}