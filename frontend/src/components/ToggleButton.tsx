import React from 'react';

import { TogglesValues } from '../interfaces/CartOrder';

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
  styles: string;
  children?: React.ReactNode;
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
}) => {
  const isImgElement = React.isValidElement(childrenValue);

  const children = isImgElement ? (childrenValue as React.ReactElement<ImgElementProps>).props.data : childrenValue;

  const isSelected = selectedValue === children;

  const toggleButtonClicked = () => {
    if (setSelectedValue) setSelectedValue((prevValue) => (prevValue === children ? null : (children as string)));

    setToggleButtonsSelected((prevSelections) => {
      const newSelection = prevSelections.filter((item) => item.title !== title);

      const updatedSelection = isSelected
        ? newSelection
        : [...newSelection, { name, title, ingredient: children as string }];

      updatedSelection.sort((a, b) => (a.title && b.title ? a.title.localeCompare(b.title) : 0));

      return updatedSelection as TogglesValues[];
    });
  };

  return (
    <div className='flex flex-col gap-3 text-center'>
      <button
        className={`${
          styles === 'ToggleButton'
            ? `w-10 h-10 text-xs text-black rounded-full border-2 flex justify-center items-center cursor-pointer transition duration-300 hover:bg-opacity-20 ${
                isSelected ? 'bg-opacity-50 border-gray-800' : 'border-gray-300 bg-opacity-10'
              } `
            : `text-xs py-2 px-4 rounded-full border-2 cursor-pointer transition-all duration-250 ${
                isSelected ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-400 bg-gray-100'
              }`
        }`}
        onClick={toggleButtonClicked}
        type='button'
      >
        {childrenValue}
      </button>

      {price}
    </div>
  );
};

export default ToggleButton;
