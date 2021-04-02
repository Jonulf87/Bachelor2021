import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 20,
        },
    }),
);

export default function TicketTypeList({ triggerUpdate }) {

    let [ticketTypeList, setTicketTypeList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getEvents = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/tickettypes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                setTicketTypeList(result);
                setIsReady(true);
            }
        }

        getEvents();

    }, [triggerUpdate, isAuthenticated]);

    function getTicketTypesFromList() {

        return (

            <TableContainer className={classes.root} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Beskrivelse</TableCell>
                            <TableCell align="left">Basispris</TableCell>
                            <TableCell align="left">Antall</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ticketTypeList.map((tickettype) => (
                            <TableRow key={tickettype.id}>
                                <TableCell align="left">{tickettype.descriptionName}</TableCell>
                                <TableCell align="left">{tickettype.basePrice}</TableCell>
                                <TableCell align="left">{tickettype.amountAvailable}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    };

    const classes = useStyles();

    return (
        <>
            {isReady && (<>
                <Typography>
                    <strong> Billettyper</strong>
                </Typography>
                {getTicketTypesFromList()}
            </>
            )}

            {!isReady && (<p>Laster billettype-oversikt...</p>)}

        </>

    );
}