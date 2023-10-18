// export interface OrderValues {
//   id: number;
//   idOrden?: number;
//   variante?: string;
//   ingrediente?: string;
//   titulo?: string;
//   opciones?: string;
// }

// export interface OrderExtras {
//   id: number;
//   precio: number;
//   extra: string;
// }

export interface TypeOrders {
  id: number;
  idCliente: number;
  idOrden: number;
  nombrePlato: string;
  precioTotal: number;
  cantidad: number;
  fechaCreacion: Date;
  valores: {
    id: number;
    idOrden?: number;
    variante?: string;
    ingrediente?: string;
    titulo?: string;
    opciones?: string;
  }[];
  extras: {
    id: number;
    precio: number;
    extra: string;
  }[];
}[]
