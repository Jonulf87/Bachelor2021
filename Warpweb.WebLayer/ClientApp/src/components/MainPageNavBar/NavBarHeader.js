import { Typography } from '@mui/material';
import React from 'react';
import useCurrentEvent from '../../hooks/useCurrentEvent';

export default function NavBarHeader() {
    const { currentEvent } = useCurrentEvent();

    return (
        <Typography variant="h6" noWrap>
            {currentEvent} {/*Her er tittel i bar på toppen for å vise breadcrumbs og aktiv arrangement*/}
        </Typography>
    );
}
