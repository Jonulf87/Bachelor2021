import { Button, CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import usePurchase from '../../hooks/usePurchase';
import TicketTypeListRow from './TicketTypeListRow';

export default function TicketPicker() {

    
    const { ticketTypesList, totalPrice } = usePurchase();


    const sortFunction = (a, b) => {
        if (a.basePrice === b.basePrice) {
            const c = a.descriptionName.toLowerCase(), d = b.descriptionName.toLowerCase();

            return c < d ? -1 : c > d ? 1 : 0;
        }
        return b.basePrice - a.basePrice;
    }

    return (
        <>

            {ticketTypesList ?
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
                                <TicketTypeListRow {...ticketType} key={ticketType.id}  />
                            ))
                            }
                        </>

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                Totalpris
                            </TableCell>
                            <TableCell>
                                {totalPrice}
                            </TableCell>
                            <TableCell>

                            </TableCell>
                            <TableCell>

                            </TableCell>

                        </TableRow>
                    </TableFooter>
                </Table>
                : <CircularProgress />}
        </>

    )
}