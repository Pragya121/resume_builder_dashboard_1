import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from './components/Navbar';
import Footer from './components/Footer';


ReactDOM.render(  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
   
    {/* <Route path="newTasks" element={<NewTasks />} /> */}
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <Navbar/>
          <p>There's nothing here!</p>
         
        </main>
      }
    />
  </Routes>
</BrowserRouter>, document.getElementById('root'));
