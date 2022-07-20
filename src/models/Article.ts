import Joi from "joi";
import { ArticleDto } from "./ArticleDto.js";

export class Article {
    id: string;
    content: string;
    name: string;
    time: Date;
    password: string;
    category: number;

    toDto(): ArticleDto {
        const dto = new ArticleDto();
        dto.id = this.id;
        dto.name = this.name;
        dto.time = this.time;
        dto.category = this.category;
        dto.content = this.content;
        return dto;
    }
}

const boardScheme = Joi.object({
    id: Joi.number(),

    content: Joi.string()
        .max(255)
        .required(),

    name: Joi.string()
        .max(16)
        .required(),

    time: Joi.date()
        .required(),

    password: Joi.string()
        .min(4)
        .max(32)
        .required(),

    category: Joi.number()
        .required()
});

export {
    boardScheme
}