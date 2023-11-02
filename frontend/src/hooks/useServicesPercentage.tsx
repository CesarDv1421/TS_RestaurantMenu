//Helpers
import formatNumberWithPoints from '../helpers/formatNumberPoints';

export interface ServicesPercentageResult {
  ivaPercentage: number;
  servicePercentage: number;
  servicio: number;
  iva: number;
  total: number;
  subtotal: number;
  totalInBs: string;
}

function useServicesPercentage(price: number): ServicesPercentageResult {
  const env = import.meta.env;

  const IVA_PERCENTAGE = Number(env.VITE_IVA_PERCENTAGE) || 0;
  const SERVICE_PERCENTAGE = Number(env.VITE_SERVICE_PERCENTAGE) || 0;

  const servicio = (price * SERVICE_PERCENTAGE) / 100;
  const iva = (price * IVA_PERCENTAGE) / 100;
  const subtotal = price;

  const total = Number((subtotal + servicio + iva).toFixed(2));
  const totalInBs = formatNumberWithPoints(Number((total * 34).toFixed(2)));

  return {
    ivaPercentage: IVA_PERCENTAGE,
    servicePercentage: SERVICE_PERCENTAGE,
    servicio,
    iva,
    total,
    subtotal,
    totalInBs,
  };
}

export default useServicesPercentage;
