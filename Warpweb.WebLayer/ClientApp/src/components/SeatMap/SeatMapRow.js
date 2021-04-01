import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import SeatMapSeat from './SeatMapSeat';

export default function SeatMapRow({ xPos, yPos, numberOfSeats, rowName, isVertical, updateRowPosition, setSeatInfo }) {


    const gridSize = 20;

    const handleDrag = (e, data) => {
        updateRowPosition(rowName, data.x, data.y)
    }

    const renderSeats = () => {
        const seatsToBeRendered = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            seatsToBeRendered.push(<SeatMapSeat key={i} seatNumber={i} rowName={rowName} gridSize={gridSize} />)


        }
        return seatsToBeRendered;
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

