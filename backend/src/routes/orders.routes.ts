import { Router, Request } from 'express';
const orders = Router();
import { JwtPayload } from 'jsonwebtoken';

//Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Interfaces
import { ordersData, ordersInComing } from '../interfaces/orders';

interface ordersReady {
  [key: string]: ordersData[];
}

interface CustomRequest extends Request {
  user?: JwtPayload; // Agrega la propiedad 'user' al objeto 'req'
}

orders.post('/', async (req: CustomRequest, res) => {
  try {
    const orders = req.body as ordersInComing[];
    const userId = req.user?.id;

    if (!userId) return res.status(400).json({ err: 'Autenticacion fallida, usuario no encontrado' });

    const lastOrder = await prisma.ordenes.findFirst({
      orderBy: { fecha_creacion: 'desc' }, // Ordena por fecha en orden descendente para obtener la última orden
    });

    //Metodo para ordenar las "ordenes" por id, que son efectuadas por cada vez que se ejecute una compra exitosa. Esto hace que aún cuando hayan ordenes con multiples platos, se pueda diferenciar de una orden hecha por cada vez que se realice una compra.
    const nextOrderNumber = lastOrder ? lastOrder.id_orden + 1 : 1;

    orders.map(async (ordersData) => {
      //Busca en la BD los datos del plato que estan siendo ordenados
      const namePlate = await prisma.menu.findFirst({
        where: { nombre: ordersData.name },
      });

      if (!namePlate) return res.status(400).json({ err: 'Plato no encontrado, orden no creada, intente nuevamente' });

      //Una vez hayado los datos del plato, crea la orden
      const idOrder = await prisma.ordenes.create({
        data: {
          id_platos: namePlate?.id,
          id_orden: nextOrderNumber,
          cantidad: ordersData.quanty,
          precio_total: ordersData.price,
          id_cliente: userId,
          fecha_creacion: new Date(),
        },
      });

      //Guarda y ordena en la BD los variantes que poseen los diferentes platos
      ordersData.buttonsValues.map(async ({ ingredient, title }) => {
        if (ordersData.typeOfProduct === 'Coffee') {
          const idIngredient = await prisma.ordenes_ingredientes_ingrediente.findFirst({
            where: { ingrediente: ingredient },
          });

          const idNameTitle = await prisma.ordenes_ingredientes_titulos.findFirst({
            where: { titulo: title },
          });

          await prisma.ordenes_ingredientes.create({
            data: {
              id_menu: ordersData.id,
              id_titulo: idNameTitle?.id,
              id_opciones: idIngredient?.id,
              id_variante: null,
              id_ingrediente: null,
              id_ordenes: idOrder.id,
            },
          });
        }

        if (ordersData.typeOfProduct === 'Variants') {
          const idVariant = await prisma.tipos_de_variantes.findFirst({
            where: { variante: ingredient },
          });

          await prisma.ordenes_ingredientes.create({
            data: {
              id_menu: ordersData.id,
              id_titulo: null,
              id_opciones: null,
              id_variante: idVariant?.id,
              id_ingrediente: null,
              id_ordenes: idOrder.id,
            },
          });
        }

        if (ordersData.typeOfProduct === 'Custom') {
          const idIngredient = await prisma.ingredientes_opcionales.findFirst({
            where: { ingrediente: ingredient },
          });

          await prisma.ordenes_ingredientes.create({
            data: {
              id_menu: ordersData.id,
              id_titulo: null,
              id_opciones: null,
              id_variante: null,
              id_ingrediente: idIngredient?.id,
              id_ordenes: idOrder.id,
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

        await prisma.ordenes_extras.create({
          data: {
            id_menu: ordersData.id,
            id_ingrediente: extras?.id_extra,
            precio: extras?.price,
            id_ordenes: idOrder.id,
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

//Endpoint para mostrar en el frontend la lista de ordenes
orders.get('/', async (req: CustomRequest, res) => {
  try {
    const userId = req.user?.id;

    //Busca las ordenes de acuerdo al cliente registrado
    const ordenesConClientes = await prisma.ordenes.findMany({
      where: { id_cliente: userId },
      include: {
        menu: {
          select: {
            nombre: true,
          },
        },
      },
    });

    //Ordena la informacion de la BD para mostrarla en el frontend
    const ordenesMapeadas = await Promise.all(
      ordenesConClientes.map(
        async ({ id, id_orden, id_platos, cantidad, precio_total, id_cliente, fecha_creacion, menu }) => {
          const ingredientes = await prisma.ordenes_ingredientes.findMany({
            orderBy: { id: 'asc' },
            where: { id_ordenes: id },
            include: {
              ingredientes_opcionales: true,
              ordenes_ingredientes_ingrediente: true,
              ordenes_ingredientes_titulos: true,
              tipos_de_variantes: true,
            },
          });

          const filterValues = ingredientes.map((data) => {
            if (data.ordenes_ingredientes_ingrediente?.ingrediente) {
              return {
                ...data.ordenes_ingredientes_ingrediente,
                ...data.ordenes_ingredientes_titulos,
              };
            }

            if (data.tipos_de_variantes?.variante) {
              return {
                ...data.tipos_de_variantes,
              };
            }

            if (data.ingredientes_opcionales?.ingrediente) {
              return {
                ...data.ingredientes_opcionales,
              };
            }

            return null;
          });

          const extras = await prisma.ordenes_extras.findMany({
            orderBy: { id: 'asc' },
            where: { id_ordenes: id },
            include: {
              extras: true,
            },
          });

          const filterExtra = extras.map(({ precio, extras }) => {
            return {
              precio,
              ...extras,
            };
          });

          return {
            id,
            idOrden: id_orden,
            cantidad: cantidad,
            precioTotal: Number(precio_total),
            fechaCreacion: fecha_creacion,
            nombrePlato: menu.nombre,
            idCliente: id_cliente,
            valores: filterValues,
            extras: filterExtra,
          };
        }
      )
    );

    const ordenesAgrupadas: ordersReady = {};

    //Este metodo diferencia las ordenes mediante objetos en donde la clave es el numero o id de orden, y el valor es toda la informacion de esa orden. { 1 : infoDeLaOrden1, 2 : infoDeLaOrden2, etc ... }
    ordenesMapeadas.forEach((orden) => {
      const { idOrden } = orden;
      if (!ordenesAgrupadas[idOrden]) ordenesAgrupadas[idOrden] = [];
      ordenesAgrupadas[idOrden].push(orden);
    });

    return res.status(201).json({ ordenesAgrupadas });
  } catch (err) {
    res.status(500).json({ err });
  } finally {
    await prisma.$disconnect();
  }
});

export default orders;
