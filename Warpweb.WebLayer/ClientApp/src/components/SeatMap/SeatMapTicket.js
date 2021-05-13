import { Button } from '@material-ui/core';
import React from 'react';
import { format, parseISO } from 'date-fns';
import useSeatMap from '../../hooks/useSeatMap';
import useCurrentEvent from '../../hooks/useCurrentEvent';

export default function SeatMapTicket({
    id,
    price,
    seatNumber,
    seatId,
    rowName,
    ticketType,
    ticketTypeId,
    mainEventName,
    mainEventId,
    userFirstName,
    userLastName,
    start,
    end,
    venueName,
}) {
    const { setSelectedEvent } = useCurrentEvent();
    const { getSeatMap, setActiveTicket } = useSeatMap();

    const handleClick = () => {
        setSelectedEvent(mainEventId);
        setActiveTicket(id);
        getSeatMap();
    };

    return (
        <>
            <div className="main-content">
                <div className="ticket">
                    <div className="ticket__main">
                        <div className="header">{mainEventName}</div>
                        <div className="info participant">
                            <div className="info__item">Navn</div>
                            <div className="info__detail">
                                {userFirstName} {userLastName}
                            </div>
                        </div>

                        <div className="info startdatetime">
                            <div className="info__item">Start</div>
                            <div className="info__detail">{format(parseISO(start), 'dd.MM.yyyy HH:mm')} </div>
                        </div>
                        <div className="info enddatetime">
                            <div className="info__item">Slutt</div>
                            <div className="info__detail">{format(parseISO(end), 'dd.MM.yyyy HH:mm')}</div>
                        </div>
                        <div className="info tickettype">
                            <div className="info__item">Type</div>
                            <div className="info__detail">{ticketType}</div>
                        </div>
                        <div className="info price">
                            <div className="info__item">Pris</div>
                            <div className="info__detail">{price},-</div>
                        </div>
                        <div className="info rownumber">
                            <div className="info__item">Rad</div>
                            <div className="info__detail">{rowName}</div>
                        </div>
                        <div className="info seat">
                            <div className="info__item">Sete</div>
                            <div className="info__detail">{seatNumber}</div>
                        </div>
                    </div>
                    <div className="ticket_id">
                        Billettnr: {id} - Lokale: {venueName}
                    </div>
                </div>
                <div>
                    {seatNumber ? (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '5px', float: 'right' }}
                            onClick={() => handleClick()}
                        >
                            Endre sete
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '5px', float: 'right' }}
                            onClick={() => handleClick()}
                        >
                            Reserver sete
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
