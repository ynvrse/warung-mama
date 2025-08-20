import { InstaQLEntity, i, init } from '@instantdb/react';

import { env } from '@/lib/env';

const APP_ID = env.instantDbAppId;

const schema = i.schema({
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
    },
    rooms: {
        todos: {
            presence: i.entity({}),
        },
    },
});

export type Todo = InstaQLEntity<typeof schema, 'todos'>;

const db = init({ appId: APP_ID, schema });
const room = db.room('todos');

export { db, room };
