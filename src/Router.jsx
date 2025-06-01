import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/";
import { Signin } from "./Pages/Auth/";
import { Signup } from "./Pages/Auth/";
import Cart from "./Pages/Cart/";
import Orders from "./Pages/Orders/";
import Payment from "./Pages/Payment/";
import ProductDetail from "./Pages/ProductDetail";
import Results from "./Pages/Results/";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
