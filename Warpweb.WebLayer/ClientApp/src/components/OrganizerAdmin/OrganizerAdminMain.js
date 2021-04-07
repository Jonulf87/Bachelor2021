import React, { useState, useEffect } from 'react';
import OrganizerAdminList from './OrganizerAdminList';
import OrganizerAdminMenu from './OrganizerAdminMenu';
import UserPicker from '../User/UserPicker';

export default function OrganizerAdminMain() {

    let [triggerUpdate, setTriggerUpdate] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);

    const updateList = () => {
        setTriggerUpdate(oldValue => !oldValue);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }


    return (
        <>
            <OrganizerAdminMenu updateList={updateList} />
            <OrganizerAdminList triggerUpdate={triggerUpdate} handleDialogOpen={handleDialogOpen} />
            <UserPicker dialogOpen={dialogOpen} handleDialogClose={handleDialogClose} /> 
        </>

    )
}