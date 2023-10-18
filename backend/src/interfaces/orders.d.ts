import { ingrediente, menuPrisma, variante } from '../interfaces/menu';

interface buttonsValues {
  name: string;
  title: string;
  ingredient: string;
}

interface extra {
  id: number;
  ingredient: string;
  extra: string;
  precio: number;
}

export interface ordersInComing {
  id: number;
  name: string;
  quanty: number;
  price: number;
  buttonsValues: buttonsValues[];
  extras: extra[];
  typeOfProduct: 'Variants' | 'Coffee' | 'Custom' | 'Normal';
}

export interface ordenes {
  id: number;
  id_orden: number;
  id_platos: number;
  cantidad: number;
  precio_total: number;
  id_cliente: number;
  fecha_creacion: Date;
  menu: menuPrisma;
}

export type values = {
  id: number;
  titulo?: string;
  variante?: string;
  ingrediente?: string | null;
} | null;

export interface extras {
  id: number;
  extra: string;
  precio: Decimal;
}

export interface ordersData {
  id: number;
  idOrden: number;
  cantidad: number;
  precioTotal: number;
  fechaCreacion: Date;
  nombrePlato: string;
  idCliente: number;
  valores: values[];
  extras: extras[];
}
