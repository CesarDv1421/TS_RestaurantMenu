//Interfaces
import { useCartOrdersReturnType, TogglesValues, ExtraItem } from '../interfaces/CartOrder';

// Componentes
import SetQuanty from './SetQuanty';

// Custom Hooks
import useCartOrders from '../hooks/useCartOrders';

interface QuantyEditorType {
  id: number;
  quanty: number;
  buttonsValues: TogglesValues[];
  extras: ExtraItem[];
}

const QuantyEditor: React.FC<QuantyEditorType> = ({ id, quanty, buttonsValues, extras }) => {
  const { newQuanty, setNewQuanty } = useCartOrders(id, quanty, buttonsValues, extras) as useCartOrdersReturnType;

  return <SetQuanty quanty={newQuanty} setQuanty={setNewQuanty} />;
};

export default QuantyEditor;
