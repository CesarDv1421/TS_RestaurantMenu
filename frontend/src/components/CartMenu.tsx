//Componentes
import SetQuanty from './SetQuanty';
import DeleteCartOrderButton from './DeleteCartOrderButton';

import { TogglesValues, ExtraItem } from '../interfaces/CartOrder';

interface ChildrenProps {
  children: React.ReactNode;
  id: number;
  name: string;
  quanty: number;
  price?: number;
  typeOfProduct: string;
  buttonsValues?: TogglesValues[];
  extras?: ExtraItem[];
  img: string;
}

interface CartOrdersReturnType {
  onDeleteCartOrder: () => void;
  newQuanty: number;
  setNewQuanty: React.Dispatch<React.SetStateAction<number>>;
}

//Custom Hooks
import useCartOrders from '../hooks/useCartOrders';

//Next UI
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react'; //Componenetes necesarios para funcionamiento del Popover

const CartMenu: React.FC<ChildrenProps> = ({
  children,
  id,
  name,
  quanty,
  price,
  typeOfProduct,
  buttonsValues,
  extras,
}) => {
  const { newQuanty, setNewQuanty } = useCartOrders(
    id,
    quanty,
    buttonsValues || [],
    extras || []
  ) as CartOrdersReturnType;

  return (
    <div className='flex rounded-xl z-0 border-red shadow-custom'>
      <div className='w-24'>
        <img src='http://localhost:3000/img/restaurantImg/coffee.jpg' className='rounded-tl-lg rounded-bl-lg' />
      </div>
      <div className='flex flex-col justify-around w-full mx-5'>
        <div className='flex justify-between'>
          <h1 className='text-xl'>{name}</h1>
          <DeleteCartOrderButton id={id} quanty={quanty} buttonsValues={buttonsValues || []} extras={extras || []} />
        </div>
        <div className='flex justify-between items-center'>
          <div className='w-1/3'>
            <span className='text-lg text-green-800'>${price && quanty ? (price * quanty).toFixed(2) : 0}</span>
          </div>
          {typeOfProduct === 'Custom' || typeOfProduct === 'Coffee' ? (
            <Popover
              placement='bottom'
              showArrow={true}
              classNames={{
                base: 'py-3 px-4 border border-default-200 bg-gradient-to-br from-white to-default-300 dark:from-default-100 dark:to-default-50',
                arrow: 'bg-default-200',
              }}
            >
              <PopoverTrigger>
                <Button color='primary' variant='ghost'>
                  Ver Notas...
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='px-1 py-2'>{children}</div>
              </PopoverContent>
            </Popover>
          ) : typeOfProduct === 'Normal' ? null : typeOfProduct === 'Variants' ? (
            <div className='w-1/3'>{children}</div>
          ) : null}

          <div className='w-1/2 flex justify-center'>
            <SetQuanty quanty={newQuanty} setQuanty={setNewQuanty} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMenu;
