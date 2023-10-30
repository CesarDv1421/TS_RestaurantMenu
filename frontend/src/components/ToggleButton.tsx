import React from 'react';

//Interfaces
import { TogglesValues } from '../interfaces/CartOrder';

//NextUI
import { Button } from '@nextui-org/react';

interface ImgElementProps {
  src: string;
  alt: string;
  data: string;
}

interface ChildrenProps {
  childrenValue?: React.ReactNode;
  setToggleButtonsSelected: React.Dispatch<React.SetStateAction<TogglesValues[]>>;
  name: string;
  price?: number | React.ReactNode;
  title?: string;
  selectedValue?: string;
  setSelectedValue?: React.Dispatch<React.SetStateAction<string | null>>;
  styles: 'ToggleButton' | 'ToggleButtonWithVariants';
  children?: React.ReactNode;
  color: string;
  border: string;
}

const ToggleButton: React.FC<ChildrenProps> = ({
  childrenValue,
  setToggleButtonsSelected,
  name,
  price,
  title,
  selectedValue,
  setSelectedValue,
  styles,
  color,
  border,
}) => {
  const isImgElement = React.isValidElement(childrenValue);

  const children = isImgElement ? (childrenValue as React.ReactElement<ImgElementProps>).props.data : childrenValue;

  const isSelected = selectedValue === children;

  const toggleButtonClicked = () => {
    if (setSelectedValue) setSelectedValue((prevValue) => (prevValue === children ? null : (children as string)));

    setToggleButtonsSelected((prevSelections) => {
      const newSelection = prevSelections.filter((item) => item.title !== title);

      const updatedSelection = isSelected ? newSelection : [...newSelection, { name, title, ingredient: children }];

      updatedSelection.sort((a, b) => (a.title && b.title ? a.title.localeCompare(b.title) : 0));

      return updatedSelection as TogglesValues[];
    });
  };

  return (
    <div className='flex flex-col gap-3 text-center select-none'>
      {styles === 'ToggleButtonWithVariants' ? (
        <Button
          className={`text-xs py-2 px-4 rounded-full border-2 cursor-pointer transition-transform duration-1000 ${
            isSelected
              ? `transform hover:scale-110 text-white ${color} ${border}`
              : 'transform hover:scale-110 text-black border-gray-500 bg-gradient-to-l from-gray-100 to-gray-300 '
          }`}
          onClick={toggleButtonClicked}
          type='button'
        >
          {childrenValue}
        </Button>
      ) : (
        <button
          className={`transform hover:scale-125 active:scale-100 w-10 h-10 text-xs text-black rounded-full border-2 flex justify-center items-center cursor-pointer transition duration-100 hover:bg-opacity-20 ${
            isSelected
              ? `transform hover:scale-125 active:scale-100 ${color} ${border} text-white `
              : 'border-gray-400 bg-gradient-to-l from-gray-100 to-gray-300'
          } `}
          onClick={toggleButtonClicked}
          type='button'
        >
          {childrenValue}
        </button>
      )}

      {price}
    </div>
  );
};

export default ToggleButton;
