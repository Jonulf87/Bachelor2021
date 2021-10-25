import { Button, CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import React, { useState, useEffect } from 'react';
import usePurchase from '../../hooks/usePurchase';
import TicketTypeListRow from './TicketTypeListRow';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

export default function TicketPicker() {
    const { ticketTypesList, totalPrice, shoppingCart, removeTicketType, addTicketType } = usePurchase();

    const sortFunction = (a, b) => {
        if (a.basePrice === b.basePrice) {
            const c = a.descriptionName.toLowerCase(),
                d = b.descriptionName.toLowerCase();

            return c < d ? -1 : c > d ? 1 : 0;
        }
        return b.basePrice - a.basePrice;
    };

    const shoppingCartUnique = [...new Set(shoppingCart.map((a) => a.descriptionName))];

    return (
        <>
            {ticketTypesList ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Navn</TableCell>
                            <TableCell>Pris</TableCell>
                            <TableCell colSpan="2">Tilgjengelig</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <>
                            {ticketTypesList.sort(sortFunction).map((ticketType) => (
                                <TicketTypeListRow {...ticketType} key={ticketType.id} />
                            ))}
                        </>
                    </TableBody>
                    <TableBody>
                        <TableRow
                            style={{
                                backgroundColor: '#becadb',
                            }}
                        >
                            <TableCell>
                                <strong>Handlekurv</strong>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        {shoppingCartUnique.length > 0 ? (
                            shoppingCartUnique
                                .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
                                .map((ticket) => (
                                    <TableRow key={ticket}>
                                        <TableCell>{ticket}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <RemoveCircleRoundedIcon
                                                onClick={() => removeTicketType(ticket)}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                            <strong>{shoppingCart.filter((a) => a.descriptionName === ticket).length}</strong>
                                            <AddCircleRoundedIcon
                                                onClick={() =>
                                                    addTicketType(shoppingCart.find((a) => a.descriptionName === ticket).id, ticket)
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {shoppingCart.filter((a) => a.descriptionName === ticket).length *
                                                ticketTypesList.find((a) => a.descriptionName === ticket).basePrice}
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <></>
                        )}
                        <TableRow
                            style={{
                                backgroundColor: '#becadb',
                            }}
                        >
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <strong>Totalpris</strong>
                            </TableCell>
                            <TableCell>{totalPrice}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <CircularProgress />
            )}
        </>
    );
}
