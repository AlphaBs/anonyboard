import Router from "koa-router";
import { getConfig } from "../core/configManager.js";
import { IAppContext } from "../models/IAppContext.js";
import { IAppState } from "../models/IAppState.js";
import koaBody from "koa-body";

const config = getConfig();
const router = new Router<IAppState, IAppContext>();

router.use(koaBody());

router.post("/report", async (ctx, next) => {
    const body = ctx.request.body;
    const documentId = body.traceId;

    //if (!documentId || typeof documentId !== "string")
    //    throw new HttpError("require traceId property", "badrequest", 400)

    ctx.body = { result: true };
    await next();
});

router.get("/version", async (ctx, next) => {
    ctx.body = "0.0.1";
    await next();
});

router.get("/test", async (ctx, next) => {
    ctx.body = "test";
    await next();
});

export default router;