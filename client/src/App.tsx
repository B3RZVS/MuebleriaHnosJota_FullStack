import { Route, Routes } from "react-router-dom";
import { ProductoDetails } from "./views/ProductoDetails/ProductoDetails.tsx";
import { ProductosView } from "./views/ProductosView/ProductosView.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductosView />} />

      <Route path="/productos/:id" element={<ProductoDetails />} />
    </Routes>
  );
}

export default App;
