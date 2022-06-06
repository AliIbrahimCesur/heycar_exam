import React from "react";
import noInfo_img from "../../src/Assets/icons/noinfo_img.png";
import noInfo_in from "../../src/Assets/icons/noinfo_in.png";

const NoReport = () => {
  return (
    <div>
      <div>
        <div className="noReport-text">No reports</div>
        <div className="noReport-sub-text">
          Currently you have no data for the reports to be generated. Once you
          start generating traffic through the Balance application the reports
          will be shown.
        </div>
      </div>
      <div>
        <img src={noInfo_img} alt="logo" className="noReport-img" />
        <img src={noInfo_in} alt="logo" className="noReport-in" />
      </div>
    </div>
  );
};

export default NoReport;
