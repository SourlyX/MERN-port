import React from 'react'
import styled from 'styled-components'

const Nav = styled.nav`
  position: fixed;
  top: 1px;
  left: 0;
  z-index: 2147483647;
  background-color: #282C34;
  color: #55F5ED;
  width: 100%;
  border: 1px solid #55F5ED;
  border-radius: 50px;
  height: 1.5rem;
  font-size: 1rem;
  overflow: hidden;
`

const List = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  transition: all .4s;
`

const ListItem = styled.li`
  display: block;
  transform: translatey(18px);
  transition: all .3s;
  
  &:hover{
    transform: translatey(-18px);
    cursor: pointer;
    padding: 0 1.5rem;
  }
  
  &:hover a{
    transform: translatey(15px);
    color: #6BFFA6;
  }

  &:before{
    content: attr(label);
    display: block;
    transform: translatey(-1rem);
    opacity: 1;
  }
`

const Link = styled.a`
  color: #55F5ED;
  text-decoration: none;
  padding: 10px;
  margin: -10px;
  background-color: #3B3F46;
  border-radius: 50%;
  
  &:hover {
    background-color: #FF6B6B;
  }
`

function Navbar({ items, contactRef }){
  const handleClick = (url) => {
    if (url === "#contact") {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        window.scrollBy({ top: -100 });
      }, 700)
    } else {
      window.location.href = url
    }
  }

  return (
    <Nav>
      <List>
        {items.map((item, index) => (
          <ListItem label={item.label} key={index}>
            <Link as="button" onClick={() => handleClick(item.url)}>
              {item.label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Nav>
  )
}

export default Navbar
