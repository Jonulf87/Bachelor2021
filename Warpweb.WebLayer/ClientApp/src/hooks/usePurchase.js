import { useContext } from 'react';
import { PurchaseContext } from '../providers/PurchaseProvider';

const usePurchase = () => {
    const purchase = useContext(PurchaseContext);

    return purchase;
};

export default usePurchase;
