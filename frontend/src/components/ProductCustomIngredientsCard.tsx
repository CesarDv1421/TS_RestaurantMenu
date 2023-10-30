//NextUI
import { Button } from '@nextui-org/react';

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
    <div className='rounded-xl p-5 bg-white border-3 border-green-400 shadow-custom'>
      <div className='flex'>
        <img src={img} className='w-24 rounded-lg select-none' alt='Imagen del producto' />
        <div className='flex flex-col justify-between py-0 px-3 w-full'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div className='flex justify-between items-center'>
            <span className='w-1/2'>${price}</span>
            <div className='flex w-full'>
              <Button
                variant='solid'
                onPress={() => onOpen()}
                className='transform hover:scale-110 text-white bg-green-500 w-full border-green-600 bg-gradient-to-r from-green-500 to-green-700'
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
