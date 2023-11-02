import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./pages";
import { Login } from "./pages/Login";
import { Layout } from "./Layout";
import { Register } from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import { Accont } from "./pages/Accont";
import { Places } from "./pages/Places";
import { PlacesFormPage } from "./pages/PlacesFormPage";
import { PlacePage } from "./pages/placePage";
import { BookingsPage } from "./pages/BookingsPage";
import { BookingPage } from "./pages/BookingPage";

axios.defaults.baseURL = "http://127.0.0.1:4000";
axios.defaults.withCredentials = true;
function App() {
  
  return (
    <>
      <UserContextProvider>

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/account" element={<Accont/>}></Route>
            <Route path="/account/places" element={<Places/>}></Route>
            <Route path="/account/places/new" element={<PlacesFormPage/>}></Route>
            <Route path="/account/places/:id" element={<PlacesFormPage/>}></Route>
            <Route path="/place/:id" element={<PlacePage/>}></Route>
            <Route path="/account/bookings/:id" element={<BookingPage/>}></Route>
            <Route path="/account/bookings" element={<BookingsPage/>}></Route>
          






          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
