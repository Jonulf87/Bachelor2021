import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import authService from '../api-authorization/AuthorizeService';
import { ApplicationPaths } from '../api-authorization/ApiAuthorizationConstants';
import { Link } from 'react-router-dom';

export default function UserMainMenu() {

    let [isReady, setIsReady] = useState(false);
    let [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const getAuthenticationState = async () => {
            const authenticationResult = await authService.isAuthenticated();
            const user = await authService.getUser();

            setIsAuthenticated(authenticationResult);
            setIsReady(true);
        }

        getAuthenticationState();
    }, [])
    //logikk som sier hva som returneres

    if (!isReady) {
        return <p>Loading...</p>;
    }

    return (
        <List>
            {isAuthenticated && (
                <>

                    <ListItem button component={Link} to={ApplicationPaths.Profile}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Min side' />
                    </ListItem>

                    <ListItem button component={Link} to={ApplicationPaths.LogOut}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg ut' />
                    </ListItem>


                </>)}
            {!isAuthenticated && (
                <>
                    
                    <ListItem button component={Link} to={ApplicationPaths.Register}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Register' />
                    </ListItem>


                    <ListItem button component={Link} to={ApplicationPaths.Login}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg inn' />
                    </ListItem>



                </>
            )}
        </List>
    );
}
