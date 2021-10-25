import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
    Input as TextField,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Button,
    Typography,
    ButtonGroup,
    CircularProgress,
} from '@mui/material';
import EditVenue from './EditVenue';

export default function VenueAdminRowDetails({ rowData, rowMeta, handleDialogEditVenueOpen, setVenueId, updateList }) {
    const [venue, setVenue] = useState(null);
    const openVenueId = rowData[0];

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        setVenueId(rowData[0]);
    }, [rowData]);

    useEffect(() => {
        const getVenue = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/venues/getvenue/${openVenueId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const result = await response.json();
                setVenue(result);
            }
        };
        getVenue();
    }, [isAuthenticated, updateList]);

    if (venue == null)
        return (
            <TableRow>
                <TableCell colSpan={3}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        );

    return (
        <>
            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>Navn</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.name}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>Adresse</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.address}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>Postnummer</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.postalCode}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={2}>
                    <Typography>Kontakt</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>Navn</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactName}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>Telefon</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactPhone}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography>E-post</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactEMail}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRow">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={2}>
                    <Button variant="contained" color="primary" size="large" onClick={handleDialogEditVenueOpen}>
                        Endre
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
}
