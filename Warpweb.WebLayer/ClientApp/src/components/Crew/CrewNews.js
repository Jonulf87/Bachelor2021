import React, { useState, useEffect } from 'react';

import { Typography, ListItem, ListItemText, ListSubheader, Toolbar } from '@material-ui/core';

import { VariableSizeList as List } from 'react-window';

import useAuth from '../../hooks/useAuth';


export default function CrewNews({ crewId }) {

    const [crew, setCrew] = useState([])
    
    const { isAuthenticated, token } = useAuth();

    return(
        <>
        <Toolbar>
            <Typography variant="h6" component="h3">
                Nyheter
            </Typography>
        </Toolbar>
        {/*<List
        className="list"
        height={400}
        itemCount={rows.length}
        itemSize={100}
        width={500}
        >
            {({ index, style }) => (
            <div key={rows[index].date} style={style}  >
                <Typography variant="h6" component="h4">{rows[index].date}</Typography>
                <Typography variant="body2">{rows[index].logtext}</Typography>
                <Typography variant="h6" component="h4">{rows[index].author}</Typography>
                </div>
            )}
            </List>*/}
        </>
    )
}