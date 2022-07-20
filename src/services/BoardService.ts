import sql from "../db.js";
import { Article } from "../models/Article.js";
import { ArticleDto } from "../models/ArticleDto.js";

export default {
    async getArticles(category: string): Promise<Article[]> {
        const articles = await sql`
        SELECT id, content, name, time, password, category FROM board
        WHERE category = ${ category }
        `;

        if (!articles || !Array.isArray(articles))
            return [];
        
        return articles.map(row => {
            const a = new Article();
            a.id = row.id;
            a.content = row.content;
            a.name = row.name;
            a.time = row.time;
            a.password = row.password;
            a.category = row.category;
            return a;
        });
    },

    async getArticle(id: string): Promise<Article> {
        const [row]: [Article] = await sql`
        SELECT id, content, name, time, password, category FROM board
        WHERE id = ${ id }
        `;

        return row;
    },

    async createArticle(article: Article): Promise<void> {
        await sql`
        INSERT INTO board (content, name, time, password, category)
        VALUES ( ${ article.content }, ${ article.name }, ${ article.time }, ${ article.password }, ${ article.category } )
        `;
    },

    async updateArticle(article: Article): Promise<void> {
        await sql`
        UPDATE board SET
        content = ${ article.content },
        name = ${ article.name }
        WHERE id = ${ article.id }
        `;
    },

    async deleteArticle(id: string): Promise<void> {
        await sql`
        DELETE FROM board
        WHERE id = ${ id }
        `;
    }
}