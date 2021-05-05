import { Button, CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import usePurchase from '../../hooks/usePurchase';
import TicketTypeListRow from './TicketTypeListRow';

export default function TicketPicker() {

    const { ticketTypesList, totalPrice, shoppingCart } = usePurchase();

    const sortFunction = (a, b) => {
        if (a.basePrice === b.basePrice) {
            const c = a.descriptionName.toLowerCase(), d = b.descriptionName.toLowerCase();

            return c < d ? -1 : c > d ? 1 : 0;
        }
        return b.basePrice - a.basePrice;
    }


    const shoppingCartUnique = [...new Set(shoppingCart.map(a => a.descriptionName))];


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
                                Tilgjengelig
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
                    <TableBody>
                        {shoppingCartUnique.map((ticket) => (
                            <TableRow key={ticket}>
                                <TableCell>
                                    {ticket}
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                    x {shoppingCart.filter(a => a.descriptionName === ticket).length}
                                </TableCell>
                                <TableCell>
                                    {shoppingCart.filter(a => a.descriptionName === ticket).length * ticketTypesList.find(a => a.descriptionName === ticket).basePrice}
                                </TableCell>
                            </TableRow>
                            ))}
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
                    </TableBody>
                </Table>
                : <CircularProgress />}
        </>

    )
}