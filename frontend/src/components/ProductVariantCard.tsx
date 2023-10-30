//Interfaces
import { TogglesValues } from '../interfaces/CartOrder';

interface ChildrenProps {
  children: React.ReactNode;
  name: string;
  description: string;
  img: string;
  toggleButtonsSelected: TogglesValues[];
}

const ProductVariantCard: React.FC<ChildrenProps> = ({ children, name, description, img }) => {
  return (
    <div className='rounded-xl p-5 bg-white border-3 border-orange-400 shadow-custom'>
      <div className='flex'>
        <img src={img} className='w-24 rounded-lg select-none' alt='Imagen del producto' />
        <div className='flex w-full flex-col justify-between px-3'>
          <h1 className='text-xl'>{name}</h1>
          <p>{description}</p>
          <div></div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProductVariantCard;
