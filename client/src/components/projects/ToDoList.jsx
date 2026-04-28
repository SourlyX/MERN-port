/**
 * ToDoList.jsx
 * Componente de lista de tareas (To-Do List) que permite agregar, completar y eliminar tareas.
 * Recibe el estado de los todos y su setter como props desde el componente padre.
 */

import { useState } from 'react';
import styled from 'styled-components';

/* ===================== Styled Components ===================== */

/** Contenedor principal de la lista de tareas */
const Container = styled.div`
  background-color: #1E1E1E;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 30px;
  margin-top: 50px;
  margin-bottom: 50px;
`;

/** Contenedor de cada tarea individual (fila) */
const Todo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  border: 1px solid #3A3A3A;
  border-radius: 4px;
`;

/** Título principal del componente */
const Title = styled.h2`
  color: #55F5ED;
  margin-bottom: 30px;
`;

/** Texto de la tarea, con tachado condicional si está completada */
const Text = styled.p`
  font-size: 20px;
  width: 90%;
  padding: 0 5px;
  text-align: center;
  text-decoration: ${({ $active }) => (!$active ? 'line-through' : 'none')};
  color: #f5f5f5;
`;

/** Contenedor del input y botón para agregar nuevas tareas */
const NewTodo = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

/** Botón para agregar una nueva tarea */
const AddNew = styled.button`
  background-color: #55F5ED;
  color: #2C3E50;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #4AE5E0;
  }
`;

/** Ícono de papelera para eliminar una tarea */
const Bin = styled.img`
  height: 55px;
  width: auto;
  cursor: pointer;
  margin: 3px 10px;

  &:hover {
    scale: 1.05;
  }
`;

/* ===================== Componente Principal ===================== */

/**
 * Componente ToDoList
 * @param {Object[]} todos - Array de objetos con las tareas ({ name: string, active: boolean }).
 * @param {Function} setTodos - Función setter para actualizar el estado de las tareas.
 */
const ToDoList = ({ todos, setTodos }) => {
  /** Estado local para el texto de la nueva tarea */
  const [newTodo, setNewTodo] = useState("");

  /**
   * Handler para alternar el estado activo/completado de una tarea.
   * @param {number} index - Índice de la tarea a alternar.
   */
  const handleClick = (index) => {
    setTodos((prevState) =>
      prevState.map((todo, i) =>
        i === index ? { ...todo, active: !todo.active } : todo
      )
    );
  };

  /**
   * Agrega una nueva tarea a la lista.
   * No agrega tareas con texto vacío o solo espacios.
   */
  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newTask = {
      name: newTodo,
      active: true,
    };

    setTodos([...todos, newTask]);
    setNewTodo("");
  };

  /**
   * Elimina una tarea de la lista por su índice.
   * @param {number} index - Índice de la tarea a eliminar.
   */
  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, todoIndex) => todoIndex !== index);
    setTodos(updatedTodos);
  };

  /* ===================== Renderizado ===================== */
  return (
    <>
      <Container>
        {/* Título de la lista */}
        <Title>To-Do List</Title>

        {/* Iteración y renderizado de cada tarea */}
        {todos.map((todo, index) => (
          <Todo key={index}>
            {/* Checkbox para marcar tarea como completada */}
            <input
              type="checkbox"
              checked={!todo.active}
              onChange={() => handleClick(index)}
              style={{ cursor: "pointer", margin: "0 10px 0 10px" }}
            />
            {/* Nombre de la tarea */}
            <Text $active={todo.active}>{todo.name}</Text>
            {/* Botón de eliminar tarea */}
            <Bin
              src="/productos/garbage.png"
              alt="Garbage Icon"
              onClick={() => removeTodo(index)}
            />
          </Todo>
        ))}

        {/* Sección para agregar una nueva tarea */}
        <NewTodo>
          <input
            type="text"
            placeholder="New To-Do"
            style={{ height: "35px", borderRadius: "10px" }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <AddNew onClick={addTodo}>Add To-Do</AddNew>
        </NewTodo>
      </Container>
    </>
  );
};

export default ToDoList;