import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//Componentes
import InputPassword from './InputPassword.tsx';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

//Next UI
import { Link, Button } from '@nextui-org/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  useDisclosure as useSecondDisclosure,
} from '@nextui-org/modal';
import { Tabs, Tab, Input, Spinner } from '@nextui-org/react';

//Contexto => Carrito de Compras
import { CartOrdersContext } from '../context/CartOrdersContext.tsx';
//=>Token
import { AuthContext } from '../context/AuthContext.tsx';

//Interfaces
import { CartOrdersContextType } from '../interfaces/CartOrder';
import { ContextValue } from '../interfaces/AuthContext';

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
  type: string | '' | 'lastFourDigits' | 'captureOfTransaction' | 'cardNumber' | 'expirateDate' | 'cvvCode';
  styles: string;
  message: string;
}

interface EnvironmentVariables {
  VITE_IVA_PERCENTAGE?: number;
  VITE_SERVICE_PERCENTAGE?: number;
}

const TotalPriceCard = ({ children }: { children: number }) => {
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

  useEffect(() => {
    if (payConfirmed) {
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
      confirmPay();
    }
  }, [payConfirmed]);

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

  return (
    <div className='flex flex-col w-full'>
      <div className='my-3'>
        <div className='flex justify-between mx-5'>
          <span className='text-xl'>Subtotal:</span>
          <span className='text-xl'>${children.toFixed(2)}</span>
        </div>
        <div className='flex justify-between mx-5'>
          <span>IVA ({IVA_PERCENTAGE}%):</span>
          <span>${iva.toFixed(2)}</span>
        </div>
        <div className='flex justify-between mx-5'>
          <span className='text-sm'>Servicio del {SERVICE_PERCENTAGE}%:</span>
          <span className='text-sm'>${servicio.toFixed(2)}</span>
        </div>
        <div className='border border-dashed m-2 border-gray-600'></div>
        <div className='flex justify-between mx-5'>
          <span className='text-2xl'>Total:</span>
          <span className='text-2xl'>
            Bs {totalInBs} / ${total}
          </span>
        </div>
      </div>

      <div className='flex mx-5 gap-5 justify-evenly py-5'>
        <Button className='w-1/4' href='/menu' as={Link} color='secondary' showAnchorIcon variant='solid'>
          Regresar al Menu
        </Button>
        <Button
          onPress={onOpen}
          className='w-1/4'
          color='success'
          isDisabled={cartOrders.length === 0 ? true : false}
          variant='ghost'
        >
          Pagar
        </Button>
        <Modal
          backdrop='blur'
          scrollBehavior='inside'
          isOpen={isOpen}
          onClose={onClose}
          placement='center'
          size='3xl'
          shadow='sm'
          classNames={{
            backdrop: 'bg-[#292f47]/50 backdrop-opacity-60',
            base: ' border-3 border-green-500 dark:bg-[#19172c] ',
            closeButton: 'hover:bg-white/5 active:bg-white/10',
            wrapper: 'overflow-hidden',
          }}
        >
          <ModalContent>
            <ModalHeader className='flex flex-col items-center text-3xl gap-1'>Métodos de Pago</ModalHeader>
            <ModalBody>
              <Tabs
                fullWidth
                size='md'
                isDisabled={cartOrders.length > 0 ? false : true}
                aria-label='Tabs form'
                id='Tabs'
                selectedKey={selected}
                onSelectionChange={setSelected}
                classNames={{
                  tabList: 'flex justify-evenly gap-6 w-full relative',
                  cursor: 'w-full bg-[#2ecc71]',
                  tab: 'px-0 py-5',
                  tabContent: 'group-data-[selected=true]:text-[#ffffff] text-black',
                  panel: 'overflow-auto',
                }}
              >
                <Tab key='binance' title='Binance Pay'>
                  <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                    <h1 className='text-2xl'>Datos:</h1>
                    <div className='flex justify-between py-5 bg-gray-100 border-2 border-gray-200 rounded-xl'>
                      <div className='w-full text-center'>
                        <h2>Correo:</h2>
                        <span>cesardv1321@gmail.com</span>
                      </div>
                      <div className='border border-gray-200' />
                      <div className='w-full text-center'>
                        <h2>Número de Celular:</h2>
                        <span>0412 913 0178</span>
                      </div>
                      <div className='border border-gray-200' />
                      <div className='w-full text-center'>
                        <h2>ID Pay:</h2>
                        <span>410932355</span>
                      </div>
                    </div>

                    <h2 className='my-5 bg-gray-200 border-2 border-gray-300 text-2xl text-center rounded-xl p-5'>
                      Monto a pagar: {total}USDT
                    </h2>

                    <div className='flex flex-col gap-5 mt-5'>
                      <h1>- Inserte los últimos 4 digitos del número de referencia de la transacción</h1>
                      <Input
                        label='Últimos 4 dígitos'
                        type='number'
                        validationState={errMessage.type === 'BNlastFourDigits' ? 'invalid' : 'valid'}
                        errorMessage={errMessage.type === 'BNlastFourDigits' && errMessage.message}
                        value={binanceDataOfTransfer.lastFourDigits}
                        onValueChange={(newValue) => {
                          setBinanceDataOfTransfer({
                            ...binanceDataOfTransfer,
                            lastFourDigits: newValue,
                          });
                        }}
                      />
                      <div className='my-5'>
                        <h2 className='pb-2 block'>- Subir captura de la transaccion</h2>
                        <Input
                          type='file'
                          required
                          validationState={errMessage.type === 'BNcaptureOfTransaction' ? 'invalid' : 'valid'}
                          errorMessage={errMessage.type === 'BNcaptureOfTransaction' && errMessage.message}
                          value={binanceDataOfTransfer.captureOfTransaction}
                          onValueChange={(newValue) => {
                            setBinanceDataOfTransfer({
                              ...binanceDataOfTransfer,
                              captureOfTransaction: newValue,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className='flex gap-2 justify-end'>
                      <Button fullWidth className='text-lg py-5' type='submit' variant='ghost' color='success'>
                        Confirmo que pague {total} USDT
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key='paypal' title='Paypal'>
                  <div className='flex flex-col gap-4'>
                    <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
                      <input type='hidden' name='cmd' value='_s-xclick' />
                      <input type='hidden' name='hosted_button_id' value='THFW6YYVSBMLQ' />
                      <input type='hidden' name='currency_code' value='USD' />

                      <div className='flex gap-2 justify-end'>
                        <Button
                          fullWidth
                          className='text-lg py-5 my-5'
                          type='submit'
                          name='submit'
                          variant='ghost'
                          color='success'
                          isDisabled={cartOrders.length > 0 ? false : true}
                        >
                          Pagar {total}$ con Paypal
                        </Button>
                      </div>
                    </form>
                  </div>
                </Tab>
                <Tab key='pagoMovil' title='Pago Móvil'>
                  <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                    <h1 className='text-2xl'>Datos:</h1>
                    <div className='flex flex-col justify-center gap-5 w-ful border-2 border-gray-200 bg-gray-100 p-5 rounded-xl'>
                      <div className='flex justify-between'>
                        <h1>Banco:</h1>
                        <h2>Venezuela / Banesco</h2>
                      </div>
                      <div className='border border-gray-200' />
                      <div className='flex justify-between'>
                        <h1>Cédula:</h1>
                        <h2>28.588.786</h2>
                      </div>
                      <div className='border border-gray-200' />
                      <div className='flex justify-between'>
                        <h1>Número de Celular:</h1>
                        <h2>0412 913 0178</h2>
                      </div>
                    </div>

                    <h2 className='my-5 bg-gray-200 border-2 border-gray-300 text-2xl text-center rounded-xl p-5'>
                      Monto a pagar: {totalInBs}Bs
                    </h2>

                    <div className='flex flex-col gap-5'>
                      <h1>- Inserte los últimos 4 digitos del número de referencia de la transacción</h1>
                      <Input
                        label='Ultimos 4 digitos'
                        type='number'
                        validationState={errMessage.type === 'PMlastFourDigits' ? 'invalid' : 'valid'}
                        errorMessage={errMessage.type === 'PMlastFourDigits' && errMessage.message}
                        value={pmDataOfTransfer.lastFourDigits}
                        onValueChange={(newValue) => {
                          setPmDataOfTransfer({
                            ...pmDataOfTransfer,
                            lastFourDigits: newValue,
                          });
                        }}
                      />
                      <div className='my-5'>
                        <h2 className='pb-2 block'>- Subir captura de la transacción</h2>
                        <Input
                          type='file'
                          required
                          validationState={errMessage.type === 'PMcaptureOfTransaction' ? 'invalid' : 'valid'}
                          errorMessage={errMessage.type === 'PMcaptureOfTransaction' && errMessage.message}
                          value={pmDataOfTransfer.captureOfTransaction}
                          onValueChange={(newValue) => {
                            setPmDataOfTransfer({
                              ...pmDataOfTransfer,
                              captureOfTransaction: newValue,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className='flex gap-2 justify-end'>
                      <Button
                        fullWidth
                        type='submit'
                        className='text-lg py-5'
                        isDisabled={cartOrders.length > 0 ? false : true}
                        variant='ghost'
                        color='success'
                      >
                        Confirmo que ya pagué los {totalInBs}Bs
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key='visaMastercard' title='Visa / MasterCard'>
                  <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                    <InputPassword
                      label='Numero de Tarjeta'
                      validationState={errMessage.type === 'cardNumber' ? 'invalid' : 'valid'}
                      errorMessage={errMessage.type === 'cardNumber' ? errMessage.message : ''}
                      value={cardData.cardNumber}
                      onValueChange={(newValue) => {
                        setCardData({
                          ...cardData,
                          cardNumber: newValue,
                        });
                      }}
                    />
                    <Input label='Fecha de vencimiento' placeholder='Enter your email' type='date' />
                    <InputPassword
                      label='Código CVV'
                      validationState={errMessage.type === 'cvvCode' ? 'invalid' : 'valid'}
                      errorMessage={errMessage.type === 'cvvCode' && errMessage.message}
                      value={cardData.cvvCode}
                      onValueChange={(newValue) => {
                        setCardData({
                          ...cardData,
                          cvvCode: newValue,
                        });
                      }}
                    />
                    <Button
                      fullWidth
                      type='submit'
                      className='text-lg py-5'
                      isDisabled={cartOrders.length > 0 ? false : true}
                      variant='ghost'
                      color='success'
                    >
                      Pagar ${total}
                    </Button>
                  </form>
                </Tab>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal
          backdrop='blur'
          size='2xl'
          isOpen={customIsOpen}
          onClose={customOnClose}
          isKeyboardDismissDisabled={true}
          onOpenChange={onOpenChange}
          isDismissable={false}
          classNames={{
            body: 'py-6',
            backdrop: 'backdrop-opacity-60',
            base: 'border-3 border-green-500',
            closeButton: 'hidden',
          }}
        >
          <ModalContent>
            <ModalBody>
              {payConfirmed ? (
                <main className='grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
                  <div className='text-center'>
                    <p className='text-2xl font-semibold text-green-500'>Pago realizado con éxito</p>
                    <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                      Gracias por tu compra
                    </h1>
                    <p className='mt-6 text-gray-600'>Tu apoyo significa mucho para nosotros.</p>
                    <div className='mt-10 flex items-center justify-center gap-x-6'>
                      <Button href='/orders' as={Link} color='primary' showAnchorIcon variant='solid'>
                        Ver mis órdenes
                      </Button>
                      <a href='/menu' className='text-sm font-semibold text-gray-900'>
                        Volver al Menu ...
                      </a>
                    </div>
                  </div>
                </main>
              ) : (
                <Spinner size='lg' label='Confirmando Compra ...' color='success' labelColor='success' />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default TotalPriceCard;