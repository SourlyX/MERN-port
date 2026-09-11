/**
 * ToDoList.jsx
 * Lista de tareas con drag & drop (mouse y touch), persistencia en DB,
 * y sincronización con AuthContext.
 */

import { useEffect, useState, useContext } from "react";
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

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
    margin-top: 50px;
    margin-bottom: 20px;
  }
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

const ListControls = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin: -10px 0 25px;
  flex-wrap: wrap;

  select,
  input {
    min-height: 36px;
    border-radius: 6px;
    padding: 0 8px;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #55f5ed;
  border: 1px solid #55f5ed;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background: #55f5ed;
    color: #2c3e50;
  }
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
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const { user, updateUser } = useContext(AuthContext);

  const todoLists = user?.todoLists ?? [];
  const selectedList = todoLists.find((list) => list._id === selectedListId);
  const todos = selectedList?.todos ?? [];

  useEffect(() => {
    if (!selectedListId && todoLists.length > 0) {
      setSelectedListId(todoLists[0]._id);
    } else if (
      selectedListId &&
      !todoLists.some((list) => list._id === selectedListId)
    ) {
      setSelectedListId(todoLists[0]?._id ?? "");
    }
  }, [todoLists, selectedListId]);

  const persistLists = async (updatedLists) => {
    updateUser({ ...user, todoLists: updatedLists });
    const savedUser = await updateUserData({ todoLists: updatedLists });
    if (savedUser) updateUser(savedUser);
    return savedUser;
  };

  const createList = async () => {
    const name = newListName.trim();
    if (!name) return;

    if (todoLists.some((list) => list.name === name)) {
      const shouldCreate = window.confirm(
        `La lista "${name}" ya existe. ¿Quieres crear otra?`,
      );
      if (!shouldCreate) return;
    }

    const savedUser = await persistLists([
      ...todoLists,
      { name, todos: [] },
    ]);
    const createdList = savedUser?.todoLists?.at(-1);
    if (createdList) setSelectedListId(createdList._id);
    setNewListName("");
  };

  const renameList = async () => {
    if (!selectedList) return;
    const name = window.prompt("Nuevo nombre de la lista:", selectedList.name);
    if (name === null || !name.trim()) return;
    await persistLists(
      todoLists.map((list) =>
        list._id === selectedListId ? { ...list, name: name.trim() } : list,
      ),
    );
  };

  const deleteList = async () => {
    if (!selectedList) return;
    const shouldDelete = window.confirm(
      `¿Seguro que quieres eliminar la lista "${selectedList.name}" y todas sus tareas?`,
    );
    if (!shouldDelete) return;
    await persistLists(todoLists.filter((list) => list._id !== selectedListId));
  };

  const updateSelectedTodos = async (updatedTodos) => {
    await persistLists(
      todoLists.map((list) =>
        list._id === selectedListId ? { ...list, todos: updatedTodos } : list,
      ),
    );
  };

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

    await updateSelectedTodos(updated);
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
    await updateSelectedTodos(updated);
  };

  /** Agrega una nueva tarea. Ignora strings vacíos o solo espacios. */
  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    const tempId = crypto.randomUUID();
    const updated = [...todos, { name: newTodo, active: true, _id: tempId }];
    setNewTodo("");

    const payload = updated.map(({ _id, ...rest }) =>
      _id === tempId ? rest : { _id, ...rest },
    );
    await updateSelectedTodos(payload);
  };

  /** Elimina una tarea por índice. */
  const removeTodo = async (index) => {
    const updated = todos.filter((_, i) => i !== index);
    await updateSelectedTodos(updated);
  };
  /* ===================== Renderizado ===================== */
  return (
    <>
      <Container>
        <Title>To-Do List</Title>

        <ListControls>
          <select
            aria-label="Seleccionar lista"
            value={selectedListId}
            onChange={(event) => setSelectedListId(event.target.value)}
          >
            {todoLists.length === 0 ? (
              <option value="">No hay listas</option>
            ) : (
              todoLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.name}
                </option>
              ))
            )}
          </select>
          <input
            type="text"
            placeholder="Nombre de lista"
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && createList()}
          />
          <SecondaryButton onClick={createList}>Crear lista</SecondaryButton>
          <SecondaryButton onClick={renameList} disabled={!selectedList}>
            Renombrar
          </SecondaryButton>
          <SecondaryButton onClick={deleteList} disabled={!selectedList}>
            Eliminar
          </SecondaryButton>
        </ListControls>

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
        {selectedList && <NewTodo>
          <input
            type="text"
            placeholder="New To-Do"
            style={{ height: "35px", borderRadius: "10px" }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <AddNew onClick={addTodo}>Add To-Do</AddNew>
        </NewTodo>}
      </Container>
    </>
  );
};

export default ToDoList;
