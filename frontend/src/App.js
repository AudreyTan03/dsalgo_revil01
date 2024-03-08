import React from "react";
// import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import "./bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Productscreen from "./Screens/ProductScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import CartScreen from "./Screens/CartScreen";
import ProductHome from "./Screens/ProductHomeScreen";
// import { SignIn } from "./Screens/SignIn";
import Home from "./Screens/HomeScreen";
import RequestChangePass from "./Screens/RequestChangepass";
import ConfirmChangePass from "./Screens/ConfirmChangepass";
import UploadProduct from "./Screens/UploadScreen"

// need mag kakasunod amp

function App() {
  return (
    <Router>
      {/* <Header /> */}
        <Navbar />
        <Container>
          <Routes>
            <Route path='/HeroSection' element={<HeroSection />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path= '/cart' element={<CartScreen/>}/>
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/request-changepass' element={<RequestChangePass />} />
            <Route path='/confirm-changepass/:uid/:token' element={<ConfirmChangePass />} />
            <Route path = "/products" element={<ProductHome />} exact />
            <Route path = "/product/:id" element= {<Productscreen />} />
            <Route path = "/upload" element= {<UploadProduct />} />

            {/* <Route path='/sign-in' element={<SignIn />} /> */}
            <Route path='/' element={<Home />} />


          </Routes>
        </Container>
      {/* <Footer/> */}
    </Router>
  );
}

export default App;