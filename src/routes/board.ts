import koaBody from "koa-body";
import Router from "koa-router";
import BoardController from "../controllers/BoardController.js";
import { IAppContext } from "../models/IAppContext";
import { IAppState } from "../models/IAppState";

const router = new Router<IAppState, IAppContext>({
    prefix: "/board"
});

router.get("/:category", BoardController.getAllArticles);

router.put("/:category", koaBody(), BoardController.createArticle);

router.post("/:category/:id", koaBody(), BoardController.postArticle);

router.delete("/:category/:id", BoardController.deleteArticle);

export default router;