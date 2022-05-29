import './App.css';
import Header from "./components/layout/Header/Header.js"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebFont from "webfontloader"
import React, { useEffect, useState } from 'react';
import Footer from './components/layout/footer/Footer';
import Home from "./components/Home/Home.js"
import ProductDetails from "./components/Product/ProductDetails.js"
import Products from "./components/Product/Products.js"
import LoginSignup from './components/User/LoginSignup';
import UserOptions from "./components/layout/Header/UserOptions.js"
import store from "./store"
import { loadUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import Profile from "./components/User/Profile.js"
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import axios from 'axios';
import ProceedToPayment from './components/cart/ProceedToPayment';
import OrderSuccess from './components/cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProtectedRoutes from './components/routes/ProtectedRoutes';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import UpdateOrder from './components/Admin/UpdateOrder';
import UsersList from './components/Admin/UsersList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
import About from './components/layout/About/About';
import Contact from './components/layout/contact/Contact';



function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("")

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeApiKey")
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {

    WebFont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"]
      }
    })

    getStripeApiKey()

    store.dispatch(loadUser())  //if the user is already logged in then we will loadUser as soon an the page loads 
  }, [])

  window.addEventListener("contextmenu", e => e.preventDefault())

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home name="MyWEB" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />


        <Route path="/login" element={<LoginSignup />} />
        <Route path="/account" element={
          <ProtectedRoutes ele={<Profile />} />
        } />
        <Route path="/me/update" element={
          <ProtectedRoutes ele={<UpdateProfile />} />
        } />
        <Route path="/password/update" element={
          <ProtectedRoutes ele={<UpdatePassword />} />
        } />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />


        <Route path="/cart" element={<Cart />} />
        <Route path='/shipping' element={
          <ProtectedRoutes ele={<Shipping />} />
        } />
        <Route path='/order/confirm' element={
          <ProtectedRoutes ele={<ConfirmOrder />} />
        } />
        <Route path='/process/payment' element={
          <ProtectedRoutes ele={<ProceedToPayment stripeApiKey={stripeApiKey} />} />}
        />
        <Route path='/success' element={
          <ProtectedRoutes ele={<OrderSuccess />} />
        } />


        <Route path='/orders' element={
          <ProtectedRoutes ele={<MyOrders />} />
        } />
        <Route path='/order/:id' element={
          <ProtectedRoutes ele={<OrderDetails />} />
        } />


        <Route path='/admin/dashboard' element={
          <ProtectedRoutes isAdmin={true} ele={<Dashboard />} />
        } />
        <Route path='/admin/products' element={
          <ProtectedRoutes isAdmin={true} ele={<ProductList />} />
        } />
        <Route path='/admin/product/new' element={
          <ProtectedRoutes isAdmin={true} ele={<NewProduct />} />
        } />
        <Route path='/admin/product/:id' element={
          <ProtectedRoutes isAdmin={true} ele={<UpdateProduct />} />
        } />

        <Route path='/admin/orders' element={
          <ProtectedRoutes isAdmin={true} ele={<OrderList />} />
        } />
        <Route path='/admin/order/:id' element={
          <ProtectedRoutes isAdmin={true} ele={<UpdateOrder />} />
        } />

        <Route path='/admin/users' element={
          <ProtectedRoutes isAdmin={true} ele={<UsersList />} />
        } />
        <Route path='/admin/user/:id' element={
          <ProtectedRoutes isAdmin={true} ele={<UpdateUser />} />
        } />

        <Route path='/admin/reviews' element={
          <ProtectedRoutes isAdmin={true} ele={<ProductReviews />} />
        } />
        <Route path='/admin/review/:id' element={
          <ProtectedRoutes isAdmin={true} ele={<UpdateUser />} />
        } />


        <Route path='*' element={
          <div style={{ display: "grid", placeContent: "center", minHeight: "100vh", textAlign: "center" }}>
            <h1 style={{ color: "grey", fontSize: "7vmax" }}> 404</h1>
            <h4 style={{ color: "black", fontSize: "3vmax" }}> Page Not Found</h4>
          </div>
        } />
      </Routes>

      <Footer name="Md Asad Azam" />
    </Router>
  )
}

export default App;
