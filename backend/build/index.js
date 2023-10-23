'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const path_1 = require('path');
const cors_1 = __importDefault(require('cors'));
require('dotenv/config');
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/img', express_1.default.static((0, path_1.join)(__dirname, 'img')));
//Rutas
const isAuthenticated_1 = __importDefault(require('./middleware/isAuthenticated'));
const menu_routes_1 = __importDefault(require('./routes/menu.routes'));
const auth_routes_1 = __importDefault(require('./routes/auth.routes'));
const orders_routes_1 = __importDefault(require('./routes/orders.routes'));
app.use('/auth', auth_routes_1.default);
app.use(isAuthenticated_1.default);
app.use('/menu', menu_routes_1.default);
app.use('/orders', orders_routes_1.default);
app.listen(PORT, () => console.log(`Listen in PORT ${PORT}`));
