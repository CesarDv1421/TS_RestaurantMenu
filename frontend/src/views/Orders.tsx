import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

//Interfaces
import { ContextValue } from '../interfaces/AuthContext';
import { TypeOrders } from '../interfaces/Orders';

//Componentes
import Navbar from '../components/Navbar';
import TotalPriceOrders from '../components/TotalPriceOrders';
import useServicesPercentage, { ServicesPercentageResult } from '../hooks/useServicesPercentage';

//Context
import { AuthContext } from '../context/AuthContext';

//Moment
import moment from 'moment';

//Format
import { format } from 'timeago.js';

//Next UI
import { Accordion, AccordionItem, Chip } from '@nextui-org/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

const motionProps = {
  variants: {
    enter: {
      y: 0,
      opacity: 1,
      height: 'auto',
      transition: {
        height: {
          type: 'spring',
          stiffness: 500,
          damping: 30,
          duration: 1,
        },
        opacity: {
          easings: 'ease',
          duration: 1,
        },
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      height: 0,
      transition: {
        height: {
          easings: 'ease',
          duration: 0.25,
        },
        opacity: {
          easings: 'ease',
          duration: 0.3,
        },
      },
    },
  },
};

interface OrdersMap {
  [key: string]: TypeOrders[];
}

const Orders = () => {
  const [orders, setOrders] = useState<OrdersMap>({});
  const navigate = useNavigate();

  //Context
  //=> Token, informacion del usuario y cierre de sesion
  const { userToken, logout } = useContext(AuthContext) as ContextValue;

  useEffect(() => {
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
    fetchingOrders();
  }, []);

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

  return (
    <main className='flex h-screen'>
      <Navbar />
      <div className='w-full flex flex-col'>
        <h1 className='text-2xl m-5'>Órdenes</h1>
        <div className='flex flex-col overflow-auto mx-3 mb-3 p-3 border-2 border-gray-200 rounded-lg'>
          {numberOfOrders.length > 0 ? (
            <>
              <Accordion
                showDivider={false}
                selectionMode='multiple'
                className=' flex flex-col gap-5 py-5 h-max'
                variant='shadow'
                motionProps={motionProps}
                itemClasses={{
                  base: ' border border-gray-200 rounded-xl border-2',
                  title: 'font-normal text-medium',
                  startContent: 'm-2 bg-gray-200 rounded-md p-2',
                  trigger: 'data-[hover=true]:bg-default-100 rounded-lg h-14',
                  indicator: 'text-medium',
                  content: 'text-small px-2',
                }}
              >
                {numberOfOrders.map((data) => {
                  const valores = orders[data];
                  const idOrdenGlobal = valores[0].idOrden;
                  const orderPrice = Number(valores.reduce((acc, { precioTotal }) => acc + precioTotal, 0).toFixed(2));
                  const { total } = useServicesPercentage(orderPrice) as ServicesPercentageResult;

                  return (
                    <AccordionItem
                      key={data}
                      aria-label='Connected devices'
                      startContent={`#${idOrdenGlobal}`}
                      title={
                        <div className='flex justify-evenly items-center'>
                          <span>
                            <span className='text-green-500'>
                              <Chip className='text-white' color='success' variant='solid'>
                                Orden completada
                              </Chip>
                            </span>
                          </span>
                          <div className='border-2 border-gray-200' />
                          <span>
                            <span className='text-green-600'> Total ${total}</span>
                          </span>
                          <div className='border-2 border-gray-200' />
                          <span>
                            {moment(valores[0].fechaCreacion).format('DD MMM YYYY')} -{' '}
                            {moment(valores[0].fechaCreacion).format('hh:mm')}
                          </span>
                          <div className='border-2 border-gray-200' />
                          <span className='text-primary'> ~ {format(valores[0].fechaCreacion)}</span>
                        </div>
                      }
                    >
                      <Table aria-label='Example table with custom cells'>
                        <TableHeader columns={columns}>
                          {(column) => <TableColumn key={column.id}>{column.name}</TableColumn>}
                        </TableHeader>
                        <TableBody items={valores}>
                          {(item: TypeOrders) => (
                            <TableRow key={`${item.id}-${item.idOrden}`}>
                              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>

                      <TotalPriceOrders>{orderPrice}</TotalPriceOrders>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </>
          ) : (
            <div className='border border-gray-200 rounded-xl p-5 flex flex-col items-center'>
              <h1 className='text-3xl'>No hay ordenes existentes</h1>
              <Button className='m-5' color='primary' variant='ghost'>
                Ver Menu...
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orders;
