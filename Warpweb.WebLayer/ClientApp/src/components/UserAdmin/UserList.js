import { Card, CardContent, Typography, List, ListItem, ListItemText, Collapse, Grid, Paper } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import react, { useState, useEffect } from 'react';
import authService from '../api-authorization/AuthorizeService';



const useStyles = makeStyles((theme) =>
    createStyles({
        collapseUser: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: 0,
            margin: 0
        },
    }),
);

export default function UserList() {

    let [isReady, setIsReady] = useState(false);
    let [userList, setUserList] = useState([]);
    let [userOpen, setUserOpen] = useState(false);
    let [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {

            const authenticationResult = await authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/users/UsersList', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setUserList(result);
                setIsReady(true);
            }
        }
        getUsers();
    }, []);





    function handleClick(value) {
        setUserOpen(value);
    };




    const classes = useStyles();

    function mapUsers() {
        return userList.map((user) =>
            <>
                <ListItem button onCLick={handleClick(user.id)}>
                    <ListItemText primary={user.firstName} />
                    <ListItemText primary={user.lastName} />
                    <ListItemText primary={user.phoneNumber} />
                    <ListItemText primary={user.userName} />
                    <ListItemText primary={user.eMail} />
                </ListItem>
                <Collapse component={Paper} in={userOpen} timeout="auto" unmountOnExit>
                    
                        <Grid container direction="row" justify="space-evenly" alignItems="center">
                        </Grid>
                    
                </Collapse>
            </>

        )
    };



    return (
        <Card>
            <CardContent>
                {isReady && (<>
                    <Typography>
                        Brukerliste
                    </Typography>

                    <List>
                        {mapUsers()}
                    </List>
                </>
                )}

                {!isReady && (<p>Laster brukerliste...</p>)}
            </CardContent>
        </Card>

    );


}