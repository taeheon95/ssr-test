import React, {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useReducer,
} from "react";
import TodoPresenter from "./TodoPresenter";

interface TodoState {
  title: string;
  size: number;
  todoList: TodoItem[];
}

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  createAt: number;
  updateAt: number;
}

const initialState: TodoState = {
  title: "",
  size: 0,
  todoList: [],
};

type TodoAction =
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

function TodoContainer() {
  const [todoState, dispatch] = useReducer(todoReducer, initialState);

  const handleTodo = useCallback<ChangeEventHandler>(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "CHANGE_TODO", payload: e.target.value });
    },
    []
  );

  const addTodo = useCallback(() => {
    dispatch({ type: "ADD_TODO" });
  }, []);

  const deleteTodo = useCallback(
    (id: number) => () => {
      dispatch({ type: "DELETE_TODO", payload: id });
    },
    []
  );

  const handleTodoTitle = useCallback(
    (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "CHANGE_TITLE",
        payload: { id, title: e.target.value },
      });
    },
    []
  );

  const handleTodoIsDone = useCallback(
    (id: number) => () => {
      dispatch({
        type: "CHANGE_IS_DONE",
        payload: id,
      });
    },
    []
  );

  return <TodoPresenter />;
}

export default TodoContainer;
