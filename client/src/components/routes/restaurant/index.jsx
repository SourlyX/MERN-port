/**
 * Archivo principal de entrada (index.jsx).
 * Configura el renderizado de la aplicación React dentro del DOM,
 * envolviendo el componente principal (App) con React.StrictMode
 * y el enrutador de React Router (BrowserRouter).
 */

import React from 'react'; // Se mantiene porque se usa React.StrictMode
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**
 * Renderizado principal de la aplicación.
 * - React.StrictMode: activa verificaciones y advertencias adicionales en desarrollo.
 * - BrowserRouter: proveedor de enrutamiento basado en el historial del navegador.
 * - Routes / Route: define la ruta "/carrito_de_compras" que renderiza el componente App.
 */
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principal que renderiza el componente App */}
        <Route path="/carrito_de_compras" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

/**
 * reportWebVitals: función opcional para medir y reportar
 * métricas de rendimiento de la aplicación (CLS, FID, FCP, LCP, TTFB).
 */
reportWebVitals();