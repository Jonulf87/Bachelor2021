import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Button } from 'reactstrap/lib';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';
import SeatMapAdminSeat from './SeatMapAdminSeat';

export default function SeatMapAdminRow({ xPos, yPos, numberOfSeats, rowName, isVertical, handleOpen }) {

    const [style, setStyle] = useState({ display: 'none', zIndex: '9999' });

    const { updateRowPosition, gridSize } = useSeatMapAdmin();

    const handleDrag = (e, data) => {
        updateRowPosition(rowName, data.x, data.y)
    }

    const renderSeats = () => {
        const seatsToBeRendered = [];

        for (let i = 1; i <= numberOfSeats; i++) {
            seatsToBeRendered.push(<SeatMapAdminSeat key={i} seatNumber={i} />)


        }
        return seatsToBeRendered;
    }

    return (
        <Draggable bounds="parent" grid={[gridSize, gridSize]} position={{ x: xPos, y: yPos }} onDrag={handleDrag}>
            <div className="seatRow"
                onMouseOver={(e) => {
                    e.preventDefault();
                    setStyle({ display: 'block', zIndex: '9999' });
                }}
                onMouseOut={(e) => {
                    e.preventDefault();
                    setStyle({ display: 'none', zIndex: '9999' });
                }}
                style={{
                    width: `${gridSize * numberOfSeats}px`,
                    height: `${gridSize}px`,
                    position: "absolute"
                }}>
                {renderSeats()}
                <Button
                    style={style}
                    onClick={(e) =>  handleOpen(rowName) }
                >
                    Rediger rad
            </Button>
            </div>
        </Draggable>
    );
}

