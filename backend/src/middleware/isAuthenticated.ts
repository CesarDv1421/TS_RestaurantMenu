import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface customJwtPayload extends JwtPayload {
  id: number; // Agrega la propiedad 'id' al tipo 'JwtPayload'
}

interface CustomRequest extends Request {
  user: customJwtPayload; // Agrega la propiedad 'user' al objeto 'req'
}

const isAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    const token = authorization && authorization.split(' ')[1];

    if (!token) return res.status(401).json({ err: 'No estás autenticado, el token ha expirado' });

    const decodedToken = jwt.verify(token, process.env.SECRET_JWT as string);
    req.user = decodedToken as customJwtPayload;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      err: 'Acceso Denegado, El token ha expirado o es incorrecto',
    });
  }
};

export default isAuthenticated;
