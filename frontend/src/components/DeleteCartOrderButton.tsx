//Custom Hooks
import useCartOrders from '../hooks/useCartOrders';

//Interfaces
import { ExtraItem, TogglesValues } from '../interfaces/CartOrder';
import { useCartOrdersReturnType } from '../interfaces/CartOrder';
import { DeleteIcon } from './Icons';

//Next UI
import { Tooltip } from '@nextui-org/react'; //Componenetes necesarios para funcionamiento del Popover

interface ChildrenProps {
  id: number;
  quanty: number;
  buttonsValues: TogglesValues[];
  extras: ExtraItem[];
}

const DeleteCartOrderButton: React.FC<ChildrenProps> = ({ id, quanty, buttonsValues, extras }) => {
  const { onDeleteCartOrder } = useCartOrders(id, quanty, buttonsValues, extras) as useCartOrdersReturnType;
  return (
    <Tooltip showArrow={true} color='danger' content='Eliminar'>
      <span onClick={() => onDeleteCartOrder()} className='text-lg text-danger cursor-pointer active:opacity-50'>
        <DeleteIcon />
      </span>
    </Tooltip>
  );
};

export default DeleteCartOrderButton;
