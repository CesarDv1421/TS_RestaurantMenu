interface categoria {
  id: number;
  categoria: string;
}

export interface menuPrisma {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  img: string;
  id_categoria: number;
  categorias: categoria;
}

interface variante {
  id: number;
  variante: string;
}

export interface variantes {
  tipos_de_variantes: variante;
  precio: number;
}

interface ingrediente {
  id: number;
  ingrediente: string;
  titulo?: string;
}

export interface ingredientesOpcionales {
  id: number;
  ingredientes_opcionales: ingrediente;
}

interface extra {
  id: number;
  extra: string;
}

export interface extras {
  id: number;
  price: number;
  precio?: number;
  extras: extra;
}
