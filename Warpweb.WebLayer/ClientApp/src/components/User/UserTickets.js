import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(1),
            margin: 20,
            maxWidth: 650,
        },
    }),
);

export default function TicketList() {

    const [userTicketList, setUserTicketList] = useState([]);
    const { isAuthenticated, token } = useAuth();

    const classes = useStyles();

    useEffect(() => {
        const getUserTickets = async () => {
            if (isAuthenticated) {

                const response = await fetch('/api/tickets/usertickets', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setUserTicketList(result);
                }
                else {
                    setUserTicketList([]);
                }
            }
        }

        getUserTickets();
    }, [isAuthenticated])

    return (
        <Paper className={classes.root} elevation={3}>
            
            <TableContainer >
                <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                    Dine billetter:
                </Typography>
                <Table aria-label="Billett tabell">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Billettnr.</TableCell>
                            <TableCell align="left">Arrangement</TableCell>
                            <TableCell align="left">Billettype</TableCell>
                            <TableCell align="left">Seterad</TableCell>
                            <TableCell align="left">Setenr.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userTicketList.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell align="left">{ticket.id}</TableCell>
                                <TableCell align="left">{ticket.mainEventName}</TableCell>
                                <TableCell align="left">{ticket.ticketType}</TableCell>
                                <TableCell align="left">{ticket.rowName}</TableCell>
                                <TableCell align="left">{ticket.seatNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
