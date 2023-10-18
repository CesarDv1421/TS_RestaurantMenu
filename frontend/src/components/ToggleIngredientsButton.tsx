import { useState } from 'react';

//Interfaces
import { TogglesValues } from '../interfaces/CartOrder';

//CSS Modules
import css from './ToggleIngredientsButton.module.css';

interface ChildrenProps {
  children: React.ReactNode;
  price?: number;
  priceOfExtra?: number | React.ReactNode;
  setToggleButtonsSelected: React.Dispatch<React.SetStateAction<TogglesValues[]>>;
}

const ToggleIngredientsButton: React.FC<ChildrenProps> = ({
  children,
  price,
  priceOfExtra,
  setToggleButtonsSelected,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const onToggle = () => {
    setIsSelected((prevSelection) => !prevSelection);

    setToggleButtonsSelected((prevToggleSelected) => {
      const newSelection = prevToggleSelected.filter((item) => item.ingredient !== children);

      const updatedSelection = isSelected
        ? newSelection
        : [...newSelection, { name: '', title: '', ingredient: children as string, price: price || 0 }];

      // Ordena el array alfabéticamente por la clave "ingredient"
      updatedSelection.sort((a, b) => a.ingredient.localeCompare(b.ingredient));

      return updatedSelection;
    });
  };

  return (
    <div className={css.toggleContainer}>
      <button onClick={() => onToggle()} className={isSelected ? css.toggleButtonSelected : css.toggleButton}>
        {children}
        {priceOfExtra}
      </button>
    </div>
  );
};

export default ToggleIngredientsButton;
