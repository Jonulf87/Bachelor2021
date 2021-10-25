import React, { useEffect, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import { Button, ButtonGroup, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { AccountCircle } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText,
    },
    buttonRight: {
        marginLeft: 'auto',
        '&:hover': {
            color: theme.palette.secondary,
        },
        color: theme.palette.primary.contrastText,
    },
}));

export default function LoginMenuMobile({ menuItems }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <>
        <IconButton
            className={classes.buttonRight}
            aria-haspopup="true"
            aria-label="Åpne bruker meny"
            aria-controls="bruker-meny"
            onClick={handleClick}
            size="large">
            <AccountCircle />
        </IconButton>
        <Menu className={classes.buttonRight} keepMounted id="bruker-meny" anchorEl={anchorEl} open={open} onClose={handleClose}>
            {menuItems.map((item) => (
                <MenuItem component={Link} to={item.destination} onClick={handleClose} key={item.itemText}>
                    <ListItemIcon>{item.itemIcon}</ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        {item.itemText}
                    </Typography>
                </MenuItem>
            ))}
        </Menu>
    </>;
}
