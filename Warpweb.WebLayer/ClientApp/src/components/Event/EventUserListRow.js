import { Button, TableCell, TableRow } from '@material-ui/core';
import React, { useRef } from 'react';
import { format, parseISO } from 'date-fns';

export default function EventUserListRow({ name, venueName, id, startDate, endDate, organizerName, selectEvent }) {

    const ref = useRef(null);

 
    return (
        <TableRow
            id={id}
            ref={ref}
        >
            <TableCell>
                {name}
            </TableCell>
            <TableCell>
                {venueName}
            </TableCell>
            <TableCell>
                {format(parseISO(startDate), 'dd.MMM')} - {format(parseISO(endDate), 'dd.MMM')}
            </TableCell>
            <TableCell>
                {organizerName}
            </TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => selectEvent(ref.current.id)}
                >Velg</Button>
            </TableCell>
        </TableRow>
    )
}
