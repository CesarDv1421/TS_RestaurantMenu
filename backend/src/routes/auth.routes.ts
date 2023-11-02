import { Router, Request, Response } from 'express';
const auth = Router();

//Libraries
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

//Helpers
import encrypt from '../helpers/bcrypt';

//Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

auth.post(
  '/signin',
  [
    body('email')
      .notEmpty()
      .withMessage('El campo no puede estar vacío')
      .withMessage('Ingrese un email')
      .isEmail()
      .withMessage('El correo electrónico no es válido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener mínimo 8 caracteres')
      .isStrongPassword()
      .withMessage('La contraseña debe tener al menos 1 caracter especial, 1 mayúscula y 8 caracteres'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ err: errors.array()[0].msg });

    try {
      const { email, password } = req.body;

      const userExist = await prisma.clientes.findFirst({
        select: {
          id: true,
          nombre: true,
          email: true,
          password: true,
          roles: { select: { roles: true } },
        },
        where: { email },
      });

      if (!userExist) return res.status(404).json({ err: 'Usuario no encontrado' });

      const comparePassword = await encrypt.matchPassword(password, userExist.password);

      if (!comparePassword) return res.status(404).json({ err: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: userExist.id }, process.env.SECRET_JWT as string, {
        expiresIn: '6h',
      });

      return res.status(201).json({
        token,
        userName: userExist.nombre,
        rol: userExist.roles.roles,
      });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

auth.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),

    body('email').isEmail().withMessage('El formato del email no es correcto'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe contener al menos 8 caracteres')
      .isStrongPassword()
      .withMessage('La contraseña debe contener al menos 1 caracter especial, 1 mayúscula y 8 caracteres'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ err: errors.array()[0].msg });

    try {
      const { name, email, password } = req.body;

      const userExist = await prisma.clientes.findFirst({ where: { email } });

      if (userExist) return res.status(404).json({ err: 'El usuario ya existe' });

      const encriptedPassword = await encrypt.encryptPassword(password);

      const user = await prisma.clientes.create({
        data: { nombre: name, email, password: encriptedPassword, id_rol: 1 },
        include: { roles: true },
      });

      console.log(user);

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_JWT as string, {
        expiresIn: '6h',
      });

      res.status(201).json({ token, userName: user.nombre, rol: user.roles.roles });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

export default auth;
