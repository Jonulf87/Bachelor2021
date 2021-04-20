import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Input as TextField, Table, TableBody, TableCell, TableRow, Button, Typography, ButtonGroup, CircularProgress } from "@material-ui/core";
import EditVenue from "./EditVenue";

export default function VenueAdminRowDetails({ rowData, rowMeta }) {

    const [venue, setVenue] = useState(null);
    const [dialogEditVenueOpen, setDialogEditVenueOpen] = useState(false);
    const openVenueId = rowData[0];
    const [updateList, setUpdateList] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const handleDialogEditVenueClose = () => {
        setDialogEditVenueOpen(false);
    }

    const handleDialogEditVenueOpen = () => {
        setDialogEditVenueOpen(true);
    }

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue)
    }

    useEffect(() => {
        const getVenue = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/venues/getvenue/${openVenueId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setVenue(result);
            }
        }
        getVenue();
    }, [isAuthenticated, updateList]);



    if (venue == null) return (<TableRow><TableCell colSpan={3} ><CircularProgress /></TableCell></TableRow>)

    return (
        <>
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>Navn</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.name}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>Adresse</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.address}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>Postnummer</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.postalCode}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography>Kontakt</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>Navn</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactName}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>Telefon</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactPhone}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>E-post</Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography>{venue.contactEMail}</Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleDialogEditVenueOpen}
                    >
                        Endre
                    </Button>
                </TableCell>
            </TableRow>

            <EditVenue venueId={openVenueId} dialogEditVenueOpen={dialogEditVenueOpen} handleDialogEditVenueClose={handleDialogEditVenueClose} triggerUpdate={triggerUpdate} />
        </>
    );
}
