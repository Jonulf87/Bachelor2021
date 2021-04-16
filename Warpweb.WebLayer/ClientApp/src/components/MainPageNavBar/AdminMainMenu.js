import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, List, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import SettingsIcon from '@material-ui/icons/Settings';
import BusinessIcon from '@material-ui/icons/Business';

export default function AdminMainMenu({ policies, roles}) {


    return (
        <List
            subheader={
                <ListSubheader color="primary">
                    Administrasjon
            </ListSubheader>
            }
        >

            {policies.some(a => a === 6) &&
                <ListItem button component={Link} to='/venue'>
                    <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                    <ListItemText primary='Lokaler' />
                </ListItem>
            }

            {policies.some(a => a === 2) &&
                <ListItem button component={Link} to='/ticketadmin'>
                    <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                    <ListItemText primary='Billetter' />
                </ListItem>
            }


            {policies.some(a => a === 3) &&
                <ListItem button component={Link} to='/seatmap'>
                    <ListItemIcon><EventSeatIcon /></ListItemIcon>
                    <ListItemText primary='Setekart' />
                </ListItem>
            }


            {policies.some(a => a === 1) &&

                (<ListItem button component={Link} to='/crewadmin'>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary='Arbeidslag' />
                </ListItem>)
            }

            {policies.some(a => a === 7) &&

                <ListItem button component={Link} to='/participant'>
                    <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                    <ListItemText primary='Deltagere' />
                </ListItem>
            }

            {policies.some(a => a === 4) &&

                <ListItem button component={Link} to='/useradmin'>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary='Brukere' />
                </ListItem>

            }
            {policies.some(a => a === 5) &&

                <ListItem button component={Link} to='/report'>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary='Rapporter' />
                </ListItem>
            }


                <ListItem button component={Link} to='/event'>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary='Arrangementer' />
                </ListItem>


            {roles.some(a => a === "Admin") &&
                (<ListItem button component={Link} to='/organizer'>
                <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary='Organisasjoner' />
                </ListItem>)
            }

        </List>
    );
}
