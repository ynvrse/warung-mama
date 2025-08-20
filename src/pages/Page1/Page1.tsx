import { id } from '@instantdb/react';

import { Todo, db, room } from '@/hooks/useInstantDb';

function Page1() {
    const { isLoading, error, data } = db.useQuery({ todos: {} });
    const { peers } = db.rooms.usePresence(room);
    const numUsers = 1 + Object.keys(peers).length;
    if (isLoading) {
        return;
    }
    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }
    const { todos } = data;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 font-mono">
            <div className="text-xs text-gray-500">Number of users online: {numUsers}</div>
            <h2 className="text-5xl tracking-wide text-gray-300">todos</h2>
            <div className="w-full max-w-xs border border-gray-300">
                <TodoForm todos={todos} />
                <TodoList todos={todos} />
                <ActionBar todos={todos} />
            </div>
            <div className="text-center text-xs">Open another tab to see todos update in realtime!</div>
        </div>
    );
}

function addTodo(text: string) {
    db.transact(
        db.tx.todos[id()].update({
            text,
            done: false,
            createdAt: Date.now(),
        }),
    );
}

function deleteTodo(todo: Todo) {
    db.transact(db.tx.todos[todo.id].delete());
}

function toggleDone(todo: Todo) {
    db.transact(db.tx.todos[todo.id].update({ done: !todo.done }));
}

function deleteCompleted(todos: Todo[]) {
    const completed = todos.filter((todo) => todo.done);
    const txs = completed.map((todo) => db.tx.todos[todo.id].delete());
    db.transact(txs);
}

function toggleAll(todos: Todo[]) {
    const newVal = !todos.every((todo) => todo.done);
    db.transact(todos.map((todo) => db.tx.todos[todo.id].update({ done: newVal })));
}

// Components
// ----------
function ChevronDownIcon() {
    return (
        <svg viewBox="0 0 20 20">
            <path d="M5 8 L10 13 L15 8" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
    );
}

function TodoForm({ todos }: { todos: Todo[] }) {
    return (
        <div className="flex h-10 items-center border-b border-gray-300">
            <button
                className="flex h-full items-center justify-center border-r border-gray-300 px-2"
                onClick={() => toggleAll(todos)}
            >
                <div className="h-5 w-5">
                    <ChevronDownIcon />
                </div>
            </button>
            <form
                className="h-full flex-1"
                onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.input as HTMLInputElement;
                    addTodo(input.value);
                    input.value = '';
                }}
                autoComplete="off"
            >
                <input
                    className="h-full w-full bg-transparent px-2 outline-none"
                    autoFocus
                    placeholder="What needs to be done?"
                    type="text"
                    autoComplete="off"
                    name="input"
                />
            </form>
        </div>
    );
}

function TodoList({ todos }: { todos: Todo[] }) {
    return (
        <div className="divide-y divide-gray-300">
            {todos.map((todo) => (
                <div key={todo.id} className="flex h-10 items-center">
                    <div className="flex h-full items-center justify-center px-2">
                        <div className="flex h-5 w-5 items-center justify-center">
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                checked={todo.done}
                                onChange={() => toggleDone(todo)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 items-center overflow-hidden px-2">
                        {todo.done ? <span className="line-through">{todo.text}</span> : <span>{todo.text}</span>}
                    </div>
                    <button
                        className="flex h-full items-center justify-center px-2 text-gray-300 hover:text-gray-500"
                        onClick={() => deleteTodo(todo)}
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}

function ActionBar({ todos }: { todos: Todo[] }) {
    return (
        <div className="flex h-10 items-center justify-between border-t border-gray-300 px-2 text-xs">
            <div>Remaining todos: {todos.filter((todo) => !todo.done).length}</div>
            <button className="text-gray-300 hover:text-gray-500" onClick={() => deleteCompleted(todos)}>
                Delete Completed
            </button>
        </div>
    );
}

export default Page1;
