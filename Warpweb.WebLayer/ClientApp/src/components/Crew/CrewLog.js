import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, ListSubheader, Toolbar, Divider} from '@material-ui/core';
import { FixedSizeList } from 'react-window';

import useAuth from '../../hooks/useAuth';


function createData(date, logtext, author) {
    return {date, logtext, author};
}

const rows = [
    createData('08.08.2021',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum facilisis leo vel fringilla. Ut eu sem integer vitae justo eget magna fermentum. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.',
    'Jan',),
    createData('08.08.2021',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum facilisis leo vel fringilla. Ut eu sem integer vitae justo eget magna fermentum. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.',
    'Jan',),
    createData('08.08.2021',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum facilisis leo vel fringilla. Ut eu sem integer vitae justo eget magna fermentum. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.',
    'Jan',),
    createData('08.08.2021',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum facilisis leo vel fringilla. Ut eu sem integer vitae justo eget magna fermentum. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.',
    'Jan',),
];

export default function CrewPermissionList() {
    const [logs, setLogs] = useState(rows)
    
    const { isAuthenticated, token } = useAuth();

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Tilgangsområder
                </Typography>
            </Toolbar>
        </>
    );
}