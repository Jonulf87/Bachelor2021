
import React, { useState, useEffect } from 'react';
import { MuiThemeProvider, TableRow, TableCell } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useAuth from '../../hooks/useAuth';
import MUIDataTable, { ExpandButton } from 'mui-datatables';




export default function UserList() {

    const [getUsersIsReady, setGetUsersIsReady] = useState(false);
    const [getRolesIsReady, setGetRolesIsReady] = useState(false);

    const [userList, setUserList] = useState([]);
    const [userRoles, setUserRoles] = useState([]);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setUserList(result);
                setGetUsersIsReady(true);
            }
        }
        getUsers();
    }, [isAuthenticated]);

    //useEffect(() => {
    //    const getRoles = async () => {

    //        if (isAuthenticated) {
    //            const rolesResponse = await fetch(`/api/users/userroles/${expanded}`, {
    //                headers: {
    //                    'Authorization': `Bearer ${token}`
    //                }
    //            });
    //            const rolesResult = await rolesResponse.json();
    //            setUserRoles(rolesResult);
    //            setGetRolesIsReady(true);
    //        }
    //    }
    //    getRoles();
    //}, []);

    const columns = [
        {
            name: 'firstName',
            label: 'Fornavn'
        },
        {
            name: 'lastName',
            label: 'Etternavn'
        },
        {
            name: 'userName',
            label: 'Brukernavn',
            sort: false //funker ikke. dunno why
        },
        {
            name: 'phoneNumber',
            label: 'Telefon',
            sort: false
        },
        {
            name: 'eMail',
            label: 'E-post'
        },
    ];

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: 'none',
        expandableRows: true,
        expandableRowsHeder: false,
        expandableRowsObClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            //Eksempel på hvordan sperre to rader fra å åpne
            //if (dataIndex === 3 || dataIndex === 4) return false;

            //forhindre expande av any rad når 4 rader allerede åpne. Men tillater lukking av de åpne
            if (expandedRows.data.length >= 4 && expandedRows.data.filter(data => data.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        rowsExpanded: [0],
        renderExpandableRow: (rowData, rowMeta) => {
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        {JSON.stringify(rowData)}
                    </TableCell>
                </TableRow>
            );
        },
        //Denne ser ut til å kunne trigge noe ved  åpning. Bruke til å hente roller?
        onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => console.log(`curExpanded:   ${ curExpanded }  allExpanded: ${allExpanded}  rowsExpanded: ${rowsExpanded}`)
    };

    const components = {
        ExpandedButton: function (props) {
            if (props.dataIndex === 3 || props.dataIndex === 4) return <div style={{ width: '24px' }} />;
            return <ExpandButton {...props} />
        }
    };

    return (
        <>
            <MUIDataTable
                title={'Brukere'}
                data={userList}
                columns={columns}
                options={options}
                components={components}
                />
        </>
    );
}