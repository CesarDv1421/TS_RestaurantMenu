//Custom Hooks
import useCartOrders from '../hooks/useCartOrders';

//Interfaces
import { ExtraItem, TogglesValues } from '../interfaces/CartOrder';
import { DeleteIcon } from './Icons';

//Next UI
import { Tooltip } from '@nextui-org/react';

const DeleteCartOrderButton = ({
  id,
  quanty,
  buttonsValues,
  extras,
}: {
  id: number;
  quanty: number;
  buttonsValues: TogglesValues[];
  extras: ExtraItem[];
}) => {
  const { onDeleteCartOrder } = useCartOrders(id, quanty, buttonsValues, extras);
  return (
    <Tooltip showArrow={true} color='danger' content='Eliminar' placement='left'>
      <span onClick={() => onDeleteCartOrder()} className='text-xl text-danger cursor-pointer active:opacity-50'>
        <DeleteIcon />
      </span>
    </Tooltip>
  );
};

export default DeleteCartOrderButton;
