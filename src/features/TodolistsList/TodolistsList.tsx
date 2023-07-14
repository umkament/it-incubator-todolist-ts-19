import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {FilterValuesType, todolistsActions, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {tasksThunks} from "features/TodolistsList/tasks.reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useActions} from "common/hooks";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {selectTodolists} from "features/TodolistsList/todolists.selectors";
import {TaskStatuses} from "common/enums";

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {fetchTodolists, removeTodolist: removeTodolist_, addTodolist: addTodolist_, changeTodolistTitle: changeTodolistTitle_} = useActions(todolistsThunks);
  const {removeTask: removeTask_, addTask: addTask_, updateTask} = useActions(tasksThunks)
  const {changeTodolistFilter} = useActions(todolistsActions)

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    removeTask_({ taskId, todolistId });
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    addTask_({ title, todolistId });
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId, domainModel: { status }, todolistId });
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    updateTask({ taskId, domainModel: { title }, todolistId });
  }, []);

  const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
    changeTodolistFilter({ id, filter });
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    removeTodolist_(id);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTodolistTitle_({ id, title });
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
     addTodolist_(title);
    },
    [],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
