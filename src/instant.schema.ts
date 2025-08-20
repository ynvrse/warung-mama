import { i } from '@instantdb/react';
const _schema = i.schema({
    entities: {
        $files: i.entity({
            path: i.string().unique().indexed(),
            url: i.string(),
        }),
        profiles: i.entity({
            userId: i.string().optional(),
            firstName: i.string().optional(),
            lastName: i.string().optional(),
            fullName: i.string().optional(),
            profilePicture: i.string().optional(),
            email: i.string().optional(),
            createdAt: i.date().optional(),
            updatedAt: i.date().optional(),
        }),
        todos: i.entity({
            text: i.string(),
            done: i.boolean(),
            createdAt: i.number(),
        }),
        
        products: i.entity({
            name: i.string(),
            price: i.number(),
            createdAt: i.date().optional(),
            updatedAt: i.date().optional(),
        }),
        categories: i.entity({
            name: i.string(),
            icon: i.any(),
        })
    },
    rooms: {
        todos: {
            presence: i.entity({}),
        },
    },
});
// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
