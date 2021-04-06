import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell} from '@material-ui/core';
import VenueInfo from './VenueInfo';
import useAuth from "../../hooks/useAuth";
import MUIDataTable, { ExpandButton } from 'mui-datatables';



const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
        margin: {
            margin: theme.spacing(1),
        },
    }),
);

export default function VenueTable() {
    const [isReady, setIsReady] = useState(false);
    
    const [venueList, setVenueList] = useState([]);
    const [venueOpen, setVenueOpen] = useState("");
    


    const { isAuthenticated, token } = useAuth();
    useEffect(() => {
        const getVenues = async () => {
            if (isAuthenticated) {
                const respone = await fetch('/api/venues/venueslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await respone.json();
                setVenueList(result);
                setIsReady(true);
            }
        }

        getVenues();

    }, [isAuthenticated]);

    const classes = useStyles();


    const columns = [
        {
            name: 'id',
            label: 'ID',
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
        expandableRowsObClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            //Eksempel på hvordan sperre to rader fra å åpne
            //if (dataIndex === 3 || dataIndex === 4) return false;

            //forhindre expande av any rad når 4 rader allerede åpne. Men tillater lukking av de åpne
            if (expandedRows.data.length >= 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        //rowsExpanded: [0],
        renderExpandableRow: ( rowData, rowMeta) => {
            
            const colSpan = rowData.length + 1;
            return (
                    <TableRow>
                        <TableCell colSpan={colSpan}>
                            <VenueInfo venue={venueOpen.venueId} />
                        </TableCell>
                    </TableRow>
            );
        },

        onRowExpansionChange: (curExpanded) => {
        const venueIdCurrentRow = venueList[curExpanded[0].dataIndex].id;
        const getContact = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/venues/${venueIdCurrentRow}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                console.log(result);
                setVenueOpen(result);
            }
        }
        getContact();
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