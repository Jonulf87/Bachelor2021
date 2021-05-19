import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, TableCell, TableRow, TextField, Typography} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
import useAuth from '../../hooks/useAuth';

export default function UserAdminRowDetails({ rowData, rowMeta, setError, setErrorDialogOpen, setErrors }) {
    const [userDetails, setUserDetails] = useState(null);
    const [editEmailDialogOpen, setEditEmailDialogOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const updateList = () => {
        setTriggerUpdate((oldValue) => !oldValue);
    };

    const handleDialogClose = () => {
        setEditEmailDialogOpen(false);
    };

    useEffect(() => {
        const getUserDetails = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/users/user/${rowData[0]}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'GET',
                });
                if (response.ok) {
                    const result = await response.json();
                    setUserDetails(result);
                } else if (response.status === 400) {
                    setUserDetails(null);
                    const errorsResult = await response.json();
                    setErrors(errorsResult);
                    setErrorDialogOpen(true);
                } else {
                    setUserDetails(null);
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getUserDetails();
    }, [isAuthenticated, triggerUpdate]);

    const checkUserUnderage = () => {
        const diff = intervalToDuration({
            start: new Date(userDetails.dateOfBirth),
            end: new Date(),
        });
        if (diff.years < 16) {
            return true;
        } else {
            return false;
        }
    };

    const updateEmail = async () => {
        if (isAuthenticated) {
            const body = {
                userId: rowData[0],
                newEmail: newEmail,
            };

            const response = await fetch(`/api/security/edituseremail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(body),
            });
            if (response.ok) {
                updateList();
                setNewEmail('');
                handleDialogClose();
            } else if (response.status === 400) {
                setUserDetails(null);
                const errorsResult = await response.json();
                setErrors(errorsResult);
                setErrorDialogOpen(true);
            } else if (response.status === 403) {
                setUserDetails(null);
                setError('Du har ikke tilgang!');
                setErrorDialogOpen(true);
            } else {
                setUserDetails(null);
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    return (
        <>
            {userDetails !== null && (
                <>
                    <Dialog open={editEmailDialogOpen} onClose={handleDialogClose} style={{ width: '450px', margin: 'auto' }}>
                        <DialogTitle>
                            <Typography>Fyll inn ny e-post for bruker</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Ny e-post bruker"
                                        name="newEmailUser"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                </Grid>
                                <Button variant="contained" color="primary" onClick={() => updateEmail()}>
                                    Lagre
                                </Button>
                                <Grid item xs={12}></Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Adresse:</strong>
                        </TableCell>
                        <TableCell>{userDetails.address}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Postnummer:</strong>
                        </TableCell>
                        <TableCell>{userDetails.zipCode}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Kjønn:</strong>
                        </TableCell>
                        <TableCell>{userDetails.gender}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Allergisk?</strong>
                        </TableCell>
                        <TableCell>{userDetails.isAllergic ? 'Ja, personen er allergisk' : 'Nei, personen er ikke allergisk'}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    {userDetails.isAllergic && (
                        <TableRow className="expandedRowDetail">
                            <TableCell></TableCell>
                            <TableCell>
                                <strong>Allergier:</strong>
                            </TableCell>
                            <TableCell>{userDetails.allergyDescription}</TableCell>
                            <TableCell colSpan={4}></TableCell>
                        </TableRow>
                    )}
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Fødselsdato:</strong>
                        </TableCell>
                        <TableCell>{format(parseISO(userDetails.dateOfBirth), 'dd.MM.yyyy')}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    {checkUserUnderage() && (
                        <>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>Navn foresatt:</strong>
                                </TableCell>
                                <TableCell>
                                    {userDetails.parentFirstName} {userDetails.parentLastName}
                                </TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>Telefon foresatt:</strong>
                                </TableCell>
                                <TableCell>{userDetails.parentPhoneNumber}</TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>E-post foresatt:</strong>
                                </TableCell>
                                <TableCell>{userDetails.parentEMail}</TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                        </>
                    )}
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Lag:</strong>
                        </TableCell>
                        <TableCell>{userDetails.team}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Kommentar:</strong>
                        </TableCell>
                        <TableCell>{userDetails.comments}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRow">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell colSpan={2}>
                            <Button variant="contained" color="primary" onClick={() => setEditEmailDialogOpen(true)}>
                                Endre e-post adresse
                            </Button>
                        </TableCell>
                    </TableRow>
                </>
            )}
        </>
    );
}
