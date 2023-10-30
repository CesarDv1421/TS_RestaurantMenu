//Interafaces
import { TogglesValues } from '../interfaces/CartOrder';

interface ChildrenProps {
  children: React.ReactNode;
  name: string;
  img: string;
  description: string;
  price: number;
  toggleButtonsSelected: TogglesValues[];
}

const ProductCoffeeCard: React.FC<ChildrenProps> = ({ children, name, img, description, price }) => {
  return (
    <div className='rounded-xl p-5 bg-white border-3 border-green-400 shadow-custom'>
      <div className='flex'>
        <img src={img} className='w-24 rounded-lg select-none' alt='Imagen del plato' />
        <div className='flex flex-col justify-between py-0 px-3'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div className='flex justify-between items-center'>
            <span className='text-2xl text-green-800'>${price}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProductCoffeeCard;
