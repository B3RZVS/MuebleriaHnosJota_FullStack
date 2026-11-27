import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProductoDetails } from './views/ProductoDetails/ProductoDetails.tsx';
import { ProductosView } from './views/ProductosView/ProductosView.tsx';
import ContactForm from './components/ContactForm/ContactForm.tsx';
import ProductoCreate from './components/ProductoCreate/ProductoCreate.tsx';
import { ProductoEdit } from './views/ProductoEdit/ProductoEdit.tsx';
import HomeView from './views/HomeView/HomeView.tsx';
import { NotFoundView } from './views/NotFoundView/NotFoundView.tsx';
import RegistroView from './views/RegistroView/RegistroView.tsx';
import LoginView from './views/LoginView/LoginView.tsx';
import { PerfilView } from './views/PerfilView/PerfilView.tsx';
import { MisPedidosView } from './views/MisPedidosView/MisPedidosView.tsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import CartModal from './cart/components/CartModal.tsx';
import { useCart } from './cart/context/useCart.ts';

function App() {
  const { carrito } = useCart();
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <>
      <Navbar
        cantidadCarrito={carrito.totalItems}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />
      {/* Un solo <main> para todas las páginas: cada vista va adentro */}
      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/productos" element={<ProductosView />} />
          <Route path="/productos/:id" element={<ProductoDetails />} />
          <Route
            path="/admin/crear-producto"
            element={
              <ProtectedRoute soloAdmin>
                <ProductoCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editar-producto/:id"
            element={
              <ProtectedRoute soloAdmin>
                <ProductoEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/registro" element={<RegistroView />} />
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute>
                <MisPedidosView />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
      <CartModal
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />
      <Footer />
    </>
  );
}

export default App;
