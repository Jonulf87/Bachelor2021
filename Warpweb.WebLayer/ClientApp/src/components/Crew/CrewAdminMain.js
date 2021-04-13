import React, { useState } from 'react';
import CrewAdminList from './CrewAdminList';
import CrewAdminMenu from './CrewAdminMenu';

export default function CrewAdminMain() {

    return (
        <>
            <CrewAdminMenu  />
            <CrewAdminList />
        </>

    );
}