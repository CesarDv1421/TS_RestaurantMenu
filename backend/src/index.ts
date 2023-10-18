import express from 'express';
import { join } from 'path';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/img', express.static(join(__dirname, 'img')));

//Rutas
import isAuthenticated from './middleware/isAuthenticated';
import menu from './routes/menu.routes';
import auth from './routes/auth.routes';
import orders from './routes/orders.routes';

app.use('/auth', auth);
app.use(isAuthenticated as express.RequestHandler);
app.use('/menu', menu);
app.use('/orders', orders);

app.listen(PORT, () => console.log(`Listen in PORT ${PORT}`));
