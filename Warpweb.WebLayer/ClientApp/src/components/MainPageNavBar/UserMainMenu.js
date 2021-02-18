import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default function UserMainMenu() {

    //logikk som sier hva som returneres

    return (
        <React.Fragment>
        <List>
            <ListItem button>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary='Min side' />
            </ListItem>
                <ListItem button>
                    <Link to="/">
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg ut' />
                    </Link>
            </ListItem>

            </List>
        </React.Fragment>
    );
}
