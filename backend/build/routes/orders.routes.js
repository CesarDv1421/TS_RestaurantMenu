"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders = (0, express_1.Router)();
//Prisma
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
orders.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orders = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ err: 'Autenticacion fallida, usuario no encontrado' });
        const idOrder = yield prisma.ordenes.create({
            data: {
                id_cliente: userId,
                fecha_creacion: new Date(),
            },
        });
        orders.map((ordersData) => __awaiter(void 0, void 0, void 0, function* () {
            //Busca los datos del plato que estan siendo ordenados
            const namePlate = yield prisma.menu.findFirst({ where: { nombre: ordersData.name } });
            if (!namePlate)
                return res.status(400).json({ err: 'Plato no encontrado, orden no creada, intente nuevamente' });
            const idPlateOrder = yield prisma.ordenes_platos.create({
                data: {
                    id_plato: ordersData.id,
                    cantidad: ordersData.quanty,
                    precio_total: ordersData.price,
                    id_orden: idOrder.id,
                },
            });
            //Guarda y ordena en la BD los variantes que poseen los diferentes platos
            ordersData.buttonsValues.map(({ ingredient, title }) => __awaiter(void 0, void 0, void 0, function* () {
                if (ordersData.typeOfProduct === 'Coffee') {
                    const idOption = yield prisma.opciones_personalizados.findFirst({
                        where: { opcion: title },
                    });
                    const idValue = yield prisma.opciones_personalizados_valores.findFirst({
                        where: { valor: ingredient },
                    });
                    if (idValue && idOption)
                        yield prisma.ordenes_platos_valores_personalizados.create({
                            data: {
                                id_plato: ordersData.id,
                                id_opcion_personalizado: idOption.id,
                                id_valor_personalizado: idValue.id,
                                id_orden_plato: idPlateOrder.id,
                            },
                        });
                    else
                        res.status(400).json({ msg: 'no se encontraron los valores' });
                }
                if (ordersData.typeOfProduct === 'Variants') {
                    const idVariant = yield prisma.tipos_de_variantes.findFirst({
                        where: { variante: ingredient },
                    });
                    if (idVariant)
                        yield prisma.ordenes_platos_variantes.create({
                            data: {
                                id_variante: idVariant.id,
                                id_orden_plato: idPlateOrder.id,
                            },
                        });
                }
                if (ordersData.typeOfProduct === 'Custom') {
                    const idIngredient = yield prisma.ingredientes_opcionales.findFirst({
                        where: { ingrediente: ingredient },
                    });
                    if (idIngredient)
                        yield prisma.ordenes_platos_ingredientesopcionales.create({
                            data: {
                                id_ingredienteOpcional: idIngredient.id,
                                id_orden_plato: idPlateOrder.id,
                            },
                        });
                }
            }));
            //Guarda y ordena en la BD los extras que poseen los diferentes platos
            ordersData.extras.map(({ ingredient }) => __awaiter(void 0, void 0, void 0, function* () {
                const idExtra = yield prisma.extras.findFirst({
                    where: { extra: ingredient },
                });
                const extras = yield prisma.platos_con_extras.findFirst({
                    where: { id_menu: ordersData.id, id_extra: idExtra === null || idExtra === void 0 ? void 0 : idExtra.id },
                });
                if (!extras)
                    return res.status(400).json({ err: 'Extra no encontrado' });
                yield prisma.ordenes_platos_extras.create({
                    data: {
                        id_plato: ordersData.id,
                        id_extra: extras === null || extras === void 0 ? void 0 : extras.id_extra,
                        precio: extras === null || extras === void 0 ? void 0 : extras.price,
                        id_orden_plato: idPlateOrder.id,
                    },
                });
            }));
        }));
        res.status(200).json({ msg: 'Orden creada exitosamente' });
    }
    catch (err) {
        res.status(500).json({ err });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
orders.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        //Busca las ordenes de acuerdo al cliente registrado
        const orders = yield prisma.ordenes.findMany({
            where: { id_cliente: userId },
        });
        const ordersMap = yield Promise.all(
        //Luego de encontrar las ordenes propias del cliente, busca los platos correspondientes a las ordenes
        orders.map(({ id: idOrders, fecha_creacion, id_cliente }) => __awaiter(void 0, void 0, void 0, function* () {
            const platesOrders = yield prisma.ordenes_platos.findMany({
                where: { id_orden: idOrders },
                include: { menu: true },
            });
            //Luego se encarga de ordenar la informacion de cada plato, como los variantes, extras etc...
            const plateOrder = yield Promise.all(platesOrders.map(({ id: idPlatesOrders, id_plato, cantidad, precio_total, id_orden, menu }) => __awaiter(void 0, void 0, void 0, function* () {
                //Tanto los extras, ingredientes opcionales y valores personalizado son convertidos en array de objetos
                //Ej. extras: [ { extra: "Carne", precio: 4.50 }  { extra: "Papas", precio: 2.00 } ]
                const extras = yield prisma.ordenes_platos_extras.findMany({
                    where: { id_orden_plato: idPlatesOrders },
                    include: { extras: true },
                });
                const filterExtras = extras.map(({ extras, precio }) => {
                    return Object.assign(Object.assign({}, extras), { precio });
                });
                const opcionalIngredients = yield prisma.ordenes_platos_ingredientesopcionales.findMany({
                    where: { id_orden_plato: idPlatesOrders },
                    include: { ingredientes_opcionales: true },
                });
                const filterOpcionalIngredients = opcionalIngredients.map(({ ingredientes_opcionales }) => {
                    return Object.assign({}, ingredientes_opcionales);
                });
                const customValues = yield prisma.ordenes_platos_valores_personalizados.findMany({
                    where: { id_orden_plato: idPlatesOrders },
                    include: {
                        opciones_personalizados: true,
                        opciones_personalizados_valores: true,
                    },
                });
                const filterCustomValues = customValues.map(({ opciones_personalizados, opciones_personalizados_valores }) => {
                    return {
                        opcion: opciones_personalizados.opcion,
                        valor: opciones_personalizados_valores.valor,
                    };
                });
                //Los variantes no es un array de objetos, sino unicamente un string ...
                // Ej. variantes: "Queso Completo"
                const variants = yield prisma.ordenes_platos_variantes.findFirst({
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
                    variantes: (variants === null || variants === void 0 ? void 0 : variants.tipos_de_variantes.variante) || [],
                    valoresPersonalizados: filterCustomValues,
                    ingredientesOpcionales: filterOpcionalIngredients,
                    extras: filterExtras,
                };
            })));
            // Esto retorna la siguiente estructura:
            // Array de objetos, donde cada objeto es tiene como clave el id de la orden y valor un array de objetos de los platos de esa orden,
            // [ { 'idOrden1': [ { platos }, { platos } ] }, { 'idOrden2': [ { platos }, { platos } ] } ]
            return { [idOrders]: plateOrder };
        })));
        // Esto ordena la estructura de datos de esta forma:
        // Objeto en donde la clave es el id de la orden y el valor un array de objetos con cada uno de los platos de esa orden
        // { idOrden1: [{ platos }, { platos }], idOrden2: [{ platos }, { platos }] }
        const ordersData = Object.assign({}, ...ordersMap);
        return res.status(201).json({ ordersData });
    }
    catch (err) {
        res.status(500).json({ err });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.default = orders;
