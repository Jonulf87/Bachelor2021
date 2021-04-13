import { Dialog, ListItem, ListItemSecondaryAction, ListItemText, Button, DialogContent, DialogTitle, Grid, Typography, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { FixedSizeList } from 'react-window';
import UserList from '../UserAdmin/UserList';

export default function UserPicker({ dialogOpen, handleDialogClose, setUserId, excludedUsers=[] }) {

    const [usersList, setUsersList] = useState([]);
    const [usersListIsReady, setUsersListIsReady] = useState(false);

    const { isAuthenticated, token } = useAuth();
    

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setUsersList(result);
                setUsersListIsReady(true);
            }
        }
        getUsers();
    }, [isAuthenticated])


    if (!usersListIsReady) {
        return (<CircularProgress />)
    }

    return (
        <>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle>
                    Brukere:
                </DialogTitle>

                <DialogContent>

                        <FixedSizeList
                            className="list"
                            height={400}
                            itemCount={usersList.length}
                            itemSize={60}
                            width={300}
                        >
                        {({ index, style }) => (
                            <div key={usersList[index].id} style={style}  >
                                <Typography> {`${usersList[index].firstName} ${usersList[index].lastName}`} </Typography>
                                {excludedUsers.indexOf(usersList[index].id) === -1 && (
                                <Button variant="contained" color="primary" onClick={(e) => {
                                    setUserId(usersList[index].id);
                                    handleDialogClose();
                                }} >Velg</Button>
                                    )}
                                </div>
                            )}
                        </FixedSizeList>
                </DialogContent>
            </Dialog>
        </>
    )
}