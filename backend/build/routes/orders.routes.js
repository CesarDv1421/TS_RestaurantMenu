'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const orders = (0, express_1.Router)();
//Prisma
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
orders.post('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const orders = req.body;
      const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
      if (!userId) return res.status(400).json({ err: 'Autenticacion fallida, usuario no encontrado' });
      const lastOrder = yield prisma.ordenes.findFirst({
        orderBy: { fecha_creacion: 'desc' }, // Ordena por fecha en orden descendente para obtener la última orden
      });
      //Metodo para ordenar las "ordenes" por id, que son efectuadas por cada vez que se ejecute una compra exitosa. Esto hace que aún cuando hayan ordenes con multiples platos, se pueda diferenciar de una orden hecha por cada vez que se realice una compra.
      const nextOrderNumber = lastOrder ? lastOrder.id_orden + 1 : 1;
      orders.map((ordersData) =>
        __awaiter(void 0, void 0, void 0, function* () {
          //Busca en la BD los datos del plato que estan siendo ordenados
          const namePlate = yield prisma.menu.findFirst({
            where: { nombre: ordersData.name },
          });
          if (!namePlate)
            return res.status(400).json({ err: 'Plato no encontrado, orden no creada, intente nuevamente' });
          //Una vez hayado los datos del plato, crea la orden
          const idOrder = yield prisma.ordenes.create({
            data: {
              id_platos: namePlate === null || namePlate === void 0 ? void 0 : namePlate.id,
              id_orden: nextOrderNumber,
              cantidad: ordersData.quanty,
              precio_total: ordersData.price,
              id_cliente: userId,
              fecha_creacion: new Date(),
            },
          });
          //Guarda y ordena en la BD los variantes que poseen los diferentes platos
          ordersData.buttonsValues.map(({ ingredient, title }) =>
            __awaiter(void 0, void 0, void 0, function* () {
              if (ordersData.typeOfProduct === 'Coffee') {
                const idIngredient = yield prisma.ordenes_ingredientes_ingrediente.findFirst({
                  where: { ingrediente: ingredient },
                });
                const idNameTitle = yield prisma.ordenes_ingredientes_titulos.findFirst({
                  where: { titulo: title },
                });
                yield prisma.ordenes_ingredientes.create({
                  data: {
                    id_menu: ordersData.id,
                    id_titulo: idNameTitle === null || idNameTitle === void 0 ? void 0 : idNameTitle.id,
                    id_opciones: idIngredient === null || idIngredient === void 0 ? void 0 : idIngredient.id,
                    id_variante: null,
                    id_ingrediente: null,
                    id_ordenes: idOrder.id,
                  },
                });
              }
              if (ordersData.typeOfProduct === 'Variants') {
                const idVariant = yield prisma.tipos_de_variantes.findFirst({
                  where: { variante: ingredient },
                });
                yield prisma.ordenes_ingredientes.create({
                  data: {
                    id_menu: ordersData.id,
                    id_titulo: null,
                    id_opciones: null,
                    id_variante: idVariant === null || idVariant === void 0 ? void 0 : idVariant.id,
                    id_ingrediente: null,
                    id_ordenes: idOrder.id,
                  },
                });
              }
              if (ordersData.typeOfProduct === 'Custom') {
                const idIngredient = yield prisma.ingredientes_opcionales.findFirst({
                  where: { ingrediente: ingredient },
                });
                yield prisma.ordenes_ingredientes.create({
                  data: {
                    id_menu: ordersData.id,
                    id_titulo: null,
                    id_opciones: null,
                    id_variante: null,
                    id_ingrediente: idIngredient === null || idIngredient === void 0 ? void 0 : idIngredient.id,
                    id_ordenes: idOrder.id,
                  },
                });
              }
            })
          );
          //Guarda y ordena en la BD los extras que poseen los diferentes platos
          ordersData.extras.map(({ ingredient }) =>
            __awaiter(void 0, void 0, void 0, function* () {
              const idExtra = yield prisma.extras.findFirst({
                where: { extra: ingredient },
              });
              const extras = yield prisma.platos_con_extras.findFirst({
                where: {
                  id_menu: ordersData.id,
                  id_extra: idExtra === null || idExtra === void 0 ? void 0 : idExtra.id,
                },
              });
              if (!extras) return res.status(400).json({ err: 'Extra no encontrado' });
              yield prisma.ordenes_extras.create({
                data: {
                  id_menu: ordersData.id,
                  id_ingrediente: extras === null || extras === void 0 ? void 0 : extras.id_extra,
                  precio: extras === null || extras === void 0 ? void 0 : extras.price,
                  id_ordenes: idOrder.id,
                },
              });
            })
          );
        })
      );
      res.status(200).json({ msg: 'Orden creada exitosamente' });
    } catch (err) {
      res.status(500).json({ err });
    } finally {
      yield prisma.$disconnect();
    }
  })
);
//Endpoint para mostrar en el frontend la lista de ordenes
orders.get('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
      console.log('asdasd');
      const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
      //Busca las ordenes de acuerdo al cliente registrado
      const ordenesConClientes = yield prisma.ordenes.findMany({
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
      const ordenesMapeadas = yield Promise.all(
        ordenesConClientes.map(
          ({ id, id_orden, id_platos, cantidad, precio_total, id_cliente, fecha_creacion, menu }) =>
            __awaiter(void 0, void 0, void 0, function* () {
              const ingredientes = yield prisma.ordenes_ingredientes.findMany({
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
                var _a, _b, _c;
                if ((_a = data.ordenes_ingredientes_ingrediente) === null || _a === void 0 ? void 0 : _a.ingrediente) {
                  return Object.assign(
                    Object.assign({}, data.ordenes_ingredientes_ingrediente),
                    data.ordenes_ingredientes_titulos
                  );
                }
                if ((_b = data.tipos_de_variantes) === null || _b === void 0 ? void 0 : _b.variante) {
                  return Object.assign({}, data.tipos_de_variantes);
                }
                if ((_c = data.ingredientes_opcionales) === null || _c === void 0 ? void 0 : _c.ingrediente) {
                  return Object.assign({}, data.ingredientes_opcionales);
                }
                return null;
              });
              const extras = yield prisma.ordenes_extras.findMany({
                orderBy: { id: 'asc' },
                where: { id_ordenes: id },
                include: {
                  extras: true,
                },
              });
              const filterExtra = extras.map(({ precio, extras }) => {
                return Object.assign({ precio }, extras);
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
            })
        )
      );
      const ordenesAgrupadas = {};
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
      yield prisma.$disconnect();
    }
  })
);
exports.default = orders;
