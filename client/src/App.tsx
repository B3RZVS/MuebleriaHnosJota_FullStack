import { Route, Routes } from "react-router-dom";
import { ProductoDetails } from "./views/ProductoDetails/ProductoDetails.tsx";
import { ProductosView } from "./views/ProductosView/ProductosView.tsx";
import ContactForm from "./components/ContactForm/ContactForm.tsx";
import HomeView from "./views/HomeView/HomeView.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/productos" element={<ProductosView />} />
      <Route path="/productos/:id" element={<ProductoDetails />} />
      <Route path="/contacto" element={<ContactForm />} />
    </Routes>
  );
}

export default App;
