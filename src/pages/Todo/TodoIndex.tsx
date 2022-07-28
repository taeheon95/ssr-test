import React, { useReducer } from "react";
import TodoContainer from "./TodoContainer";

export interface TodoState {
  title: string;
  size: number;
  todoList: TodoItem[];
}

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  createAt: number;
  updateAt: number;
}

export const initialState: TodoState = {
  title: "",
  size: 0,
  todoList: [],
};

export type TodoAction =
  | { type: "CHANGE_TODO"; payload: string }
  | { type: "ADD_TODO" }
  | { type: "CHANGE_IS_DONE"; payload: number }
  | { type: "CHANGE_TITLE"; payload: { id: number; title: string } }
  | { type: "DELETE_TODO"; payload: number };

function todoReducer(state: TodoState, action: TodoAction) {
  switch (action.type) {
    case "CHANGE_TODO":
      return {
        ...state,
        title: action.payload,
      };
    case "ADD_TODO":
      return {
        ...state,
        title: "",
        size: state.size + 1,
        todoList: [
          ...state.todoList,
          {
            id:
              state.todoList.length !== 0
                ? state.todoList[state.todoList.length - 1].id + 1
                : 0,
            title: state.title,
            done: false,
            createAt: Date.now(),
            updateAt: Date.now(),
          },
        ],
      };
    case "DELETE_TODO":
      return {
        ...state,
        size: state.size - 1,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload),
      };
    case "CHANGE_IS_DONE":
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload) {
            todo.done = !todo.done;
            todo.updateAt = Date.now();
          }
          return todo;
        }),
      };
    case "CHANGE_TITLE":
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            todo.title = action.payload.title;
            todo.updateAt = Date.now();
          }
          return todo;
        }),
      };
    default:
      return state;
  }
}

function TodoIndex() {
  const [todoState, dispatch] = useReducer(todoReducer, initialState);
  return <TodoContainer todoState={todoState} dispatch={dispatch} />;
}

export default React.memo(TodoIndex);
