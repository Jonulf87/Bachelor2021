import React, { useState, useEffect } from 'react';
import OrganizerAdminList from './OrganizerAdminList';
import OrganizerAdminMenu from './OrganizerAdminMenu';
import UserPicker from '../User/UserPicker';
import useAuth from '../../hooks/useAuth';

export default function OrganizerAdminMain() {

    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orgId, setOrgId] = useState("");

    const { isAuthenticated, token } = useAuth();

    const updateList = () => {
        setTriggerUpdate(oldValue => !oldValue);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    const addOrgAdmin = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/tenants/setadmin/${orgId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            
            updateList();
        }
    }


    


    return (
        <>
            <OrganizerAdminMenu updateList={updateList} />
            <OrganizerAdminList triggerUpdate={triggerUpdate} handleDialogOpen={handleDialogOpen} setOrgId={setOrgId} />
            <UserPicker dialogOpen={dialogOpen} handleDialogClose={handleDialogClose} setUserId={addOrgAdmin} /> 
        </>

    )
}