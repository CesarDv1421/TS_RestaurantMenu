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
const app = (0, express_1.Router)();
const client_1 = require('@prisma/client');
const prisma = new client_1.PrismaClient();
app.get('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const categories = yield prisma.categorias.findMany();
      const menuPrisma = yield prisma.menu.findMany({
        include: { categorias: true },
      });
      const menu = yield Promise.all(
        menuPrisma.map((data) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const variantes = yield prisma.variantes.findMany({
              where: { id_menu: data.id },
              include: { tipos_de_variantes: true },
            });
            const variants = variantes.map(({ tipos_de_variantes, precio }) => {
              return {
                variant: tipos_de_variantes.variante,
                price: Number(precio),
              };
            });
            const ingredientesOpcionales = yield prisma.platos_con_ingredientes_opcionales.findMany({
              where: { id_menu: data.id },
              include: { ingredientes_opcionales: true },
            });
            const ingredients = ingredientesOpcionales.map(({ ingredientes_opcionales }) => {
              return {
                ingredient: ingredientes_opcionales.ingrediente,
              };
            });
            const extrasMenu = yield prisma.platos_con_extras.findMany({
              where: { id_menu: data.id },
              include: { extras: true },
            });
            const extras = extrasMenu.map(({ extras, price }) => {
              return {
                extras: extras === null || extras === void 0 ? void 0 : extras.extra,
                extrasPrice: Number(price),
              };
            });
            if (variants.length > 0) {
              return Object.assign(Object.assign({}, data), {
                name: data.nombre,
                description: data.descripcion,
                category: data.categorias.categoria,
                variants,
              });
            }
            if (ingredientesOpcionales || extras) {
              return Object.assign(Object.assign({}, data), {
                name: data.nombre,
                description: data.descripcion,
                category: data.categorias.categoria,
                price: Number(data.precio),
                ingredients,
                extras,
                variants: null,
              });
            }
          })
        )
      );
      res.status(200).json({ menu, categories });
    } catch (err) {
      res.status(500).json({ err });
    } finally {
      yield prisma.$disconnect();
    }
  })
);
exports.default = app;
