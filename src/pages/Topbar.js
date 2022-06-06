import React from "react";
import filter from "../../src/Assets/icons/filter.png";
import bbrand from "../../src/Assets/icons/bbrand.png";

const Topbar = () => {
  return (
    <div>
      <div className="navbar-filter">
        <img src={filter} alt="logo" />
      </div>
      <div className="navbar-brand">
        <img src={bbrand} alt="logo" />
      </div>
      <div className="Jd-style">JD</div>

      <div className="Jd-text-long">John Doe</div>
      <div className="navbar-line"></div>
    </div>
  );
};

export default Topbar;
