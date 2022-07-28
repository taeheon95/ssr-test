import React, { ChangeEventHandler } from "react";
import { TodoState } from "./TodoIndex";

interface Props {
  todoState: TodoState;
  handleTodo: ChangeEventHandler;
  addTodo: () => void;
  deleteTodo: (id: number) => () => void;
  handleTodoTitle: (id: number) => ChangeEventHandler;
  handleTodoIsDone: (id: number) => () => void;
}

function TodoPresenter(props: Props) {
  const {
    todoState,
    addTodo,
    handleTodo,
    deleteTodo,
    handleTodoIsDone,
    handleTodoTitle,
  } = props;

  return (
    <div className="bg-slate-500 mt-3 ml-3 pt-3 pl-3 pb-3">
      <label className="bg-neutral-300 pt-1 pb-1 pl-1 pr-1" htmlFor="todo">
        입력창
      </label>
      <input
        className="ml-4 mr-4 rounded-md"
        title="todo"
        value={todoState.title}
        onChange={handleTodo}
      />
      <button className="bg-teal-400 rounded-md" onClick={addTodo}>
        추가
      </button>
      {todoState.todoList.map((todo, idx) => (
        <div className="m-2" key={todo.id}>
          <label className="mr-3" htmlFor={`todo_${todo.id}`}>
            {idx + 1}
          </label>
          <input
            className="rounded-md mr-3"
            title={`todo_${todo.id}`}
            value={todo.title}
            onChange={handleTodoTitle(todo.id)}
          />
          <label htmlFor="todo_isDone">Is done</label>
          <input
            className="ml-4"
            title="todo_isDone"
            type="checkbox"
            onChange={handleTodoIsDone(todo.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default TodoPresenter;
