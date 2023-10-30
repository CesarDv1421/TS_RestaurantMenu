import { useState } from 'react';

//Interfaces
import { TogglesValues } from '../interfaces/CartOrder';

//NextUI
import { Button } from '@nextui-org/react';

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
    <div>
      <Button
        onClick={() => onToggle()}
        className={`text-s py-2 px-4 rounded-full border-2 cursor-pointer transition-transform duration-1000 ${
          isSelected
            ? 'transform hover:scale-110 text-white border-green-600 bg-gradient-to-r from-green-500 to-green-700'
            : 'transform hover:scale-110 text-black border-gray-500 bg-gradient-to-l from-gray-100 to-gray-300 '
        }`}
      >
        {children}
        {priceOfExtra}
      </Button>
    </div>
  );
};

export default ToggleIngredientsButton;
