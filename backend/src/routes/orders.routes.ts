import { Router, Request } from 'express';
const orders = Router();
import { JwtPayload } from 'jsonwebtoken';

//Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Interfaces
import { ordersInComing } from '../interfaces/orders';

interface CustomRequest extends Request {
  user?: JwtPayload; // Agrega la propiedad 'user' al objeto 'req'
}

orders.post('/', async (req: CustomRequest, res) => {
  try {
    const orders = req.body as ordersInComing[];
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ err: 'Autenticacion fallida, usuario no encontrado' });

    const idOrder = await prisma.ordenes.create({
      data: {
        id_cliente: userId,
        fecha_creacion: new Date(),
      },
    });

    orders.map(async (ordersData) => {
      //Busca los datos del plato que estan siendo ordenados
      const namePlate = await prisma.menu.findFirst({ where: { nombre: ordersData.name } });

      if (!namePlate) return res.status(400).json({ err: 'Plato no encontrado, orden no creada, intente nuevamente' });

      const idPlateOrder = await prisma.ordenes_platos.create({
        data: {
          id_plato: ordersData.id,
          cantidad: ordersData.quanty,
          precio_total: ordersData.price,
          id_orden: idOrder.id,
        },
      });

      //Guarda y ordena en la BD los variantes que poseen los diferentes platos
      ordersData.buttonsValues.map(async ({ ingredient, title }) => {
        if (ordersData.typeOfProduct === 'Coffee') {
          const idOption = await prisma.opciones_personalizados.findFirst({
            where: { opcion: title },
          });

          const idValue = await prisma.opciones_personalizados_valores.findFirst({
            where: { valor: ingredient },
          });

          if (idValue && idOption)
            await prisma.ordenes_platos_valores_personalizados.create({
              data: {
                id_plato: ordersData.id,
                id_opcion_personalizado: idOption.id,
                id_valor_personalizado: idValue.id,
                id_orden_plato: idPlateOrder.id,
              },
            });
          else res.status(400).json({ msg: 'no se encontraron los valores' });
        }

        if (ordersData.typeOfProduct === 'Variants') {
          const idVariant = await prisma.tipos_de_variantes.findFirst({
            where: { variante: ingredient },
          });

          if (idVariant)
            await prisma.ordenes_platos_variantes.create({
              data: {
                id_variante: idVariant.id,
                id_orden_plato: idPlateOrder.id,
              },
            });
        }

        if (ordersData.typeOfProduct === 'Custom') {
          const idIngredient = await prisma.ingredientes_opcionales.findFirst({
            where: { ingrediente: ingredient },
          });

          if (idIngredient)
            await prisma.ordenes_platos_ingredientesopcionales.create({
              data: {
                id_ingredienteOpcional: idIngredient.id,
                id_orden_plato: idPlateOrder.id,
              },
            });
        }
      });

      //Guarda y ordena en la BD los extras que poseen los diferentes platos
      ordersData.extras.map(async ({ ingredient }) => {
        const idExtra = await prisma.extras.findFirst({
          where: { extra: ingredient },
        });

        const extras = await prisma.platos_con_extras.findFirst({
          where: { id_menu: ordersData.id, id_extra: idExtra?.id },
        });

        if (!extras) return res.status(400).json({ err: 'Extra no encontrado' });

        await prisma.ordenes_platos_extras.create({
          data: {
            id_plato: ordersData.id,
            id_extra: extras?.id_extra,
            precio: extras?.price,
            id_orden_plato: idPlateOrder.id,
          },
        });
      });
    });

    res.status(200).json({ msg: 'Orden creada exitosamente' });
  } catch (err) {
    res.status(500).json({ err });
  } finally {
    await prisma.$disconnect();
  }
});

orders.get('/', async (req: CustomRequest, res) => {
  try {
    const userId = req.user?.id;

    //Busca las ordenes de acuerdo al cliente registrado
    const orders = await prisma.ordenes.findMany({
      where: { id_cliente: userId },
    });

    const ordersMap = await Promise.all(
      //Luego de encontrar las ordenes propias del cliente, busca los platos correspondientes a las ordenes
      orders.map(async ({ id: idOrders, fecha_creacion, id_cliente }) => {
        const platesOrders = await prisma.ordenes_platos.findMany({
          where: { id_orden: idOrders },
          include: { menu: true },
        });

        //Luego se encarga de ordenar la informacion de cada plato, como los variantes, extras etc...
        const plateOrder = await Promise.all(
          platesOrders.map(async ({ id: idPlatesOrders, id_plato, cantidad, precio_total, id_orden, menu }) => {
            //Tanto los extras, ingredientes opcionales y valores personalizado son convertidos en array de objetos
            //Ej. extras: [ { extra: "Carne", precio: 4.50 }  { extra: "Papas", precio: 2.00 } ]

            const extras = await prisma.ordenes_platos_extras.findMany({
              where: { id_orden_plato: idPlatesOrders },
              include: { extras: true },
            });

            const filterExtras = extras.map(({ extras, precio }) => {
              return {
                ...extras,
                precio,
              };
            });

            const opcionalIngredients = await prisma.ordenes_platos_ingredientesopcionales.findMany({
              where: { id_orden_plato: idPlatesOrders },
              include: { ingredientes_opcionales: true },
            });

            const filterOpcionalIngredients = opcionalIngredients.map(({ ingredientes_opcionales }) => {
              return {
                ...ingredientes_opcionales,
              };
            });

            const customValues = await prisma.ordenes_platos_valores_personalizados.findMany({
              where: { id_orden_plato: idPlatesOrders },
              include: {
                opciones_personalizados: true,
                opciones_personalizados_valores: true,
              },
            });

            const filterCustomValues = customValues.map(
              ({ opciones_personalizados, opciones_personalizados_valores }) => {
                return {
                  opcion: opciones_personalizados.opcion,
                  valor: opciones_personalizados_valores.valor,
                };
              }
            );

            //Los variantes no es un array de objetos, sino unicamente un string ...
            // Ej. variantes: "Queso Completo"
            const variants = await prisma.ordenes_platos_variantes.findFirst({
              where: { id_orden_plato: idPlatesOrders },
              include: {
                tipos_de_variantes: true,
              },
            });

            return {
              id: idPlatesOrders,
              cantidad: cantidad,
              precioTotal: Number(precio_total),
              fechaCreacion: fecha_creacion,
              nombrePlato: menu.nombre,
              idCliente: id_cliente,
              variantes: variants?.tipos_de_variantes.variante || [],
              valoresPersonalizados: filterCustomValues,
              ingredientesOpcionales: filterOpcionalIngredients,
              extras: filterExtras,
            };
          })
        );

        // Esto retorna la siguiente estructura:
        // Array de objetos, donde cada objeto es tiene como clave el id de la orden y valor un array de objetos de los platos de esa orden,
        // [ { 'idOrden1': [ { platos }, { platos } ] }, { 'idOrden2': [ { platos }, { platos } ] } ]
        return { [idOrders]: plateOrder };
      })
    );

    // Esto ordena la estructura de datos de esta forma:
    // Objeto en donde la clave es el id de la orden y el valor un array de objetos con cada uno de los platos de esa orden
    // { idOrden1: [{ platos }, { platos }], idOrden2: [{ platos }, { platos }] }
    const ordersData = Object.assign({}, ...ordersMap);

    return res.status(201).json({ ordersData });
  } catch (err) {
    res.status(500).json({ err });
  } finally {
    await prisma.$disconnect();
  }
});

export default orders;
