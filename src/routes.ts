import Koa from "koa";

import root from './routes/root.js';
import board from './routes/board.js';

export function routeApp(app: Koa) {
    app.use(root.routes());
    app.use(board.routes());
}