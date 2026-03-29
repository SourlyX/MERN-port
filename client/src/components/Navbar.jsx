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
  
  @media (max-width: 768px) {
    top: 0;
    border-radius: ${props => props.$menuOpen ? '0 0 16px 16px' : '0'};
    height: ${props => props.$menuOpen ? 'auto' : '0'};
    max-height: ${props => props.$menuOpen ? '100vh' : '0'};
    opacity: ${props => props.$menuOpen ? '1' : '0'};
    padding: ${props => props.$menuOpen ? '2rem 0' : '0'};
    border: ${props => props.$menuOpen ? '1px solid #55F5ED' : 'none'};
    transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease, border-radius 0.3s ease;
    z-index: 2147483646;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`

const ListItem = styled.li`
  display: block;
  transform: translatey(18px);
  transition: all .3s;
  
  &:active {
    transform: translatey(-18px);
    cursor: pointer;
    padding: 0 1.5rem;
  }
  
  &:active a{
    transform: translatey(15px);
    color: #6BFFA6;
  }

  &:before{
    content: attr(label);
    display: block;
    transform: translatey(-1rem);
    opacity: 1;
  }

  @media (max-width: 768px) {
    transform: none;

    &:active {
      transform: none;
      padding: 0;
    }

    &:before {
      display: none;
    }
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

  @media (max-width: 768px) {
    background-color: transparent;
    border-radius: 0;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    margin: 0;

    &:active {
      background-color: transparent;
      color: #6BFFA6;
    }
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

const HamburgerIcon = styled.button`
  display: none;
  position: fixed;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  color: #55F5ED;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2147483648;
  
  @media (max-width: 768px) {
    display: block;
  }
`

function Navbar({ items, contactRef, toastVisibility, setMessage }) {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
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
      <HamburgerIcon onClick={() => setMenuOpen(!menuOpen)}>☰</HamburgerIcon>
      <Nav $menuOpen={menuOpen}>
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