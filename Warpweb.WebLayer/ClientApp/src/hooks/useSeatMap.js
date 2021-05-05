import { useContext } from 'react';
import { SeatMapContext } from '../providers/SeatMapProvider';

const useSeatMap = () => {
    const seatMap = useContext(SeatMapContext);

    return seatMap;
};

export default useSeatMap;
