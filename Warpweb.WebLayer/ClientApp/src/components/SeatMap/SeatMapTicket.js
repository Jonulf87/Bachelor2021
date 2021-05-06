import { Paper, Button } from '@material-ui/core';
import React from 'react';
import { format, parseISO } from 'date-fns';
import useSeatMap from '../../hooks/useSeatMap';
import useCurrentEvent from '../../hooks/useCurrentEvent';

export default function SeatMapTicket({ id, price, seatNumber, rowName, ticketType, mainEventName, mainEventId, userFirstName, userLastName, start, end, venueName }) {

    const { setSelectedEvent } = useCurrentEvent();
    const { getSeatMap, setActiveTicket } = useSeatMap();

    const handleClick = () => {
        setSelectedEvent(mainEventId);
        setActiveTicket(id);
        getSeatMap(mainEventId);
    }

    return (
        <>
            <div className="main-content">
                <div className="ticket">
                    <div className="ticket__main">
                        <div className="header">{mainEventName}</div>
                        <div className="info passenger">
                            <div className="info__item">Navn</div>
                            <div className="info__detail">{userFirstName} {userLastName}</div>
                        </div>

                        <div className="info departure">
                            <div className="info__item">Start</div>
                            <div className="info__detail">{format(parseISO(start), 'dd.MM.yyyy HH:mm' )} </div>
                        </div>
                        <div className="info arrival">
                            <div className="info__item">Slutt</div>
                            <div className="info__detail">{format(parseISO(end), 'dd.MM.yyyy HH:mm')}</div>
                        </div>
                        <div className="info date">
                            <div className="info__item">Type</div>
                            <div className="info__detail">{ticketType}</div>
                        </div>
                        <div className="info time">
                            <div className="info__item">Pris</div>
                            <div className="info__detail">{price}</div>
                        </div>
                        <div className="info carriage">
                            <div className="info__item">Rad</div>
                            <div className="info__detail">{rowName}</div>
                        </div>
                        <div className="info seat">
                            <div className="info__item">Sete</div>
                            <div className="info__detail">{seatNumber
                                ? seatNumber
                                : <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ margin: "0px", padding: "2px" }}
                                    onClick={() => handleClick()}
                                >
                                    Reserver
                                </Button>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="ticket_id">
                        {id}
                    </div>
                </div>
            </div>

        </>
    )
}