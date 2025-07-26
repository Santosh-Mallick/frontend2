import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; // Assuming Home.jsx is in the same directory
import ProductList from './pages/Home/Items'; // Assuming ProductList.jsx is in the same directory

const App = () => {
  return (
    
    <Router>
      
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />

      </Routes>
    </Router>
  );
};

export default App;
