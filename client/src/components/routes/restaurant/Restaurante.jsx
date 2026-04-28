/**
 * App.jsx
 * Componente principal de la aplicación. Gestiona el estado del carrito de compras,
 * la navegación del menú y renderiza la estructura general de la interfaz,
 * incluyendo la barra de navegación, el menú de categorías y los productos.
 */

import { useState } from 'react';
import styled from 'styled-components';
import Productos from './components/Productos';
import data from './data.json';
import Navbar from './components/Navbar';
import Menu from './components/Menu';

/** Contenedor principal de la aplicación con fondo oscuro y layout centrado */
const AppContainer = styled.div`
  background-color: #282C34;
  color: #E0E0E0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  width: 100%;
`;

/** Contenedor del contenido principal con ancho máximo de 1200px */
const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = () => {
  // Estado del carrito de compras
  const [carro, setCarro] = useState([]);
  // Controla la visibilidad del panel del carrito
  const [esCarroVisible, setEsCarroVisible] = useState(false);
  // Contador incremental para identificar productos en el carrito
  const [productoNumero, setProductoNumero] = useState(0);
  // Categoría de menú seleccionada actualmente
  const [menu, setMenu] = useState("Entradas");

  /**
   * Agrega un producto al carrito.
   * Procesa las guarniciones seleccionadas y construye el objeto final.
   * @param {Object} producto - Producto a agregar (name, img).
   * @param {Array} data - Datos adicionales del producto (guarniciones, opciones, etc.).
   */
  const addToCart = (producto, data) => {
    setProductoNumero(prev => prev + 1);
    const obj = {
      numero: productoNumero,
      name: producto.name,
      img: producto.img
    };

    let guarnicionesSelected = [];
    let newData = [];

    // Separa guarniciones del resto de datos adicionales
    data.forEach(element => {
      if (element[1]) {
        if (element[0] === "guarnicion") {
          guarnicionesSelected = guarnicionesSelected.concat(element[1]);
        } else {
          newData.push(element);
        }
      }
    });

    // Agrupa todas las guarniciones en una sola entrada si existen
    if (guarnicionesSelected.length) {
      newData.push(["guarniciones", guarnicionesSelected]);
    }

    const arrayFinal = [obj, newData];

    setCarro(prev => [...prev, { ...arrayFinal }]);
  };

  /**
   * Elimina un producto del carrito.
   * Si el carrito queda vacío, oculta el panel del carrito.
   * @param {Object} item - Elemento a eliminar del carrito.
   */
  const removeFromCart = (item) => {
    setCarro(prev => {
      const nuevoCarro = prev.filter(data => data !== item);
      if (nuevoCarro.length === 0) {
        setEsCarroVisible(false);
      }
      return nuevoCarro;
    });
  };

  /** Vacía completamente el carrito y oculta el panel */
  const emptyCart = () => {
    setCarro([]);
    setEsCarroVisible(false);
  };

  /** Alterna la visibilidad del carrito (solo si tiene productos) */
  const showCart = () => {
    if (!carro.length) return;
    setEsCarroVisible(prev => !prev);
  };

  /** Funciones auxiliares para controles de cantidad (placeholder) */
  const funciones = {
    setVal: () => {},
    decrement: () => {},
    increment: () => {}
  };

  // Obtiene los productos de la categoría seleccionada eliminando espacios en el nombre
  const menuSelected = data[menu.replace(/\s/g, '')];

  return (
    <AppContainer>
      {/* Barra de navegación con controles del carrito */}
      <Navbar
        carro={carro}
        esCarroVisible={esCarroVisible}
        showCart={showCart}
        removeFromCart={removeFromCart}
        emptyCart={emptyCart}
      />
      {/* Menú de selección de categorías de platos */}
      <Menu
        options={data.tiposPlato}
        setMenu={setMenu}
      />
      {/* Sección principal de productos */}
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
  );
};

export default App;