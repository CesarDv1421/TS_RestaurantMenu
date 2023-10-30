import css from './AddToCartMenu.module.css';

import { TogglesValues } from '../interfaces/CartOrder';

interface ChildrenProps {
  children: React.ReactNode;
  toggleButtonsSelected: TogglesValues[];
  toggleLength: number;
}

const AddToCartButton: React.FC<ChildrenProps> = ({ children }) => {
  return <div className={css.addCartContainer}>{children}</div>;
};

export default AddToCartButton;
