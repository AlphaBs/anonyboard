import Koa from "koa";
import render from "koa-ejs";
import morgan from "koa-morgan";
import proxyaddr from "proxy-addr";
import { getConfig } from "./core/configManager.js";
import { IAppState } from "./models/IAppState.js";
import { IAppContext } from "./models/IAppContext.js";
import { logErrorMessage, logMessage } from "./core/logger.js";
import { promisify } from "util";
import ConfigModel from "./models/ConfigModel.js";
import { routeApp } from "./routes.js";
import cors from "@koa/cors";

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development";

const dev = process.env.NODE_ENV != "production"
console.log("[SERVER] userauth: " + process.env.NODE_ENV);

// configuration
const config: ConfigModel = getConfig();
if (config == null) {
    logErrorMessage("[FATAL] Invalid config");
    process.exit();
}

const app = new Koa<IAppState, IAppContext>();

// proxy setting
if (config.proxy) {
    app.proxy = true;

    const trustProxy = proxyaddr.compile([
        "loopback",
        "linklocal",
        "uniquelocal"
    ]);

    morgan.token("remote-addr", (req, res) => {
        return proxyaddr(req, trustProxy);
    });
}

// logger
app.use(morgan(dev ? "dev" : "common", {
    stream: {
        write: (message: string) => logMessage(message)
    }
}));

// ejs renderer
/*
render(app, {
    root: path.join(__dirname, "view"),
    layout: "template",
    viewExt: "html",
    cache: false,
    debug: false
});
*/

// cors
if (config.cors) {
    app.use(cors());
}

// router
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    try {
        await next();
    }
    catch (err) {
        console.error(err);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            result: false,
            message: err.expose ? err.message : null
        }
    }
});
routeApp(app);

const server = app.listen(config.port, config.host, () => {
    logMessage(`[SERVER] Server started on ${config.host}:${config.port}`);

    try {
        process.send("ready"); // for process manager
    }
    catch (e) {
        logErrorMessage(e);
    }
});

// for process manager
process.on("SIGINT", async () => {
    logMessage("[SERVER] SIGINT");

    const serverClosePromise = promisify(server.close);
    //tedisPool.release();

    await serverClosePromise;
    console.log("[SERVER] EXIT");
    process.exit();
});