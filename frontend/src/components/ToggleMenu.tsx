import React, { ReactElement, useEffect, useState } from 'react';

import { CartOrderTypes } from '../interfaces/CartOrder';

interface ChildProps {
  childrenValue: string;
  title: string;
  selectedValue: string | null;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | null>>;
}

// Definimos una interfaz para las props del componente ToggleMenu
interface ToggleMenuProps {
  children: React.ReactNode;
  title?: string;
  onAddToCart: CartOrderTypes[];
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({ children, title, onAddToCart }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  useEffect(() => {
    setSelectedValue(null);
  }, [onAddToCart]);

  return (
    <div className='select-none'>
      <h1>{title}</h1>
      <div className='flex justify-evenly'>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<ChildProps>, {
              childrenValue: child.props.children,
              title,
              selectedValue,
              setSelectedValue,
            });
          } else {
            // Manejo de otros tipos de children, como strings
            return child;
          }
        })}
      </div>
    </div>
  );
};

export default ToggleMenu;
