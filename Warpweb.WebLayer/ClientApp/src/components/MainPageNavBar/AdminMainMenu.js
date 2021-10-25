import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { NavLink } from 'react-router-dom';
import { ListItem, List, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.action.selected,
        borderRight: `5px solid ${theme.palette.primary.main}`,
    },
}));

export default function AdminMainMenu({ policies, roles, orgAdmins }) {
    const classes = useStyles();

    return (
        <List
            component="nav"
            role="navigation"
            subheader={
                <ListSubheader color="inherit" component="h1">
                    Administrasjon
                </ListSubheader>
            }
        >
            {(policies.some((a) => a === 6) || orgAdmins.length > 0) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/venue">
                    <ListItemIcon>
                        <HomeWorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Lokaler" />
                </ListItem>
            )}

            {policies.some((a) => a === 2) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/ticketadmin">
                    <ListItemIcon>
                        <ConfirmationNumberIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Billetter" />
                </ListItem>
            )}

            {policies.some((a) => a === 3) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/seatmap">
                    <ListItemIcon>
                        <EventSeatIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Setekart" />
                </ListItem>
            )}

            {policies.some((a) => a === 1) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/crewadmin">
                    <ListItemIcon>
                        <GroupIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Arbeidslag" />
                </ListItem>
            )}

            {policies.some((a) => a === 7) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/participant">
                    <ListItemIcon>
                        <AssignmentIndIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Deltagere" />
                </ListItem>
            )}

            {policies.some((a) => a === 4) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/useradmin">
                    <ListItemIcon>
                        <SettingsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Brukere" />
                </ListItem>
            )}
            {policies.some((a) => a === 5) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/report">
                    <ListItemIcon>
                        <AssignmentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Rapporter" />
                </ListItem>
            )}
            {orgAdmins.length > 0 && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/event">
                    <ListItemIcon>
                        <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Arrangementer" />
                </ListItem>
            )}

            {(roles.some((a) => a === 'Admin') || orgAdmins.length > 0) && (
                <ListItem button component={NavLink} activeClassName={classes.root} to="/organizer">
                    <ListItemIcon>
                        <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Organisasjoner" />
                </ListItem>
            )}
        </List>
    );
}
