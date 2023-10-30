const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const main = async () => {
  const categorias = [
    {
      id: 1,
      categoria: 'Hamburguesas',
    },
    {
      id: 2,
      categoria: 'Alitas de Pollo',
    },
    {
      id: 3,
      categoria: 'Sushi',
    },
    {
      id: 4,
      categoria: 'Cachapas',
    },
    {
      id: 5,
      categoria: 'Cafe',
    },
  ];

  const menu = [
    {
      id: 1,
      nombre: 'Cachapa Tradicional',
      descripcion: 'Tradicional',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cachapas' } },
    },
    {
      id: 2,
      nombre: 'Cachapa Porcino',
      descripcion: 'Cachapa acompanada de tocino y costilla de cerdo',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cachapas' } },
    },
    {
      id: 3,
      nombre: 'Cachapa Bondiola',
      descripcion: 'Cachapa acompanado de pulpa de cerdo',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cachapas' } },
    },
    {
      id: 4,
      nombre: 'Chicken Wings BBQ',
      descripcion: 'Alitas de pollo con BBQ',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Alitas de Pollo' } },
    },
    {
      id: 5,
      nombre: 'Chicken Wings HM',
      descripcion: 'Alitas de pollo con miel mostaza',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Alitas de Pollo' } },
    },
    {
      id: 6,
      nombre: 'Chicken Wings Anguila',
      descripcion: 'Alitas de pollo con salsa Anguila',
      precio: null,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Alitas de Pollo' } },
    },
    {
      id: 7,
      nombre: 'Chicken Burguer',
      descripcion: 'Hamburguesa de pollo',
      precio: 4.45,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Hamburguesas' } },
    },
    {
      id: 8,
      nombre: 'Meat Burguer',
      descripcion: 'Hamburguesa de carne de res',
      precio: 4.65,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Hamburguesas' } },
    },
    {
      id: 9,
      nombre: 'Furai Chicken',
      descripcion: 'Roll tempura con pollo frito y queso crema',
      precio: 7.49,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Sushi' } },
    },
    {
      id: 10,
      nombre: 'Alabama Roll',
      descripcion: 'Roll frio relleno de aguacate, queso crema, cangrejo y cebollin',
      precio: 7.99,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Sushi' } },
    },
    {
      id: 11,
      nombre: 'Caramel Frappucino',
      descripcion: 'Sirope de caramelo con cafe, leche y crema batida',
      precio: 3.95,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cafe' } },
    },
    {
      id: 12,
      nombre: 'Chocolate Frappucino',
      descripcion: 'Chocolate con cafe, leche y crema batida',
      precio: 4.51,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cafe' } },
    },
    {
      id: 13,
      nombre: 'Coffe Latte Frappucino',
      descripcion: 'Cafe especial con crema de chocolate y crema batida',
      precio: 4.79,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cafe' } },
    },
    {
      id: 14,
      nombre: 'Peppermint Macchiato',
      descripcion: 'Menta fresca con chocolate y crema batida',
      precio: 5.34,
      img: 'coffee.jpg',
      categoria: { connect: { categoria: 'Cafe' } },
    },
  ];

  const extras = [
    {
      id: 1,
      extra: 'Carne de res',
    },
    {
      id: 2,
      extra: 'Papas Fritas',
    },
    {
      id: 3,
      extra: 'Salsa',
    },
    {
      id: 4,
      extra: 'Aros de Cebolla',
    },
    {
      id: 5,
      extra: 'Queso fundido',
    },
    {
      id: 6,
      extra: 'Aguacate',
    },
  ];

  const ingredientes_opcionales = [
    {
      id: 1,
      ingrediente: 'Tomate',
    },
    {
      id: 2,
      ingrediente: 'Cebolla',
    },
    {
      id: 3,
      ingrediente: 'Lechuga',
    },
    {
      id: 4,
      ingrediente: 'Pepinillos',
    },
    {
      id: 5,
      ingrediente: 'Salsa',
    },
    {
      id: 6,
      ingrediente: 'Tocineta',
    },
  ];

  const opciones_personalizados_valores = [
    {
      id: 1,
      id_opcion_personalizada: { connect: { opcion: 'Mood' } },
      valor: 'Frío',
    },
    {
      id: 2,
      id_opcion_personalizada: { connect: { opcion: 'Mood' } },
      valor: 'Caliente',
    },
    {
      id: 3,
      id_opcion_personalizada: { connect: { opcion: 'Tamaño' } },
      valor: 'S',
    },
    {
      id: 4,
      id_opcion_personalizada: { connect: { opcion: 'Tamaño' } },
      valor: 'M',
    },
    {
      id: 5,
      id_opcion_personalizada: { connect: { opcion: 'Tamaño' } },
      valor: 'L',
    },
    {
      id: 6,
      id_opcion_personalizada: { connect: { opcion: 'Azúcar' } },
      valor: '30%',
    },
    {
      id: 7,
      id_opcion_personalizada: { connect: { opcion: 'Azúcar' } },
      valor: '50%',
    },
    {
      id: 8,
      id_opcion_personalizada: { connect: { opcion: 'Azúcar' } },
      valor: '70%',
    },
    {
      id: 9,
      id_opcion_personalizada: { connect: { opcion: 'Hielo' } },
      valor: '30%',
    },
    {
      id: 10,
      id_opcion_personalizada: { connect: { opcion: 'Hielo' } },
      valor: '50%',
    },
    {
      id: 11,
      id_opcion_personalizada: { connect: { opcion: 'Hielo' } },
      valor: '70%',
    },
  ];

  const opciones_personalizados = [
    {
      id: 1,
      opcion: 'Mood',
    },
    {
      id: 2,
      opcion: 'Tamaño',
    },
    {
      id: 3,
      opcion: 'Azúcar',
    },
    {
      id: 4,
      opcion: 'Hielo',
    },
  ];

  const roles = [
    {
      id: 1,
      roles: 'cliente',
    },
    {
      id: 2,
      roles: 'admin',
    },
  ];

  const tipos_de_variantes = [
    {
      id: 1,
      variante: '1/2 Queso',
    },
    {
      id: 2,
      variante: 'Queso Completo',
    },
    {
      id: 3,
      variante: 'Baby (6)',
    },
    {
      id: 4,
      variante: 'Junior (18)',
    },
    {
      id: 5,
      variante: 'Family (30)',
    },
  ];

  const platos_con_variantes = [
    {
      id: 1,
      id_menu: { connect: { nombre: 'Cachapa tradicional' } },
      id_tipos_de_variantes: { connect: { variante: '1/2 Queso' } },
      precio: 1.95,
    },
    {
      id: 2,
      id_menu: { connect: { nombre: 'Cachapa tradicional' } },
      id_tipos_de_variantes: { connect: { variante: 'Queso Completo' } },
      precio: 2.95,
    },
    {
      id: 3,
      id_menu: { connect: { nombre: 'Cachapa Porcino' } },
      id_tipos_de_variantes: { connect: { variante: '1/2 Queso' } },
      precio: 5.95,
    },
    {
      id: 4,
      id_menu: { connect: { nombre: 'Cachapa Porcino' } },
      id_tipos_de_variantes: { connect: { variante: 'Queso Completo' } },
      precio: 7.65,
    },
    {
      id: 5,
      id_menu: { connect: { nombre: 'Cachapa Bondiola' } },
      id_tipos_de_variantes: { connect: { variante: '1/2 Queso' } },
      precio: 3.5,
    },
    {
      id: 6,
      id_menu: { connect: { nombre: 'Cachapa Bondiola' } },
      id_tipos_de_variantes: { connect: { variante: 'Queso Completo' } },
      precio: 4.75,
    },
    {
      id: 7,
      id_menu: { connect: { nombre: 'Chicken Wings BBQ' } },
      id_tipos_de_variantes: { connect: { variante: 'Baby (6)' } },
      precio: 4.99,
    },
    {
      id: 8,
      id_menu: { connect: { nombre: 'Chicken Wings BBQ' } },
      id_tipos_de_variantes: { connect: { variante: 'Junior (18)' } },
      precio: 7.45,
    },
    {
      id: 9,
      id_menu: { connect: { nombre: 'Chicken Wings BBQ' } },
      id_tipos_de_variantes: { connect: { variante: 'Family (30)' } },
      precio: 12.5,
    },
    {
      id: 10,
      id_menu: { connect: { nombre: 'Chicken Wings HM' } },
      id_tipos_de_variantes: { connect: { variante: 'Baby (6)' } },
      precio: 4.99,
    },
    {
      id: 11,
      id_menu: { connect: { nombre: 'Chicken Wings HM' } },
      id_tipos_de_variantes: { connect: { variante: 'Junior (18)' } },
      precio: 7.45,
    },
    {
      id: 12,
      id_menu: { connect: { nombre: 'Chicken Wings HM' } },
      id_tipos_de_variantes: { connect: { variante: 'Family (30)' } },
      precio: 12.5,
    },
    {
      id: 13,
      id_menu: { connect: { nombre: 'Chicken Wings Anguila' } },
      id_tipos_de_variantes: { connect: { variante: 'Baby (6)' } },
      precio: 4.99,
    },
    {
      id: 14,
      id_menu: { connect: { nombre: 'Chicken Wings Anguila' } },
      id_tipos_de_variantes: { connect: { variante: 'Junior (18)' } },
      precio: 7.45,
    },
    {
      id: 15,
      id_menu: { connect: { nombre: 'Chicken Wings Anguila' } },
      id_tipos_de_variantes: { connect: { variante: 'Family (30)' } },
      precio: 12.5,
    },
  ];

  const platos_con_ingredientes = [
    {
      id: 1,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Tomate' } },
    },
    {
      id: 2,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Cebolla' } },
    },
    {
      id: 3,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Lechuga' } },
    },
    {
      id: 4,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Pepinillos' } },
    },
    {
      id: 5,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Salsa' } },
    },
    {
      id: 6,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Tocineta' } },
    },
    {
      id: 7,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Tomate' } },
    },
    {
      id: 8,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Cebolla' } },
    },
    {
      id: 9,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Lechuga' } },
    },
    {
      id: 10,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Pepinillos' } },
    },
    {
      id: 11,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Salsa' } },
    },
    {
      id: 12,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_ingredientes_opcionales: { connect: { ingrediente: 'Tocineta' } },
    },
  ];

  const platos_con_extras = [
    {
      id: 1,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_extra: { connect: { ingrediente: 'Aros de Cebolla' } },
      price: 2.95,
    },
    {
      id: 2,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_extra: { connect: { ingrediente: 'Carne de res' } },
      price: 0.95,
    },
    {
      id: 3,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_extra: { connect: { ingrediente: 'Papas Fritas' } },
      price: 0.85,
    },
    {
      id: 4,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_extra: { connect: { ingrediente: 'Queso fundido' } },
      price: 1.45,
    },
    {
      id: 5,
      id_menu: { connect: { nombre: 'Chicken Burguer' } },
      id_extra: { connect: { ingrediente: 'Salsa' } },
      price: 1.95,
    },
    {
      id: 6,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_extra: { connect: { ingrediente: 'Aros de Cebolla' } },
      price: 2.95,
    },
    {
      id: 7,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_extra: { connect: { ingrediente: 'Carne de res' } },
      price: 0.95,
    },
    {
      id: 8,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_extra: { connect: { ingrediente: 'Papas Fritas' } },
      price: 0.85,
    },
    {
      id: 9,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_extra: { connect: { ingrediente: 'Queso Fundido' } },
      price: 1.45,
    },
    {
      id: 10,
      id_menu: { connect: { nombre: 'Meat Burguer' } },
      id_extra: { connect: { ingrediente: 'Salsa' } },
      price: 1.95,
    },
  ];

  for (const ordenesIngrediente of opciones_personalizados_valores) {
    await prisma.opciones_personalizados_valores.upsert({
      where: { id: ordenesIngrediente.id },
      update: {},
      create: {
        valor: ordenesIngrediente.valor,
        opciones_personalizados: {
          connect: {
            id: ordenesIngrediente.id,
          },
        },
      },
    });
  }

  for (const ordenesIngrTitulo of opciones_personalizados) {
    await prisma.opciones_personalizados.upsert({
      where: { id: ordenesIngrTitulo.id },
      update: {},
      create: {
        opcion: ordenesIngrTitulo.opcion,
      },
    });
  }

  for (const categoryData of categorias) {
    await prisma.categorias.upsert({
      where: { id: categoryData.id },
      update: {},
      create: {
        categoria: categoryData.categoria,
      },
    });
  }

  for (const rolesData of roles) {
    await prisma.roles.upsert({
      where: { id: rolesData.id },
      update: {},
      create: { roles: rolesData.roles },
    });
  }

  for (const extrasData of extras) {
    await prisma.extras.upsert({
      where: { id: extrasData.id },
      update: {},
      create: { extra: extrasData.extra },
    });
  }

  for (const menuData of menu) {
    const categoria = await prisma.categorias.findFirst({
      where: { categoria: menuData.categoria.connect.categoria },
    });

    await prisma.menu.upsert({
      where: { id: menuData.id },
      update: {},
      create: {
        nombre: menuData.nombre,
        descripcion: menuData.descripcion,
        precio: menuData.precio,
        img: menuData.img,
        categorias: {
          connect: {
            id: categoria?.id,
          },
        },
      },
    });
  }

  for (const ingredientOptionalsData of ingredientes_opcionales) {
    await prisma.ingredientes_opcionales.upsert({
      where: { id: ingredientOptionalsData.id },
      update: {},
      create: {
        ingrediente: ingredientOptionalsData.ingrediente,
      },
    });
  }

  for (const typesOfVariantsData of tipos_de_variantes) {
    await prisma.tipos_de_variantes.upsert({
      where: { id: typesOfVariantsData.id },
      update: {},
      create: {
        variante: typesOfVariantsData.variante,
      },
    });
  }

  for (const platesWithExtrasData of platos_con_extras) {
    const idMenu = await prisma.menu.findFirst({
      where: { nombre: platesWithExtrasData.id_menu.connect.nombre },
    });

    const idIngredientOptional = await prisma.extras.findFirst({
      where: { extra: platesWithExtrasData.id_extra.connect.ingrediente },
    });

    await prisma.platos_con_extras.upsert({
      where: { id: platesWithExtrasData.id },
      update: {},
      create: {
        menu: { connect: { id: idMenu?.id } },
        extras: { connect: { id: idIngredientOptional?.id } },
        price: platesWithExtrasData.price,
      },
    });
  }

  for (const platesWithIngredientsData of platos_con_variantes) {
    const idMenu = await prisma.menu.findFirst({
      where: { nombre: platesWithIngredientsData.id_menu.connect.nombre },
    });

    const idIngredientOptional = await prisma.tipos_de_variantes.findFirst({
      where: { variante: platesWithIngredientsData.id_tipos_de_variantes.connect.variante },
    });

    await prisma.variantes.upsert({
      where: { id: platesWithIngredientsData.id },
      update: {},
      create: {
        menu: { connect: { id: idMenu?.id } },
        tipos_de_variantes: { connect: { id: idIngredientOptional?.id } },
        precio: platesWithIngredientsData.precio,
      },
    });
  }

  for (const platesWithIngredientsData of platos_con_ingredientes) {
    const idMenu = await prisma.menu.findFirst({
      where: { nombre: platesWithIngredientsData.id_menu.connect.nombre },
    });

    const idIngredientOptional = await prisma.ingredientes_opcionales.findFirst({
      where: { ingrediente: platesWithIngredientsData.id_ingredientes_opcionales.connect.ingrediente },
    });

    await prisma.platos_con_ingredientes_opcionales.upsert({
      where: { id: platesWithIngredientsData.id },
      update: {},
      create: {
        menu: { connect: { id: idMenu?.id } },
        ingredientes_opcionales: { connect: { id: idIngredientOptional?.id } },
      },
    });
  }
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = { main };
