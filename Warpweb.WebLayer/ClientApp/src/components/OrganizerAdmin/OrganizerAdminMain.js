import React, { useState } from 'react';
import OrganizerAdminList from './OrganizerAdminList';
import OrganizerAdminMenu from './OrganizerAdminMenu';
import { Paper } from '@material-ui/core';

export default function OrganizerAdminMain() {

    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const updateList = () => {
        setTriggerUpdate(oldValue => !oldValue);
    }

    return (
        <>
            <Paper variant="outlined">
                <OrganizerAdminMenu updateList={updateList} />
            </Paper>

            <OrganizerAdminList triggerUpdate={triggerUpdate} />
        </>

    )
}