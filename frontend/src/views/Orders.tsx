import { useEffect } from 'react';
import { TypeOrders } from '../interfaces/Orders';

//Componentes
import Navbar from '../components/Navbar';
import TotalPriceOrders from '../components/TotalPriceOrders';

//Custom Hook
import useOrders from '../hooks/useOrders';

//Next UI
import { Accordion, AccordionItem } from '@nextui-org/react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from '@nextui-org/react';
import TitleAccordionItem from '../components/TitleAccordionItem';

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
  const { fetchingOrders, columns, renderCell, orders } = useOrders();

  useEffect(() => {
    fetchingOrders();
  }, []);

  const numberOfOrders = Object.keys(orders);

  return (
    <main className='flex h-screen'>
      <Navbar />
      <div className='w-full flex flex-col'>
        <h1 className='text-2xl m-5'>Órdenes</h1>
        <div className='flex flex-col h-full overflow-auto mx-2 mb-2 p-3 border-2 bg-gray-100 border-gray-300 rounded-lg'>
          <div className='px-5 pt-2 pb-4 flex'>
            <span className='px-7'>ID</span>
            <div className='flex w-full border-red-500'>
              <span className='w-full text-center'>Status</span>
              <span className='w-full text-center'>Total</span>
              <span className='w-full text-center'>Fecha de creación</span>
              <span className='w-full text-center'>Creada hace ...</span>
            </div>
          </div>
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
                  const orderPrice = Number(valores.reduce((acc, { precioTotal }) => acc + precioTotal, 0).toFixed(2));
                  return (
                    <AccordionItem
                      key={data}
                      aria-label='Connected devices'
                      startContent={`#${data}`}
                      title={<TitleAccordionItem valores={valores} orderPrice={orderPrice} />}
                    >
                      <Table aria-label='Example table with custom cells'>
                        <TableHeader columns={columns}>
                          {(column) => <TableColumn key={column.id}>{column.name}</TableColumn>}
                        </TableHeader>
                        <TableBody items={valores}>
                          {(item: TypeOrders) => (
                            <TableRow key={`${item.id}`}>
                              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <TotalPriceOrders price={orderPrice} />
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </>
          ) : (
            <div className='p-5 flex flex-col h-full items-center justify-center'>
              <h1 className='text-3xl'>No hay ordenes existentes...</h1>
              <Button variant='ghost' className='text-medium my-5' as={Link} href='/menu' color='primary'>
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
