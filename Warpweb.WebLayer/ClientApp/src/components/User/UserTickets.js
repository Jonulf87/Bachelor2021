import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Button, Card, CardContent, CircularProgress, Typography,
    Table, TableContainer, TableHead, TableBody, TableRow, TableCell
} from '@material-ui/core';
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
    const [isReady, setIsReady] = useState(false);

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
                    setIsReady(true);
                }
                else {
                    setUserTicketList([]);
                }
            }
        }

        getUserTickets();
    }, [isAuthenticated])

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {isReady && (<>
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
                                    <TableCell align="left">Detaljer</TableCell>
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
                                        <TableCell align="left"><Button color="primary" variant="contained" size="small">Vis info</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>)}

                {!isReady && ((<CircularProgress />))}
            </CardContent>
        </Card>
    );
}
