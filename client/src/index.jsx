//imports APP
//renders APP to DOM
import React from 'react';
import App from './components/App.jsx';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx'



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* <App /> */}
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
, document.getElementById("app"));

// const root = ReactDOM.createRoot(document.getElementById("app"));
// console.log(root);
// root.render(<App />);