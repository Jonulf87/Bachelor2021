import React, { useState, useEffect } from 'react';
import CurrentEventProvider from '../../providers/CurrentEventProvider';
import useCurrentEvent from '../../hooks/useCurrentEvent';

import {
    Card,
    Divider, 
    Drawer, 
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
 } from '@material-ui/core';


 function createData(name, basePrice, amountAvailable) {
    return {name, basePrice, amountAvailable};
}

const rows = [
    createData('Ukespass | EarlyBird',599,100),
    createData('Ukespass | Forhåndskjøp',599,300),
    createData('Ukespass | Kjøp under arrangement',599,300),
    createData('Ukespass | Hele uken',100,100),
    createData('VeteranGamer',849,300)   
];

 export default function EventInfo() {
    const [event, setEvent] = useState([]);
    const [ticketTypeList, setTicketTypeList] = useState(rows)
    const [isReady, setIsReady] = useState(false);
    const { currentEvent } = useCurrentEvent();

    useEffect(() => {
        console.log(event)
    })

    useEffect(() => {
        const getEvent = async () => {

            const response = await fetch('/api/events/1');
            const result = await response.json();
            setEvent(result);
            setIsReady(true);
        }

        getEvent();

    }, []);

    function TicketTypeTable() {
        return(
            <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Billettype</TableCell>
                                    <TableCell>Pris</TableCell>
                                    <TableCell>Tilgjengelighet</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketTypeList.map((ticketType) => (
                                    <TableRow>
                                        <TableCell>
                                            {ticketType.name}
                                        </TableCell>
                                        <TableCell>
                                            {ticketType.basePrice}
                                        </TableCell>
                                        <TableCell>
                                            {ticketType.amountAvailable}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
            </TableContainer>
        )
    }

    
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} >
                    {JSON.stringify(event)}
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <Typography variant="h4" component="h2" >Informasjon</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h3" >
                        Billetter
                    </Typography>
                    <Typography variant="h7">
                        Kjøp meg
                    </Typography>
                </Grid>
            </Grid>
        </>

    );
}
