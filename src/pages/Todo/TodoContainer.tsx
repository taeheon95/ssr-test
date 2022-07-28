import React, {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useReducer,
} from "react";
import { TodoAction, TodoState } from "./TodoIndex";
import TodoPresenter from "./TodoPresenter";

interface Props {
  todoState: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

function TodoContainer(props: Props) {
  const { dispatch, todoState } = props;
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

  return (
    <TodoPresenter
      todoState={todoState}
      handleTodo={handleTodo}
      addTodo={addTodo}
      deleteTodo={deleteTodo}
      handleTodoIsDone={handleTodoIsDone}
      handleTodoTitle={handleTodoTitle}
    />
  );
}

export default TodoContainer;
