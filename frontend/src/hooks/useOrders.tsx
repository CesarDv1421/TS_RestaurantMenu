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

type OrdersMap = {
  [key: string]: TypeOrders[];
};

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
      const { ordersData, err } = await response.json();
      setOrders(ordersData);

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

  const renderCell = useCallback((order: TypeOrders, columnKey: React.Key) => {
    switch (columnKey) {
      case 'platos':
        return <div>{order.nombrePlato}</div>;
      case 'notasVariantes':
        const coffe = order.valoresPersonalizados;
        const custom = order.ingredientesOpcionales || order.extras;
        const variant = order.variantes;

        if (coffe.length > 0) {
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
                  {coffe.map(({ opcion, valor }) => (
                    <div key={opcion}>
                      {opcion} - {valor}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        if (custom.length > 0) {
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
                  {order.ingredientesOpcionales.length > 0 && <span>Sin:</span>}
                  {custom.map(({ ingrediente }) => {
                    return (
                      <div className='flex flex-col' key={ingrediente}>
                        <div>- {ingrediente}</div>
                      </div>
                    );
                  })}
                  {order.extras.length > 0 && <span className='py-5'> Con un extra de:</span>}
                  {order.extras.map(({ extra, precio }) => {
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

        if (variant) return <div>{variant}</div>;
        else return <div>-</div>;

      case 'cantidad':
        return <div>{order.cantidad}</div>;
      case 'total':
        return <div className='relative flex items-center gap-2'>${order.precioTotal}</div>;
    }
  }, []);

  return {
    fetchingOrders,
    columns,
    renderCell,
    orders,
  };
};

export default useOrders;
