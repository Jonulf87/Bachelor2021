import React, { useState } from 'react';
import TicketInfo from './TicketInfo';
import TicketAdmin from './TicketAdmin';
import SeatMapAdminMenu from '../SeatMap/SeatMapAdminMenu';
import SeatMapFloor from '../SeatMap/SeatMapFloor';

//const [rows, setRows] = useState([]);

//function deleteRow(index) {
//    setRows((oldRows) => {
//        let newList = [...oldRows];
//        newList.splice(index, -1);
//        return newList;
//    });
//}

//function addRow(numberOfSeats) {
//    setRows((oldRows) => [...oldRows, numberOfSeats]);
//}

//rows={rows} deleteRow={deleteRow} 
// addRow={addRow} 






export default function TicketMain() {
    return (
        <div>
            <SeatMapFloor />
            <SeatMapAdminMenu/>
        </div>
    );
}