import { Dialog, ListItem, ListItemSecondaryAction, ListItemText, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { FixedSizeList } from 'react-window';

export default function UserPicker() {

    const [usersList, setUsersList] = useState([]);
    const [usersListIsReady, setUsersListIsReady] = useState(false);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/tenants', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setUsersList(result);
                setUsersListIsReady(true);
            }
        }
        //getUsers();
    }, [isAuthenticated])


    return (
        <>
            {/* <Dialog>
                <FixedSizeList>
                    {usersList.map((user) => (
                        <ListItem key={user.id}>
                            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                            <ListItemSecondaryAction>
                                <Button>
                                    Velg
                            </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}

                </FixedSizeList>
            </Dialog> */}
        </>
    )
}