import { useState } from 'react'
import styled from 'styled-components'
import Productos from './components/Productos'
import data from './data.json'
import Navbar from './components/Navbar'
import Menu from './components/Menu'

const AppContainer = styled.div`
  background-color: #282C34;
  color: #E0E0E0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  width: 100%;
`

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const App = () => {
  const [carro, setCarro] = useState([])
  const [esCarroVisible, setEsCarroVisible] = useState(false)
  const [productoNumero, setProductoNumero] = useState(0)
  const [menu, setMenu] = useState("Entradas")

  const addToCart = (producto, data) => {
    setProductoNumero(prev => prev + 1)
    const obj = {
      numero: productoNumero,
      name: producto.name,
      img: producto.img
    }

    let guarnicionesSelected = []
    let newData = []

    data.forEach(element => {
      if (element[1]) {
        if (element[0] === "guarnicion") {
          guarnicionesSelected = guarnicionesSelected.concat(element[1])
        } else {
          newData.push(element)
        }
      }
    })

    if (guarnicionesSelected.length) {
      newData.push(["guarniciones", guarnicionesSelected])
    }

    const arrayFinal = [obj, newData]

    setCarro(prev => [...prev, { ...arrayFinal }])
  }

  const removeFromCart = (item) => {
    setCarro(prev => {
      const nuevoCarro = prev.filter(data => data !== item)
        if(nuevoCarro.length === 0) {setEsCarroVisible(false)}
        return nuevoCarro
      })
  }

  const emptyCart = () => {
    setCarro([])
    setEsCarroVisible(false)
  }

  const showCart = () => {
    if (!carro.length) return
    setEsCarroVisible(prev => !prev)
  }

  const funciones = {
    setVal: () => {},
    decrement: () => {},
    increment: () => {}
  }

  const menuSelected = data[menu.replace(/\s/g, '')]

  return (
    <AppContainer>
      <Navbar
        carro={carro}
        esCarroVisible={esCarroVisible}
        showCart={showCart}
        removeFromCart={removeFromCart}
        emptyCart={emptyCart}
      />
      <Menu 
        options={data.tiposPlato}
        setMenu={setMenu}
      />
      <Content>
        <Productos
          addToCart={addToCart}
          productos={menuSelected}
          guarniciones={data.guarniciones}
          terminosCarne={data.terminosCarne}
          carro={carro}
          functions={funciones}
        />
      </Content>
    </AppContainer>
  )
}

export default App
