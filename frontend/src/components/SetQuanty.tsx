//Iconos
import Plus from '/img/icons/Plus.png';
import Minus from '/img/icons/Minus.png';

import css from './SetQuanty.module.css';

const SetQuanty = ({
  quanty,
  setQuanty,
}: {
  quanty: number;
  setQuanty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const addingQuanty = () => setQuanty((prevQuanty) => prevQuanty + 1);
  const substractQuanty = () => setQuanty((prevQuanty) => (prevQuanty <= 1 ? 1 : prevQuanty - 1));

  return (
    <div className={css.quantyOfOrder}>
      <div
        onClick={() => substractQuanty()}
        className={`transform transition hover:scale-125 active:scale-100 ${quanty === 1 && `bg-red-600 `}`}
      >
        <img src={Minus} width='8px' alt='Operador substraccion' />
      </div>
      <span className='text-center w-10'>
        <h1>{quanty}</h1>
      </span>
      <div onClick={() => addingQuanty()} className='transform transition hover:scale-125 active:scale-100'>
        <img src={Plus} width='8px' alt='Operador adicion' />
      </div>
    </div>
  );
};

export default SetQuanty;
