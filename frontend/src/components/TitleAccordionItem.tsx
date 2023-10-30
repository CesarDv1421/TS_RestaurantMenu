import { Chip } from '@nextui-org/react';

//interfaces
import useServicesPercentage from '../hooks/useServicesPercentage';
import { TypeOrders } from '../interfaces/Orders';

//Moment
import moment from 'moment';

//timeago
import { format } from 'timeago.js';

//Custom Hooks
import { ServicesPercentageResult } from '../hooks/useServicesPercentage';

const TitleAccordionItem = ({ valores, orderPrice }: { valores: TypeOrders[]; orderPrice: number }) => {
  const { total } = useServicesPercentage(orderPrice) as ServicesPercentageResult;

  return (
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
        {moment(valores[0].fechaCreacion).format('DD MMM YYYY')} - {moment(valores[0].fechaCreacion).format('hh:mm')}
      </span>
      <div className='border-2 border-gray-200' />
      <span className='text-primary'> ~ {format(valores[0].fechaCreacion)}</span>
    </div>
  );
};

export default TitleAccordionItem;
