import React from 'react';
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="App">
       <nav className='header'>
          <span className='title'>
            NBA Guessing Game
          </span>
        </nav>
       <div className="subtitle container">
         <div>All you have to do is guess the player!</div>
       </div>
      <Outlet />
    </div>
  )
}

export default Dashboard;