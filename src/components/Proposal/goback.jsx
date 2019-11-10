import React from "react";
import goBackImage from "../../assets/img/go_back.svg";

import { useHistory } from "react-router-dom";

export default function Goback() {
  const history = useHistory();

  function handleClick() {
    history.goBack();
  }

  return (
    <div className="goback" onClick={handleClick}>
      <img src={goBackImage} alt="go back" />
      <span>Go back</span>
    </div>
  );
}
