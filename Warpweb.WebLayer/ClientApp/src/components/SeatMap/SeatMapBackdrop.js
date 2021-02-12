import React, { useState } from 'react';

import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';

export default function SeatMapBackdrop() {

    const [rows, setNumberOfRows] = useState([]);

    const deleteRow = (index) => {
        setNumberOfRows((oldRows) => {
            var newList = [...oldRows];
            newList.splice(index,1);
            return newList;
        });
    }

    const addRow = (numberOfSeats) => {
        setNumberOfRows((oldRows) => [...oldRows, numberOfSeats]);
    }

    return (
        <div className="border border-primary container ">
            <div className="row">
                <div className="col-12">
                    <SeatMapAdminMenu addRow={addRow} />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <SeatMapFloor rows={rows} deleteRow={deleteRow} />
                </div>
            </div>
        </div>

    );
}