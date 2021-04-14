import { Dialog, Button, DialogContent, DialogTitle, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { FixedSizeList } from 'react-window';

export default function UserPicker({ dialogOpen, handleDialogClose, setUserId, excludedUsers = [] }) {

    const [usersList, setUsersList] = useState([]);
    const [usersListIsReady, setUsersListIsReady] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const useStyles = makeStyles({
        root: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px rgba(0,0,0,0.4) solid"
        },
        button: {
            marginRight: "10px"
        },
        dialog: {
            marginBottom: "5px"
        }
    });

    const classes = useStyles();


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
                    Velg bruker
                </DialogTitle>

                <DialogContent
                    className={classes.dialog}
                >
                    <FixedSizeList
                        className="list"
                        height={400}
                        itemCount={usersList.length}
                        itemSize={60}
                        width={300}
                    >
                        {({ index, style }) => (
                            <div key={usersList[index].id} style={style} className={classes.root} >
                                <Typography> {`${usersList[index].firstName} ${usersList[index].lastName}`} </Typography>
                                {excludedUsers.indexOf(usersList[index].id) === -1 && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={(e) => {
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