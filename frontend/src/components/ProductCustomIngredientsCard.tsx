//NextUI
import { Button } from '@nextui-org/react';

//CSS Modules
import css from './ProductCustomIngredientsCard.module.css';

interface ChildrenProps {
  children: React.ReactNode;
  name: string;
  description: string;
  img: string;
  price: number;
  onOpen: () => void;
}

const ProductCustomIngredientsCard: React.FC<ChildrenProps> = ({ children, name, description, img, price, onOpen }) => {
  return (
    <div className={css.container}>
      <div className='flex'>
        <img src={img} className='w-24 rounded-lg' alt='Imagen del producto' />
        <div className='flex flex-col justify-between py-0 px-3 w-full'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div className='flex justify-between items-center'>
            <span className='w-1/2'>${price}</span>
            <div className='flex w-full'>
              <Button
                variant='solid'
                color='success'
                onPress={() => onOpen()}
                className='text-white bg-green-500 w-full'
              >
                Custom Order
              </Button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProductCustomIngredientsCard;
