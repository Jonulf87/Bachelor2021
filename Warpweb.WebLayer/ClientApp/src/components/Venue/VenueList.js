import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell} from '@material-ui/core';
import VenueInfo from './VenueRowDetails';
import useAuth from "../../hooks/useAuth";
import MUIDataTable, { ExpandButton } from 'mui-datatables';


export default function VenueTable() {
    const [isReady, setIsReady] = useState(false);
    const [venueList, setVenueList] = useState([]);

    const { isAuthenticated, token } = useAuth();
    useEffect(() => {
        const getVenues = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/venues/venueslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                setVenueList(result);
                setIsReady(true);
            }
        }

        getVenues();

    }, [isAuthenticated]);

    const columns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                display: false,
            }
        },
        {
            name: 'name',
            label: 'Navn'
        },
        {
            name: 'address',
            label: 'Addresse'
        },
    ];

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: 'none',
        selectableRowsOnClick: true,
        expandableRows: true,
        expandableRowsHeder: false,
        expandableRowsOnClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            //forhindre expande av any rad når 4 rader allerede åpne. Men tillater lukking av de åpne
            if (expandedRows.data.length >= 4 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        //rowsExpanded: [0],
        renderExpandableRow: ( rowData, rowMeta) => {

            const colSpan = rowData.length + 1;
            return (
                    <TableRow>
                        <TableCell colSpan={colSpan}>
                            <VenueInfo venue={rowData[0]} />
                        </TableCell>
                    </TableRow>
            );
        },

        onRowExpansionChange: (curExpanded) => {
        //const venueIdCurrentRow = venueList[curExpanded[0].dataIndex].id;
        //const getContact = async () => {
        //    if (isAuthenticated) {
        //        const response = await fetch(`/api/venues/${venueIdCurrentRow}`, {
        //            headers: {
        //                'Authorization': `Bearer ${token}`
        //            }
        //        });
        //        const result = await response.json();
        //        console.log(result);
        //        setVenueOpen(result);
        //    }
        //}
        //getContact();
        }
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
                title={'Lokaler'}
                data={venueList}
                columns={columns}
                options={options}
                components={components}
                />
        </>
    );
}