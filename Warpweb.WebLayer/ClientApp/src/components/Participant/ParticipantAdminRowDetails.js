import { CircularProgress, TableCell, TableRow, Button, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function ParticipantAdminRowDetails({ rowData, rowMeta, updateListTrigger}) {

    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const updateList = () => {
        setTriggerUpdate(oldvalue => !oldvalue);
        updateListTrigger();
    }

    return (
        <>
            <TableRow>

                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={2}>
                </TableCell>
            </TableRow>
        </>

    );
}
