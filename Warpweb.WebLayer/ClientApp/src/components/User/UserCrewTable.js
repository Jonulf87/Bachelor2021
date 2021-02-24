import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
    }),
);

function createData(id, date, description, role) {
    return { id, date, description, role };
}

const rows = [
    createData(1, '08.08.2021', 'WarpZone', 'Logistikk'),
    createData(2, '01.10.2021', 'WrapZone', 'Teknikk'),
    createData(3, '15.10.2021', 'WarPonez', 'Sikkerhet'),
    createData(4, '11.11.2021', 'ZapWrones', 'Administrasjon'),
];

export default function UserCrewTable() {
    const classes = useStyles();

    return (
        <TableContainer className={classes.root} component={Paper}>
            <Typography gutterBottom variant="h5" component="h2">
                Arrangement/Crewtilhørighet
                    </Typography>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Id</TableCell>
                        <TableCell align="left">Dato</TableCell>
                        <TableCell align="left">Arrangement</TableCell>
                        <TableCell align="left">Rolle</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.date}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

