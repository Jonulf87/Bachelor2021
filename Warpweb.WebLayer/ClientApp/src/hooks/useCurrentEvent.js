import { useContext } from 'react';
import { CurrentEventContext } from '../providers/CurrentEventProvider';

const useCurrentEvent = () => {
    const currentEvent = useContext(CurrentEventContext);

    return currentEvent;
};

export default useCurrentEvent;
