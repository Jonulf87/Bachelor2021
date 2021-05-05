import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, makeStyles, Paper, TextField } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(2),
            width: '100%'
        },
    }
}))

export default function EditUser({ dialogEditUserOpen, handleDialogEditUserClose, triggerUpdate }) {

    const [user, setUser] = useState("");

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUser = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/users/currentuser`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setUser(result);
            }
        }
        getUser();
    }, [isAuthenticated]);


    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('/api/users/updateuser', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(user)
            });
            if (response.ok) {
                triggerUpdate();
            }
            handleDialogEditUserClose();
        }
    }

    return (
        <Dialog
            open={dialogEditUserOpen}
            onClose={handleDialogEditUserClose}
        >
            <Paper>
                <DialogTitle>
                    Endre/oppdater personalia:
                </DialogTitle>
                <form
                    className={classes.root}
                    onSubmit={submitForm}
                >
                    <TextField
                        variant='outlined'
                        id='userFirstName'
                        label='Fornavn'
                        required
                        value={user.firstName}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, firstName: e.target.value }))}
                    />

                    <TextField
                        variant='outlined'
                        id='userMiddleName'
                        label='Mellomnavn'
                        value={user.middleName}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, middleName: e.target.value }))}
                    />

                    <TextField
                        variant='outlined'
                        id='userLastName'
                        label='Etternavn'
                        required
                        value={user.lastName}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, lastName: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='userName'
                        label='Brukernavn'
                        value={user.userName}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, userName: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='userPhoneNumber'
                        label='Telefon'
                        required
                        value={user.phoneNumber}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, phoneNumber: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='userAddress'
                        label='Adresse'
                        required
                        value={user.address}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, address: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='userZipCode'
                        label='Postnr'
                        required
                        value={user.zipCode}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, zipCode: e.target.value }))}
                    />
                    {user.parentPhoneNumber &&
                        <>
                            <TextField
                                variant='outlined'
                                id='userParentFirstName'
                                label='Foresatte fornavn'
                                required
                                value={user.parentFirstName}
                                onChange={(e) => setUser(oldValues => ({ ...oldValues, parentFirstName: e.target.value }))}
                            />

                            <TextField
                                variant='outlined'
                                id='userParentLastName'
                                label='Foresatte etternavn'
                                required
                                value={user.parentLastName}
                                onChange={(e) => setUser(oldValues => ({ ...oldValues, parentLastName: e.target.value }))}
                            />

                            <TextField
                                variant='outlined'
                                id='userParentPhoneNumber'
                                label='Foresatte fornavn'
                                required
                                value={user.parentPhoneNumber}
                                onChange={(e) => setUser(oldValues => ({ ...oldValues, parentPhoneNumber: e.target.value }))}
                            />

                            <TextField
                                variant='outlined'
                                id='userParentEMail'
                                label='Foresatte epost'
                                required
                                value={user.parentEMail}
                                onChange={(e) => setUser(oldValues => ({ ...oldValues, parentEMail: e.target.value }))}
                            />
                        </>
                    }
                    {user.isAllergic &&
                        <TextField
                            variant='outlined'
                            id='userAllergyDescription'
                            label='Allergibeskrivelse'
                            required
                            value={user.allergyDescription}
                            onChange={(e) => setUser(oldValues => ({ ...oldValues, allergyDescription: e.target.value }))}
                        />
                    }
                    <TextField
                        variant='outlined'
                        id='userTeam'
                        label='Klan'
                        value={user.team}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, team: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='userComments'
                        label='Tilleggsinformasjon'
                        value={user.comments}
                        onChange={(e) => setUser(oldValues => ({ ...oldValues, comments: e.target.value }))}
                    />
                    <Button className={classes.root}
                        variant='contained'
                        color='primary'
                        type='submit'
                    >
                        Lagre
                    </Button>
                </form>
            </Paper>
        </Dialog>
    )
}