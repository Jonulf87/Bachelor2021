import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import SeatMapSeat from './SeatMapSeat';

export default function SeatMapRow({ xPos, yPos, numberOfSeats, rowName, isVertical, updateRowPosition }) {


    const gridSize = 20;

    const handleDrag = (e, data) => {
        updateRowPosition(rowName, data.x, data.y)
    }

    const renderSeats = () => {
        const seats = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            seats.push(<SeatMapSeat key={i} seatNumber={i} gridSize={gridSize} />)
        }
        return seats;
    }

    return (
        <Draggable bounds="parent" grid={[gridSize, gridSize]} position={{ x: xPos, y: yPos }} onDrag={handleDrag}>
            <div className="seatRow"
                style={{
                    width: `${gridSize * numberOfSeats}px`,
                    height: `${gridSize}px`,
                    position: "absolute"
                }}>
                {renderSeats()}
                {/*<button id="deleteDiv" onClick={() => deleteRow()}>Slett</button>*/}
            </div>
        </Draggable>
    );
}

