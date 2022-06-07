/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useCallback } from "react";
import layer7 from "../../src/Assets/icons/Layer7.png";
import layer3 from "../../src/Assets/icons/Layer3.png";
import layer8 from "../../src/Assets/icons/Layer8.png";
import layer1 from "../../src/Assets/icons/Layer1.png";
import layer6 from "../../src/Assets/icons/Layer6.png";
import arrow from "../../src/Assets/icons/arrow.png";
import calendar from "../../src/Assets/icons/calendar.png";
import "react-datepicker/dist/react-datepicker.css";
import NoReport from "./NoReport";
import ProjectsPage from "./ProjectsPage";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const MainPage = () => {
  const [projects, setProjects] = useState([]); //store projects info
  const [gateways, setGateways] = useState([]); //store gateway info
  const [usersInfo, setUsersInfo] = useState([]); //store usersInfo infoapi

  const [shownProjectName, setShowProject] = useState("Select Project");
  const [shownGatewayName, setGateway] = useState("Select Gateway");
  const [clickedGenerate, setClickedGenerate] = useState(1);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showCalendarFrom, setShowCalendarFrom] = useState(false);
  const [showCalendarTo, setShowCalendarTo] = useState(false);
  const [fromDateName, setFromDateName] = useState("From date");
  const [toDateName, setToDateName] = useState("To date");

  //filters section
  const listViewProjects = () => {
    if (projects.length > 0) {
      return (
        <div className="dropdown-content">
          <a
            href="#allProject"
            onClick={() => {
              setShowProject("All Project");
            }}
            className="a-types-drop"
          >
            All projects
          </a>
          {projects.map((value, id) => {
            return (
              <a
                href="#values"
                key={value + id.toString()}
                onClick={() => {
                  setShowProject(value[0]);
                }}
                className="a-types-drop"
              >
                {value[0]}
              </a>
            );
          })}
        </div>
      );
    }
  };
  const listViewGateways = () => {
    return (
      <div className="dropdown-content-2">
        <a
          href="#allProject"
          onClick={() => {
            setGateway("All Gateways");
          }}
          className="a-types-drop"
        >
          All Gateways
        </a>
        {gateways.map((value, id) => {
          return (
            <a
              href="#values"
              key={value + id.toString()}
              onClick={() => {
                setGateway(value[0]);
              }}
              className="a-types-drop"
            >
              {value[0]}
            </a>
          );
        })}
      </div>
    );
  };

  const startDateSelection = () => {
    setShowCalendarFrom(!showCalendarFrom);
    setShowCalendarTo(false);
  };
  const endDateSelection = () => {
    setShowCalendarTo(!showCalendarTo);
    setShowCalendarFrom(false);
  };

  const handleDateChangeFrom = (selectedDate) => {
    setStartDate(selectedDate);
    setShowCalendarFrom(!showCalendarFrom);
    setFromDateName(nameParser(selectedDate));
  };
  const handleDateChangeTo = (selectedDate) => {
    setEndDate(selectedDate);
    setShowCalendarTo(!showCalendarTo);
    setToDateName(nameParser(selectedDate));
  };

  const nameParser = (name) => {
    return (
      name.getFullYear().toString() +
      "-" +
      (name.getMonth() + 1).toString() +
      "-" +
      name.getDate().toString()
    );
  };
  //render when only clicked to generate button
  const renderProjectDetail = useCallback(() => {
    if (
      shownProjectName !== "Select Project" &&
      shownGatewayName !== "Select Gateway"
    ) {
      return (
        <ProjectsPage
          project={projects}
          gateway={gateways}
          users={usersInfo}
          dateFrom={
            fromDateName === "From date" ? "2021-01-01" : nameParser(startDate)
          }
          dateTo={toDateName === "To date" ? "2021-12-31" : nameParser(endDate)}
          filterProject={shownProjectName}
          filterGateway={shownGatewayName}
          clicked={clickedGenerate}
        />
      );
    } else {
      return <NoReport />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedGenerate]);

  //get projects && gateway info from api
  const getAllData = () => {
    fetch("http://178.63.13.157:8090/mock-api/api/projects")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          setProjects((prevValue) => [
            ...prevValue,
            [value.name, value.projectId],
          ]);
        });
      });

    fetch("http://178.63.13.157:8090/mock-api/api/gateways")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          setGateways((prevValue) => [
            ...prevValue,
            [value.name, value.gatewayId],
          ]);
        });
      });

    fetch("http://178.63.13.157:8090/mock-api/api/users")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          setUsersInfo((prevValue) => [
            ...prevValue,
            [value.email, value.firstName, value.lastName, value.userId],
          ]);
        });
      });
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div className="main-page ">
      <div className="left-side">
        <div className="left-icon1">
          <img src={layer7} alt="logo" />
        </div>
        <div className="left-icon2">
          <img src={layer3} alt="logo" />
        </div>
        <div className="left-icon3">
          <img src={layer8} alt="logo" />
        </div>
        <div className="left-icon4">
          <img src={layer1} alt="logo" />
        </div>
        <div className="left-icon5">
          <img src={layer6} alt="logo" />
        </div>
      </div>
      <div className="right-side">
        <div className="right-top ">
          <div className="right-report">
            <div>Reports</div>
          </div>
          <div className="right-report-sub">
            <p>Easily generate a report of your transactions</p>
          </div>
          <div className="text-styles-buttons">
            <div className="dropdown">
              <button className="right-button1" onClick={() => {}}>
                {shownProjectName}
                <img src={arrow} className="img-in-buttons" />
              </button>
              {listViewProjects()}
            </div>
            <div className="dropdown-2">
              <button className="right-button2" onClick={() => {}}>
                {shownGatewayName}
                <img src={arrow} className="img-in-buttons" />
              </button>
              {listViewGateways()}
            </div>
            <button className="right-button3" onClick={startDateSelection}>
              {fromDateName} <img src={calendar} className="img-in-buttons" />
            </button>
            <button className="right-button4" onClick={endDateSelection}>
              {toDateName} <img src={calendar} className="img-in-buttons" />
            </button>
            <button
              className="right-button5"
              onClick={() => {
                setClickedGenerate(clickedGenerate + 1);
                //setShowNoData(showNoData + 1);
              }}
            >
              Generate report
            </button>
          </div>
        </div>
        {showCalendarFrom ? (
          <div className="calendarStyle">
            <Calendar
              value={startDate}
              onChange={handleDateChangeFrom}
              className="calendarOpacity"
            />
          </div>
        ) : showCalendarTo ? (
          <div className="calendarStyleTo">
            <Calendar
              value={endDate}
              onChange={handleDateChangeTo}
              className="calendarOpacity"
            />
          </div>
        ) : null}
        {renderProjectDetail()}
      </div>
      <div className="terms-style">
        Terms&Conditions | Privacy policy Typography
      </div>
    </div>
  );
};

export default MainPage;
