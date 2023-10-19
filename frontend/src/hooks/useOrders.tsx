import { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

//Interfaces
import { ContextValue } from '../interfaces/AuthContext';
import { TypeOrders } from '../interfaces/Orders';

import { Button, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';

//Context
import { AuthContext } from '../context/AuthContext';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

interface OrdersMap {
  [key: string]: TypeOrders[];
}

const useOrders = () => {
  const [orders, setOrders] = useState<OrdersMap>({});
  const navigate = useNavigate();

  //Context
  //=> Token, informacion del usuario y cierre de sesion
  const { userToken, logout } = useContext(AuthContext) as ContextValue;

  const fetchingOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userToken}`,
        },
      });
      const { ordenesAgrupadas, err } = await response.json();
      setOrders(ordenesAgrupadas);

      if (err) {
        logout();
        navigate('/auth');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { name: 'Platos', id: 'platos' },
    { name: 'Notas / Variantes', id: 'notasVariantes' },
    { name: 'Cantidad', id: 'cantidad' },
    { name: 'Total', id: 'total' },
  ];

  const renderCell = useCallback((item: TypeOrders, columnKey: React.Key) => {
    switch (columnKey) {
      case 'platos':
        return <div>{item.nombrePlato}</div>;
      case 'notasVariantes':
        const coffe = item.valores[0]?.ingrediente && item.valores[0]?.titulo;
        const custom = (item.valores[0]?.ingrediente && !item.valores[0]?.titulo) || item.extras[0]?.extra;
        const variant = item.valores[0]?.variante;

        if (coffe) {
          return (
            <Popover
              placement='bottom'
              showArrow={true}
              classNames={{
                base: 'py-3 px-4 border border-default-200 bg-gradient-to-br from-white to-default-300 dark:from-default-100 dark:to-default-50',
                arrow: 'bg-default-200',
              }}
            >
              <PopoverTrigger>
                <Button color='primary' variant='ghost'>
                  Ver Notas...
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='px-1 py-2'>
                  {item.valores.map(({ ingrediente, titulo }) => {
                    return (
                      <div key={ingrediente}>
                        {titulo} - {ingrediente}
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        if (custom) {
          return (
            <Popover
              placement='bottom'
              showArrow={true}
              classNames={{
                base: 'py-3 px-4 border border-default-200 bg-gradient-to-br from-white to-default-300 dark:from-default-100 dark:to-default-50',
                arrow: 'bg-default-200',
              }}
            >
              <PopoverTrigger>
                <Button color='primary' variant='ghost'>
                  Ver Notas...
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='px-1 py-2'>
                  {item.valores.length > 0 && <span>Sin:</span>}
                  {item.valores.map(({ ingrediente }) => {
                    return (
                      <div className='flex flex-col' key={ingrediente}>
                        <div>- {ingrediente}</div>
                      </div>
                    );
                  })}
                  {item.extras.length > 0 && <span className='py-5'> Con un extra de:</span>}
                  {item.extras.map(({ extra, precio }) => {
                    return (
                      <div key={extra}>
                        - {extra} (+${precio})
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        if (variant) {
          return item.valores.map(({ variante }) => {
            return <div key={variante}>{variante}</div>;
          });
        }

        return <div>-</div>;

      case 'cantidad':
        return <div>{item.cantidad}</div>;
      case 'total':
        return <div className='relative flex items-center gap-2'>${item.precioTotal}</div>;
    }
  }, []);

  const numberOfOrders = Object.keys(orders);

  return {
    fetchingOrders,
    columns,
    renderCell,
    numberOfOrders,
		orders
  };
};

export default useOrders;
