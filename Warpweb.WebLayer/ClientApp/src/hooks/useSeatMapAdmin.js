import { useContext } from 'react';
import { SeatMapAdminContext } from '../providers/SeatMapAdminProvider';

const useSeatMapAdmin = () => {
    const seatMapAdmin = useContext(SeatMapAdminContext);

    return seatMapAdmin;
};

export default useSeatMapAdmin;
