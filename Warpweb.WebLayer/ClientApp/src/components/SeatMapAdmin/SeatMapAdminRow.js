import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Button, Typography } from '@material-ui/core';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';
import SeatMapAdminSeat from './SeatMapAdminSeat';

export default function SeatMapAdminRow({ xPos, yPos, numberOfSeats, rowName, isVertical, handleOpen }) {
    const [style, setStyle] = useState({ display: 'none', zIndex: '9999' });

    const { updateRowPosition, gridSize, ticketTypes } = useSeatMapAdmin();

    const handleDrag = (e, data) => {
        updateRowPosition(rowName, data.x, data.y);
    };

    return (
        <Draggable bounds="parent" grid={[gridSize, gridSize]} position={{ x: xPos, y: yPos }} onDrag={handleDrag}>
            <div
                className="seatRow"
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
                    position: 'absolute',
                    backgroundColor: '#83D6B7',
                }}
            >
                <div
                    style={{
                        border: '1px solid #000',
                        height: 'inherit',
                    }}
                >
                    <Typography style={{ fontSize: '14px' }}>
                        Radnavn: {rowName}, antall seter: {numberOfSeats}
                    </Typography>
                </div>

                <Button variant="contained" color="primary" style={style} onClick={(e) => handleOpen(rowName)}>
                    Rediger rad
                </Button>
            </div>
        </Draggable>
    );
}
