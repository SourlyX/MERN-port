/**
 * ToDoList.jsx
 * Lista de tareas con drag & drop (mouse y touch), persistencia en DB,
 * y sincronización con AuthContext.
 */

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUserData } from "../../api/users";
import styled from "styled-components";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ===================== Styled Components ===================== */

/** Contenedor principal de la lista */
const Container = styled.div`
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 30px;
  margin-top: 50px;
  margin-bottom: 50px;
`;

/** Fila de cada tarea individual */
const Todo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  min-height: 55px;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  margin-bottom: 6px;
  touch-action: none;
`;

/** Título principal */
const Title = styled.h2`
  color: #55f5ed;
  margin-bottom: 30px;
`;

/** Nombre de la tarea — tachado si está completada */
const Text = styled.p`
  font-size: 20px;
  width: 90%;
  padding: 0 5px;
  text-align: center;
  text-decoration: ${({ $active }) => (!$active ? "line-through" : "none")};
  color: #f5f5f5;
`;

/** Sección para agregar nueva tarea */
const NewTodo = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

/** Botón para agregar tarea */
const AddNew = styled.button`
  background-color: #55f5ed;
  color: #2c3e50;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #4ae5e0;
  }
`;

/** Ícono de papelera */
const Bin = styled.img`
  height: 55px;
  width: auto;
  cursor: pointer;
  margin: 3px 10px;

  &:hover {
    scale: 1.05;
  }
`;

/**
 * Handle de drag — área que el usuario agarra para reordenar.
 * touch-action: none es crítico para que dnd-kit intercepte
 * el evento antes que el browser en móvil.
 */
const DragHandle = styled.span`
  cursor: grab;
  padding: 0 14px;
  font-size: 28px;
  font-size: 20px;
  color: #888;
  display: flex;
  align-items: center;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

/* ===================== Componente Sortable ===================== */

/**
 * SortableTodo — wrapper de cada tarea que habilita el drag & drop.
 * useSortable provee ref, estilos de transformación y los listeners
 * de eventos que dnd-kit necesita para rastrear el arrastre.
 *
 * @param {Object}   todo      - Objeto de la tarea ({ _id, name, active }).
 * @param {number}   index     - Índice en el array (para toggle y remove).
 * @param {Function} onToggle  - Alterna el estado activo/completado.
 * @param {Function} onRemove  - Elimina la tarea.
 */
const SortableTodo = ({ todo, index, onToggle, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo._id });

  // CSS.Transform convierte el objeto de transformación de dnd-kit
  // a una string válida de CSS (translate3d, scale, etc.)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Todo ref={setNodeRef} style={style}>
      {/* Handle de drag — solo esta área activa el arrastre */}
      <DragHandle {...attributes} {...listeners}>
        ⠿
      </DragHandle>

      {/* Checkbox para marcar como completada */}
      <input
        type="checkbox"
        checked={!todo.active}
        onChange={() => onToggle(index)}
        style={{ cursor: "pointer", margin: "0 10px" }}
      />

      {/* Nombre de la tarea */}
      <Text $active={todo.active}>{todo.name}</Text>

      {/* Botón eliminar */}
      <Bin
        src="/productos/garbage.png"
        alt="Garbage Icon"
        onClick={() => onRemove(index)}
      />
    </Todo>
  );
};

/* ===================== Componente Principal ===================== */

/**
 * ToDoList — lista de tareas conectada a AuthContext y a la DB.
 *
 * Los todos viven en el contexto (user.todos) — no hay estado local duplicado.
 * Cada mutación actualiza el contexto primero (optimistic update)
 * y luego persiste en la DB via updateUserData.
 */
const ToDoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const { user, updateUser } = useContext(AuthContext);

  // Lee directo del contexto — si no hay user, array vacío
  const todos = user?.todos ?? [];

  /* ---- Drag & Drop ---- */

  /**
   * Sensores de dnd-kit:
   * - PointerSensor (mouse): requiere mover 8px antes de activar
   *   para no interferir con clicks normales.
   * - TouchSensor (móvil): requiere mantener 250ms con tolerancia
   *   de 5px para distinguir entre tap y drag.
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  /**
   * Se ejecuta al soltar un item arrastrado.
   * Usa arrayMove para reordenar y persiste en DB.
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t._id === active.id);
    const newIndex = todos.findIndex((t) => t._id === over.id);
    const updated = arrayMove(todos, oldIndex, newIndex);

    updateUser({ ...user, todos: updated });
    await updateUserData({ todos: updated });
  };

  /* ---- CRUD Handlers ---- */

  /**
   * Alterna el estado activo/completado de una tarea.
   * Construye el nuevo array antes de setear para evitar
   * mandar el estado anterior al API (React re-render es async).
   */
  const handleClick = async (index) => {
    const updated = todos.map((todo, i) =>
      i === index ? { ...todo, active: !todo.active } : todo,
    );
    updateUser({ ...user, todos: updated });
    const savedUser = await updateUserData({ todos: updated });
    if (savedUser) updateUser(savedUser);
  };

  /** Agrega una nueva tarea. Ignora strings vacíos o solo espacios. */
  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    const tempId = crypto.randomUUID();
    const updated = [...todos, { name: newTodo, active: true, _id: tempId }];
    updateUser({ ...user, todos: updated });
    setNewTodo("");

    const payload = updated.map(({ _id, ...rest }) =>
      _id === tempId ? rest : { _id, ...rest },
    );
    const savedUser = await updateUserData({ todos: payload });
    if (savedUser) updateUser(savedUser);
  };

  /** Elimina una tarea por índice. */
  const removeTodo = async (index) => {
    const updated = todos.filter((_, i) => i !== index);
    updateUser({ ...user, todos: updated });
    const savedUser = await updateUserData({ todos: updated });
    if (savedUser) updateUser(savedUser);
  };
  /* ===================== Renderizado ===================== */
  return (
    <>
      <Container>
        <Title>To-Do List</Title>

        {/* DndContext — provee el contexto global de drag & drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* SortableContext — usa _id de Mongo como ID único de cada item */}
          <SortableContext
            items={todos.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map((todo, index) => (
              <SortableTodo
                key={todo._id}
                todo={todo}
                index={index}
                onToggle={handleClick}
                onRemove={removeTodo}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Input para agregar nueva tarea — soporta Enter y click */}
        <NewTodo>
          <input
            type="text"
            placeholder="New To-Do"
            style={{ height: "35px", borderRadius: "10px" }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <AddNew onClick={addTodo}>Add To-Do</AddNew>
        </NewTodo>
      </Container>
    </>
  );
};

export default ToDoList;
