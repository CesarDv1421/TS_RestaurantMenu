import css from './AddToCartMenu.module.css';

import { TogglesValues } from '../interfaces/CartOrder';

interface ChildrenProps {
  children: React.ReactNode;
  toggleButtonsSelected: TogglesValues[];
  toggleLength: number;
}

const AddToCartButton: React.FC<ChildrenProps> = ({ children, toggleButtonsSelected, toggleLength }) => {
  return <>{toggleButtonsSelected.length >= toggleLength && <div className={css.addCartContainer}>{children}</div>}</>;
};

export default AddToCartButton;
