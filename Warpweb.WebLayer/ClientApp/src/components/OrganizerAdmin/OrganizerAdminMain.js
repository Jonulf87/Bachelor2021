import React, { useState, useEffect } from 'react';
import OrganizerAdminList from './OrganizerAdminList';
import OrganizerAdminMenu from './OrganizerAdminMenu';

export default function OrganizerAdminMain() {

    const [adminList, setAdminList] = useState([]);

    return (
        <>
            <OrganizerAdminMenu />
            <OrganizerAdminList />
        </>

    )
}