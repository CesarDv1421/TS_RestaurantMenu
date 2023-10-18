import { Router } from 'express';

const app = Router();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/', async (req, res) => {
  try {
    const categories = await prisma.categorias.findMany();

    const menuPrisma = await prisma.menu.findMany({
      include: { categorias: true },
    });

    const menu = await Promise.all(
      menuPrisma.map(async (data) => {
        const variantes = await prisma.variantes.findMany({
          where: { id_menu: data.id },
          include: { tipos_de_variantes: true },
        });

        const variants = variantes.map(({ tipos_de_variantes, precio }) => {
          return {
            variant: tipos_de_variantes.variante,
            price: Number(precio),
          };
        });

        const ingredientesOpcionales = await prisma.platos_con_ingredientes_opcionales.findMany({
          where: { id_menu: data.id },
          include: { ingredientes_opcionales: true },
        });

        const ingredients = ingredientesOpcionales.map(({ ingredientes_opcionales }) => {
          return {
            ingredient: ingredientes_opcionales.ingrediente,
          };
        });

        const extrasMenu = await prisma.platos_con_extras.findMany({
          where: { id_menu: data.id },
          include: { extras: true },
        });

        const extras = extrasMenu.map(({ extras, price }) => {
          return {
            extras: extras?.extra,
            extrasPrice: Number(price),
          };
        });

        if (variants.length > 0) {
          return {
            ...data,
            name: data.nombre,
            description: data.descripcion,
            category: data.categorias.categoria,
            variants,
          };
        }

        if (ingredientesOpcionales || extras) {
          return {
            ...data,
            name: data.nombre,
            description: data.descripcion,
            category: data.categorias.categoria,
            price: Number(data.precio),
            ingredients,
            extras,
            variants: null,
          };
        }
      })
    );

    res.status(200).json({ menu, categories });
  } catch (err) {
    res.status(500).json({ err });
  } finally {
    await prisma.$disconnect();
  }
});

export default app;
