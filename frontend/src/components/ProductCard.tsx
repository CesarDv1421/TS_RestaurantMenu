import css from './ProductCard.module.css';

interface ChildrenProps {
  children: React.ReactNode;
  name: string;
  description: string;
  img: string;
  price: number;
}

const ProductCard: React.FC<ChildrenProps> = ({ children, name, description, img, price }) => {
  return (
    <div className={css.container}>
      <div className='flex'>
        <img src={img} className='w-24 rounded-lg' alt='Imagen del producto' />
        <div className='px-3 flex w-full flex-col justify-between'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div className='flex justify-between items-center'>
            <span className='w-1/2'>${price}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProductCard;
