import React, { useState, useEffect } from 'react';
import OrganizerAdminList from './OrganizerAdminList';
import OrganizerAdminMenu from './OrganizerAdminMenu';

export default function OrganizerAdminMain() {

    let [triggerUpdate, setTriggerUpdate] = useState(false);

    const updateList = () => {
        setTriggerUpdate(oldValue => !oldValue);
    }

    return (
        <>
            <OrganizerAdminMenu updateList={updateList} />
            <OrganizerAdminList triggerUpdate={triggerUpdate} />
        </>

    )
}