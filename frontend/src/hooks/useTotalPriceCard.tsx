import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//Contexto => Carrito de Compras
import { CartOrdersContext } from '../context/CartOrdersContext.tsx';
//=>Token
import { AuthContext } from '../context/AuthContext.tsx';

//Interfaces
import { CartOrdersContextType } from '../interfaces/CartOrder';
import { ContextValue } from '../interfaces/AuthContext';

import { useDisclosure, useDisclosure as useSecondDisclosure } from '@nextui-org/modal';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

interface CardData {
  cardNumber: string;
  expiresDate: Date;
  cvvCode: string;
}

interface dataOfTransfer {
  lastFourDigits: string;
  captureOfTransaction: string;
}

interface VerifyDataOfTransaction {
  type: string | 'lastFourDigits' | 'captureOfTransaction' | 'cardNumber' | 'expirateDate' | 'cvvCode';
  styles: string;
  message: string;
}

interface EnvironmentVariables {
  VITE_IVA_PERCENTAGE?: number;
  VITE_SERVICE_PERCENTAGE?: number;
}

const useTotalPriceCard = (children: number) => {
  //States
  const [selected, setSelected] = useState('binance'); //Estado necesario del Tab de NextUI que especifica el Tab del metodo de pago.
  const [payConfirmed, setPayConfirmed] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    //Guarda el value de los inputs de el metodo de pago Visa/MasterdCard
    cardNumber: '',
    expiresDate: new Date(),
    cvvCode: '',
  });
  const [binanceDataOfTransfer, setBinanceDataOfTransfer] = useState<dataOfTransfer>({
    //Guarda el value de los inputs que verifican los datos de la transferencia
    lastFourDigits: '',
    captureOfTransaction: '',
  });
  const [pmDataOfTransfer, setPmDataOfTransfer] = useState<dataOfTransfer>({
    //Guarda el value de los inputs que verifican los datos de la transferencia
    lastFourDigits: '',
    captureOfTransaction: '',
  });
  const [errMessage, setErrorMessage] = useState<VerifyDataOfTransaction>({
    //Guarda los mensajes que error
    type: '',
    styles: '',
    message: '',
  });

  //Context => Órdenes del Carrito de Compras
  const { cartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;
  //=> Token
  const { userToken, logout } = useContext(AuthContext) as ContextValue;

  //Hooks
  const navigate = useNavigate();
  //Custom Hooks
  const { isOpen, onOpen, onClose } = useDisclosure(); //Custom Hook de NextUI
  const { isOpen: customIsOpen, onOpen: customOnOpen, onOpenChange, onClose: customOnClose } = useSecondDisclosure(); //Custom Hook de NextUI para usar un segundo modal y cambiando nombres para evitar errores

  const env = import.meta.env as EnvironmentVariables;

  const IVA_PERCENTAGE = Number(env.VITE_IVA_PERCENTAGE) || 0;
  const SERVICE_PERCENTAGE = Number(env.VITE_SERVICE_PERCENTAGE) || 0;

  const servicio = (children * SERVICE_PERCENTAGE) / 100;
  const iva = (children * IVA_PERCENTAGE) / 100;
  const subtotal = children + servicio + iva;

  const total = subtotal.toFixed(2);
  const totalInBs = (parseFloat(total) * 34).toFixed(2);

  const inputErrMessage = (type: string, styles: string, message: string) => {
    setErrorMessage({ type: type, styles: styles, message: message });

    setTimeout(() => {
      setErrorMessage({ type: '', styles: '', message: '' });
    }, 2000);
  };

  const confirmPay = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(
          cartOrders.map((order) => ({
            ...order,
            price: (order.price || 0) * order.quanty,
          }))
        ),
      });
      const { err } = await response.json();

      if (err) {
        logout();
        console.log(err);
        navigate('/auth');
      }

      // if (response.status === 200) {
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selected === 'pagoMovil') {
      if (
        (pmDataOfTransfer.lastFourDigits.length > 0 && pmDataOfTransfer.lastFourDigits.length < 4) ||
        pmDataOfTransfer.lastFourDigits.length > 4
      )
        return inputErrMessage('PMlastFourDigits', 'invalid', 'La cantidad de caracteres requerida es de 4');

      if (!pmDataOfTransfer.lastFourDigits)
        return inputErrMessage('PMlastFourDigits', 'invalid', 'El campo es requerido');

      if (!pmDataOfTransfer.captureOfTransaction)
        return inputErrMessage('PMcaptureOfTransaction', 'invalid', 'La captura de la transacción es requerida');
    }

    if (selected === 'binance') {
      if (
        (binanceDataOfTransfer.lastFourDigits.length > 0 && binanceDataOfTransfer.lastFourDigits.length < 4) ||
        binanceDataOfTransfer.lastFourDigits.length > 4
      )
        return inputErrMessage('BNlastFourDigits', 'invalid', 'La cantidad de caracteres requerida es de 4');

      if (!binanceDataOfTransfer.lastFourDigits)
        return inputErrMessage('BNlastFourDigits', 'invalid', 'El campo es requerido');

      if (!binanceDataOfTransfer.captureOfTransaction)
        return inputErrMessage('BNcaptureOfTransaction', 'invalid', 'La captura de la transacción es requerida');
    }

    if (selected === 'visaMastercard') {
      if (cardData.cardNumber.length < 16 || cardData.cardNumber.length > 16) {
        return inputErrMessage('cardNumber', 'invalid', 'Debe tener 16 dígitos');
      }
      if (cardData.cvvCode.length < 3 || cardData.cvvCode.length < 3)
        return inputErrMessage('cvvCode', 'invalid', 'Debe tener 3 dígitos');
    }

    customOnOpen();
    setTimeout(() => {
      customOnClose();
      setPayConfirmed(true);
      localStorage.removeItem('cartOrders');
      customOnOpen();
    }, 4200);
  };
  return {
    setSelected,
    payConfirmed,
    setCardData,
    setBinanceDataOfTransfer,
    setPmDataOfTransfer,
    errMessage,
    isOpen,
    onOpen,
    onClose,
    customIsOpen,
    customOnOpen,
    customOnClose,
    onOpenChange,
    totalInBs,
    confirmPay,
    onSubmit,
    IVA_PERCENTAGE,
    SERVICE_PERCENTAGE,
    servicio,
    iva,
    total,
    selected,
    binanceDataOfTransfer,
    pmDataOfTransfer, 
    cardData,
  };
};

export default useTotalPriceCard;
