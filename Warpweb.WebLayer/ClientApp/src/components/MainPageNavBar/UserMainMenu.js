import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function UserMainMenu() {

    const { isAuthenticated } = useAuth();

    return (
        <List>

            {isAuthenticated && (
                <>

                    <ListItem button component={Link} to='/user'>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Min side' />
                    </ListItem>

                    <ListItem button component={Link} to='/logout'>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg ut' />
                    </ListItem>

                </>)}

            {!isAuthenticated && (
                <>
                    
                    <ListItem button component={Link} to={'/register'}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Registrer' />
                    </ListItem>


                    <ListItem button component={Link} to={'/login'}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg inn' />
                    </ListItem>

                </>
            )}

        </List>
    );
}
