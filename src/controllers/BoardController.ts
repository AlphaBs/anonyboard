import Koa from "koa";
import { Article, boardScheme } from "../models/Article.js";
import BoardService from "../services/BoardService.js";

export default {
    async getAllArticles(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        const category: string = ctx.params.category;
        if (!category)
            return ctx.throw(401);

        const articles = await BoardService.getArticles(category);
        const articleDtos = articles.map(a => a.toDto());
        ctx.body = {
            articles: articleDtos
        };
        await next();
    },

    async createArticle(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        const category: string = ctx.params.category;
        if (!category)
            return ctx.throw(401);
        const categoryNumber: number = parseInt(category);

        const body: any = ctx.request.body;

        if (!body)
            return ctx.throw(400);

        const ipv4 = ctx.request.ip.split('.');
        const ipv6 = ctx.request.ip.split(':');

        let maskIp: string;
        if (ipv4.length === 4)
            maskIp = ipv4[0] + "." + ipv4[1];
        else if (ipv6.length > 1)
            maskIp = ipv6[0] + ":" + ipv6[1];
        else
            maskIp = ctx.request.ip.slice(0, 7);
        
        body.name = `${body.name} (${maskIp})`;
        body.time = new Date();
        body.category = categoryNumber;

        const articleValidateResult = boardScheme.validate(body);
        if (articleValidateResult.error)
            return ctx.throw(400, articleValidateResult.error);

        const article: Article = body as Article;
        await BoardService.createArticle(article);

        ctx.status = 204;
        await next();
    },

    async postArticle(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        const category: string = ctx.params.category;
        if (!category)
            return ctx.throw(401);
        const categoryNumber: number = parseInt(category);

        if (!ctx.request.body)
            return ctx.throw(400);

        const article = ctx.request.body as Article;

        if (ctx.params.id !== article.id)
            return ctx.throw(400, "id does not match");

        const orgArticle = await BoardService.getArticle(article.id);
        if (article.category !== categoryNumber)
            return ctx.throw(404);

        if (article.password !== orgArticle.password)
            return ctx.throw(403, "password does not match");
        
        orgArticle.content = article.content;
        orgArticle.name = article.name;
        await BoardService.updateArticle(orgArticle);

        ctx.status = 204;
        await next();
    },

    async deleteArticle(ctx: Koa.Context, next: Koa.Next): Promise<void> {
        const id = ctx.params.id;
        const category: string = ctx.params.category;
        if (!category)
            return ctx.throw(401);
        const categoryNumber: number = parseInt(category);

        const authorization = ctx.get("authorization");
        if (!authorization)
            return ctx.throw(401);
        
        const authorizationSplit = authorization.split(' ');
        if (authorizationSplit.length !== 2)
            return ctx.throw(401);
        
        if (authorizationSplit[0].toLocaleLowerCase() !== "basic")
            return ctx.throw(401);

        const authKey: string = authorizationSplit[1];

        const article = await BoardService.getArticle(id);
        if (article.category !== categoryNumber)
            return ctx.throw(404);
            
        if (article.password !== authKey)
            return ctx.throw(403);

        await BoardService.deleteArticle(id);

        ctx.status = 204;
        await next();
    },
};