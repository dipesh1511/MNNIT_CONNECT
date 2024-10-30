import { useState } from 'react'
import React from 'react'
import {BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import DashBoard from './pages/DashBoard'
import Battle from './pages/Battle'
import Header from './components/Header'
function App() {

  return (
    <>
      <BrowserRouter >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about"
        element={<About />} />
        <Route path="/sign-in" 
        element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/battle"
        element={<Battle />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
