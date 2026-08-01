import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeParts from "./pages/BikeParts";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import SellerOrders from "./pages/SellerOrders";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";
import NotFound from "./pages/NotFound";
import SellerProfile from "./pages/SellerProfile";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import EditProduct from "./pages/EditProduct";
import Events from "./pages/Events";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/bikes" element={<Bikes />} />

          <Route
            path="/bike-parts"
            element={<BikeParts />}
          />

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/product/:id"
            element={<Product />}
          />

          <Route
           path="/events"
           element={<Events />}
          />

          <Route
            path="/edit-product/:id"
            element={<EditProduct />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          <Route
            path="/chat/:id"
            element={<Chat />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/seller-orders"
            element={<SellerOrders />}
          />

          <Route
            path="/sell"
            element={<Sell />}
          />

          <Route
            path="/my-listings"
            element={<MyListings />}
          />

          <Route
            path="/seller/:sellerId"
            element={<SellerProfile />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

        </Route>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;