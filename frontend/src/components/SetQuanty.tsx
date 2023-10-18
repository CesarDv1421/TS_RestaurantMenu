//Iconos
import Plus from '/img/icons/Plus.png';
import Minus from '/img/icons/Minus.png';

import css from './SetQuanty.module.css';

interface ChildrenProps {
  quanty: number;
  setQuanty: React.Dispatch<React.SetStateAction<number>>;
}

const SetQuanty = ({ quanty, setQuanty }: ChildrenProps) => {
  const addingQuanty = () => setQuanty((prevQuanty) => prevQuanty + 1);
  const substractQuanty = () => setQuanty((prevQuanty) => (prevQuanty <= 1 ? 1 : prevQuanty - 1));

  return (
    <div className={css.quantyOfOrder}>
      <div onClick={() => substractQuanty()}>
        <img src={Minus} width='8px' alt='Operador substraccion' />
      </div>
      <h1>{quanty}</h1>
      <div onClick={() => addingQuanty()}>
        <img src={Plus} width='8px' alt='Operador adicion' />
      </div>
    </div>
  );
};

export default SetQuanty;
