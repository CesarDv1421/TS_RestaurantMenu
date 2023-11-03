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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = (0, express_1.Router)();
//Libraries
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Helpers
const bcrypt_1 = __importDefault(require("../helpers/bcrypt"));
//Prisma
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
auth.post('/signin', [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('El campo no puede estar vacío')
        .withMessage('Ingrese un email')
        .isEmail()
        .withMessage('El correo electrónico no es válido'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres')
        .isStrongPassword()
        .withMessage('La contraseña debe tener al menos 1 caracter especial, 1 mayúscula y 8 caracteres'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ err: errors.array()[0].msg });
    try {
        const { email, password } = req.body;
        const userExist = yield prisma.clientes.findFirst({
            select: {
                id: true,
                nombre: true,
                email: true,
                password: true,
                roles: { select: { roles: true } },
            },
            where: { email },
        });
        if (!userExist)
            return res.status(404).json({ err: 'Usuario no encontrado' });
        const comparePassword = yield bcrypt_1.default.matchPassword(password, userExist.password);
        if (!comparePassword)
            return res.status(404).json({ err: 'Contraseña incorrecta' });
        const token = jsonwebtoken_1.default.sign({ id: userExist.id }, process.env.SECRET_JWT, {
            expiresIn: '6h',
        });
        return res.status(201).json({
            token,
            userName: userExist.nombre,
            rol: userExist.roles.roles,
        });
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
auth.post('/signup', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatorio'),
    (0, express_validator_1.body)('email').isEmail().withMessage('El formato del email no es correcto'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe contener al menos 8 caracteres')
        .isStrongPassword()
        .withMessage('La contraseña debe contener al menos 1 caracter especial, 1 mayúscula y 8 caracteres'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ err: errors.array()[0].msg });
    try {
        const { name, email, password } = req.body;
        const userExist = yield prisma.clientes.findFirst({ where: { email } });
        if (userExist)
            return res.status(404).json({ err: 'El usuario ya existe' });
        const encriptedPassword = yield bcrypt_1.default.encryptPassword(password);
        const user = yield prisma.clientes.create({
            data: { nombre: name, email, password: encriptedPassword, id_rol: 1 },
            include: { roles: true },
        });
        console.log(user);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.SECRET_JWT, {
            expiresIn: '6h',
        });
        res.status(201).json({ token, userName: user.nombre, rol: user.roles.roles });
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
exports.default = auth;
