import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #1E1E1E;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 30px;
  margin-top: 50px;
  margin-bottom: 50px;
`

const Todo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  border: 1px solid #3A3A3A;
  border-radius: 4px;
`

const Title = styled.h2`
  color: #55F5ED;
  margin-bottom: 30px;
`

const Text = styled.p`
  font-size: 20px;
  width: 90%;
  padding: 0 5px;
  text-align: center;
  text-decoration: ${({ $active }) => (!$active ? 'line-through' : 'none')};
  color: #f5f5f5;
`

const NewTodo = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

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
`

const Bin = styled.img`
  height: 55px;
  width: auto;
  cursor: pointer;
  margin: 3px 10px;

  &:hover {
    scale: 1.05;
  }
`

const ToDoList = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState("")

  const handleClick = (index) => {
    setTodos((prevState) => 
      prevState.map((todo, i) => 
        i === index ? { ...todo, active: !todo.active } : todo
      )
    )
  }

  const addTodo = () => {
    if (newTodo.trim() === "") return

    const newTask = {
      name: newTodo,
      active: true,
    }

    setTodos([...todos, newTask])
    setNewTodo("")
  }
  
  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, todoIndex) => todoIndex !== index)
    setTodos(updatedTodos)
  }

  return (
    <>
      <Container>
        <Title>To-Do List</Title>
        {todos.map((todo, index) => (
          <Todo key={index}>
            <input
              type="checkbox"
              checked={!todo.active}
              onChange={() => handleClick(index)}
              style={{ cursor: "pointer", margin: "0 10px 0 10px" }}
            />
            <Text $active={todo.active}>{todo.name}</Text>
            <Bin
              src="/productos/garbage.png"
              alt="Garbage Icon"
              onClick={() => removeTodo(index)}/>
          </Todo>
        ))}
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
  )
}

export default ToDoList
