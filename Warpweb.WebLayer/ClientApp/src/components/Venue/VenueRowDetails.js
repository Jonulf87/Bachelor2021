import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Input as TextField, Table, TableBody, TableCell, TableRow, Button, Typography, ButtonGroup} from "@material-ui/core";
import useAuth from "../../hooks/useAuth";


export default function VenueRowDetails(props) {

    const [venue, setVenue] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const venueId = props.venue;

    const { isAuthenticated, token } = useAuth();

    const [venueName, setVenueName] = useState("");
    const [venueAddress, setVenueAddress] = useState("");
    const [venuePostalCode, setVenuePostalCode] = useState("");
    const [venueContactName, setVenueContactName] = useState("");
    const [venueContactEMail, setVenueContactEMail] = useState("");
    const [venueContactPhone, setVenueContactPhone] = useState("");


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
    }, [isAuthenticated, isEditing]);

    const dataToBeSent = {
        'id': venue.id,
        'name': venueName,
        'address': venueAddress,
        'postalCode': venuePostalCode,
        'contactName': venueContactName,
        'contactEMail': venueContactEMail,
        'contactPhone': venueContactPhone,
    }

    const submit = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            console.log(dataToBeSent);
            const response = await fetch('api/venues/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(dataToBeSent)
            });
            const result = await response.json();
            if (response.status === 200) {
                setIsEditing(false)
                setVenueName("");
                setVenueAddress("");
                setVenuePostalCode("");
                setVenueContactName("");
                setVenueContactEMail("");
                setVenueContactPhone("");
            }
            console.log(result);
        }
    }

    /*const handleClick = () => {
        setIsEditing(!isEditing)
            setVenueName(venue.name)
            setVenueAddress(venue.address)
            setVenuePostalCode(venue.postalCode)
            setVenueContactName(venue.contactName)
            setVenueContactEMail(venue.contactEMail)
            setVenueContactPhone(venue.contactPhone)
    }*/

    return (
        <div>
            <form onSubmit={submit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Navn</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.name}</Typography> )}
                            {isEditing && (
                            <TextField
                                id="name"
                                margin="dense"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                            />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Adresse</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.address}</Typography> )}
                            {isEditing && (
                                <TextField
                                    variant="filled"    
                                    id="adress"
                                    label="Adresse"
                                    value={venueAddress}
                                    onChange={(e) => setVenueAddress(e.target.value)}
                                />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Postnr</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.postalCode}</Typography> )}
                            {isEditing && (
                                <TextField
                                    id="postalCode"
                                    margin="dense"
                                    value={venuePostalCode}
                                    onChange={(e) => setVenuePostalCode(e.target.value)}
                                />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Kontaktperson</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.contactName}</Typography> )}
                            {isEditing && (
                            <TextField
                                id="contactName"
                                margin="dense"
                                value={venueContactName}
                                onChange={(e) => setVenueContactName(e.target.value)}
                            />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Kontakt e-post</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.contactEMail}</Typography>)}
                            {isEditing && (
                            <TextField
                                id="contactEMail"
                                margin="dense"
                                value={venueContactEMail}
                                onChange={(e) => setVenueContactEMail(e.target.value)}
                            />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="body1">Kontakt - telefon</Typography>
                        </TableCell>
                        <TableCell align="right">
                            {!isEditing && (<Typography>{venue.contactPhone}</Typography> )}
                            {isEditing && (
                            <TextField
                                id="contactPhone" 
                                margin="dense"
                                defaultValue={venueContactPhone}
                                onChange={(e) => setVenueContactPhone(e.target.value)}
                            />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                                {!isEditing && (
                                <Button
                                    onClick={() => {
                                        setIsEditing(!isEditing)
                                        setVenueName(venue.name)
                                        setVenueAddress(venue.address)
                                        setVenuePostalCode(venue.postalCode)
                                        setVenueContactName(venue.contactName)
                                        setVenueContactEMail(venue.contactEMail)
                                        setVenueContactPhone(venue.contactPhone)
                                    }}
                                >
                                    Endre
                                </Button>
                                )}
                                {isEditing && (
                                <ButtonGroup>
                                    <Button
                                        type="submit"
                                    >
                                        Lagre
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        Avbryt
                                    </Button>
                                </ButtonGroup>
                                )}
                        </TableCell>
                        <TableCell>
                                <Button variant="contained" color="primary" disableElevation>
                                    Slett
                                </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </form>
        </div>
    );
}
