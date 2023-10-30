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
  cantidad: number;
  precioTotal: number;
  fechaCreacion: Date;
  nombrePlato: string;
  idCliente: number;
  variantes: string;
  valoresPersonalizados: {
    opcion: string;
    valor: string;
  }[];
  ingredientesOpcionales: {
    id: number;
    ingrediente: string;
  }[];
  extras: {
    id: number;
    extra: string;
    precio: number;
  }[];
}
