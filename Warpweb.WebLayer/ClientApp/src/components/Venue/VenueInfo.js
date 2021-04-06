import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Input, Table, TableBody, TableCell, TableContainer, TableRow, Textfield, Button, Grid, Typography } from "@material-ui/core";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
    }),
);

export default function VenueInfo(props) {

    const [venue, setVenue] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const venueId = props.venue;

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getVenue = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/venues/${venueId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setVenue(result);
            }


        }
        getVenue();
    }, [isAuthenticated]);



    const classes = useStyles();

    return (
        <div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Id</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography>{venue.venueId}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Navn</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.venueName}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.venueName} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Adresse</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.venueAddress}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.venueAddress} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Postnr</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.postalCode}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.postalCode} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Areal</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.venueAreaAvailable}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.venueAreaAvailable} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Kapasitet</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.venueCapacity}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.venueCapacity} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="overline">Kontakt</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.contactId}</Typography> )}
                            {isEditing && (<Input  id="outlined-margin-dense" variant="outlined" margin="dense" defaultValue={venue.contactId} />)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                                {!isEditing && (
                                <Button variant="contained" color="primary" onClick={() => setIsEditing(!isEditing)} disableElevation>
                                    Endre
                                </Button>
                                )}
                                {isEditing && (
                                <>
                                <Button variant="contained" color="primary" onClick={() => setIsEditing(!isEditing)} disableElevation>
                                    Lagre
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => setIsEditing(!isEditing)} disableElevation>
                                    Avbryt
                                </Button>
                                </>
                                )}
                        </TableCell>
                        <TableCell>
                                <Button variant="contained" color="secondary" disableElevation>
                                    Slett
                                </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
