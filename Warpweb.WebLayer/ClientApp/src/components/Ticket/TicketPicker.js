import { Button, CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import TicketTypeListRow from './TicketTypeListRow';

export default function TicketPicker({ eventId, handleFinalSelectedTicketTypes }) {

    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        handleFinalSelectedTicketTypes(ticketTypesList);
    }, [ticketTypesList])

    useEffect(() => {
        const getTicketTypes = async () => {
            const ticketTypesResponse = await fetch(`/api/tickettypes/eventtickettypes/${eventId}`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const ticketTypesResult = await ticketTypesResponse.json();
            setTicketTypesList(ticketTypesResult);
        }
        setIsReady(true);
        getTicketTypes();
    }, [])

    const handleSelectedTickets = (amount, id) => {
        const ticketType = ticketTypesList.find(a => a.id === id);
        ticketType.amountToBuy = amount;
        setTicketTypesList(oldValue => [...oldValue.filter(a => a.id !== id), ticketType]);
    }

    const sortFunction = (a, b) => {
        if (a.basePrice === b.basePrice) {
            const c = a.descriptionName.toLowerCase(), d = b.descriptionName.toLowerCase();

            return c < d ? -1 : c > d ? 1 : 0;
        }
        return b.basePrice - a.basePrice;
    }

    return (
        <>

            {isReady ?
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Navn
                        </TableCell>
                            <TableCell>
                                Pris
                        </TableCell>
                            <TableCell>
                                Tilgjengelighet
                        </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <>
                            {ticketTypesList.sort(sortFunction).map((ticketType) => (
                                <TicketTypeListRow {...ticketType} key={ticketType.id} handleSelectedTickets={handleSelectedTickets} />
                            ))
                            }
                        </>

                    </TableBody>
                    <TableFooter>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{float: "right"}}
                        >
                            Bekreft
                        </Button>
                    </TableFooter>
                </Table>
                : <CircularProgress />}
        </>

    )
}