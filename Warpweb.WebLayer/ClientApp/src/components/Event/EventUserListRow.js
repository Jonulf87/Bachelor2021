import { Button, TableCell, TableRow } from '@mui/material';
import React, { useRef } from 'react';
import { format, parseISO } from 'date-fns';
import usePurchase from '../../hooks/usePurchase';

export default function EventUserListRow({ name, venueName, id, startDateTime, endDateTime, organizerName }) {
    const ref = useRef(null);
    const { setSelectedMainEventId } = usePurchase();

    return (
        <TableRow id={id} ref={ref}>
            <TableCell>{name}</TableCell>
            <TableCell>{venueName}</TableCell>
            <TableCell>
                {format(parseISO(startDateTime), 'dd.MMM')} - {format(parseISO(endDateTime), 'dd.MMM')}
            </TableCell>
            <TableCell>{organizerName}</TableCell>
            <TableCell>
                <Button variant="contained" color="primary" onClick={() => setSelectedMainEventId(ref.current.id)}>
                    Velg
                </Button>
            </TableCell>
        </TableRow>
    );
}
