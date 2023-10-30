import useServicesPercentage, { ServicesPercentageResult } from '../hooks/useServicesPercentage';

const TotalPriceOrders = ({ price }: { price: number }) => {
  const { iva, subtotal, servicio, total, totalInBs, ivaPercentage, servicePercentage } = useServicesPercentage(
    price
  ) as ServicesPercentageResult;
  return (
    <div className='border-2 border-gray-200 mt-2 rounded-xl'>
      <div className='my-3'>
        <div className='flex justify-between mx-5'>
          <span className='text-xl'>Subtotal:</span>
          <span className='text-xl'>${subtotal}</span>
        </div>
        <div className='flex justify-between mx-5'>
          <span>IVA ({ivaPercentage}%):</span>
          <span>${iva.toFixed(2)}</span>
        </div>
        <div className='flex justify-between mx-5'>
          <span className='text-sm'>Servicio del {servicePercentage}%:</span>
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
    </div>
  );
};

export default TotalPriceOrders;
