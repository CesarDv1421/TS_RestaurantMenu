import { useEffect } from 'react';
import { TypeOrders } from '../interfaces/Orders';

//Componentes
import Navbar from '../components/Navbar';
import TotalPriceOrders from '../components/TotalPriceOrders';
import useServicesPercentage, { ServicesPercentageResult } from '../hooks/useServicesPercentage';

//Custom Hook
import useOrders from '../hooks/useOrders';

//Moment
import moment from 'moment';

//Format
import { format } from 'timeago.js';

//Next UI
import { Accordion, AccordionItem, Chip } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@nextui-org/react';

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

const Orders = () => {
  const { fetchingOrders, columns, renderCell, numberOfOrders, orders } = useOrders();

  useEffect(() => {
    fetchingOrders();
  }, []);

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
