import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Button} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function UserMainMenu() {

    const { isAuthenticated } = useAuth();
    

    return (
        <>

            {isAuthenticated && (
                <>
                    <Button color="inherit" ><Link to='/user'>Min Side</Link></Button>
                    <Button color="inherit" ><Link to='/logout'>Logg ut</Link></Button>

                </>)}

            {!isAuthenticated && (
                <>
                    <Button><Link to={'/register'}>Registrer</Link></Button>
                    <Button><Link to={'/login'}>Logg inn</Link></Button>

                </>
            )}

        </>
    );
}
