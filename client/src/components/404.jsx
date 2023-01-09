import React from 'react';
import { useNavigate } from "react-router-dom";

const FourOFour = () => {
  const navigate = useNavigate();
  const returnPage = () => navigate(-1);

  return (
    <div>
      <h2>Unauthorized</h2><br/>

      <p>You do not have access to this page.</p>
      <button onClick={returnPage}>Return</button>
    </div>
  )
}

export default FourOFour;