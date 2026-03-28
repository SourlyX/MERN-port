import { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

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

const Hyperlink = styled.a`
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
`

const Modal = styled.div`
  background-color: #282C34;
  border: 1px solid #55F5ED;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  min-width: 300px;
`

const ModalText = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const ModalButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    opacity: 0.85;
  }
`

const CancelButton = styled(ModalButton)`
  background-color: #4b5563;
  color: #fff;
`

const ConfirmButton = styled(ModalButton)`
  background-color: #FF6B6B;
  color: #fff;
`

function Navbar({ items, contactRef, toastVisibility, setMessage }) {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowModal(false)
    }

    if (showModal) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [showModal])

  let navItems = [...items]

  const handleLogout = () => {
    logout()
    setShowModal(false)
    setMessage('Logged out successfully!')
    toastVisibility(true)
  }

  if (isAuthenticated) {
    navItems.push({ label: 'Logout', url: '/logout' })
  } else {
    navItems.push({ label: 'Login', url: '/login' })
  }

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
    <>
      <Nav>
        <List>
          {navItems.map((item, index) =>
            item.label === 'Logout' ? (
              <ListItem label={item.label} key={index}>
                <Hyperlink as="button" onClick={() => setShowModal(true)}>
                  {item.label}
                </Hyperlink>
              </ListItem>
            ) : (
              <ListItem label={item.label} key={index}>
                <Hyperlink
                  as="button"
                  onClick={() => {
                    if (item.url === '/login') {
                      navigate('/login', { state: { from: location.pathname } })
                    } else {
                      navigate(item.url)
                    }
                  }}
                >
                  {item.label}
                </Hyperlink>
              </ListItem>
            )
          )}
        </List>
      </Nav>

      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalText>Are you sure you want to log out?</ModalText>
            <ModalButtons>
              <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
              <ConfirmButton onClick={handleLogout}>Yes, logout</ConfirmButton>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </>
  )
}

export default Navbar