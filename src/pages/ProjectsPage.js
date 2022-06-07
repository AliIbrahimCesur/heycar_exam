/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const ProjectsPage = (props) => {
  const [projects, setProjects] = useState(props.project);
  const [gateways, setGateway] = useState(props.gateway);
  const [filterprojects, setFilterProjects] = useState(props.filterProject); //get selected project name
  const [filtergateways, setFilterGateway] = useState(props.filterGateway); //get selected gateway name
  const [startDate, setStartDate] = useState(props.dateFrom); //get selected project name
  const [endDate, setEndDate] = useState(props.dateTo); //get selected gateway name
  const [dataArr, setDataArr] = useState([]); //for store all data

  const [showDetails, setShowDetails] = useState(0);

  const prId = () => {
    if (props.filterProject === "All Project") {
      return "";
    } else {
      return projects
        .filter((val) => val[0] === props.filterProject)[0][1]
        .toString();
    }
  };
  const gtId = () => {
    if (props.filterGateway === "All Gateways") {
      return "";
    } else {
      return gateways
        .filter((val) => val[0] === props.filterGateway)[0][1]
        .toString();
    }
  };
  const findProjectName = (id) => {
    let name = "";
    projects.forEach((value) => {
      if (value[1] === id) {
        name = value[0];
      }
    });
    return name;
  };
  const findGatewayName = (id) => {
    let name = "";
    gateways.forEach((value) => {
      if (value[1] === id) {
        name = value[0];
      }
    });
    return name;
  };
  const postBody = () => {
    return {
      from: props.dateFrom,
      to: props.dateTo,
      projectId: prId(),
      gatewayId: gtId(),
    };
  };

  const createChartData = (tempArray) => {
    let arr = [0, 0, 0, 0];
    if (
      props.filterProject !== "All Project" &&
      props.filterGateway === "All Gateways"
    ) {
      tempArray.forEach((value) =>
        findGatewayName(value[0]) === "Gateway 1"
          ? (arr[2] = parseInt(value[1].toFixed()))
          : findGatewayName(value[0]) === "Gateway 2"
          ? (arr[3] = parseInt(value[1].toFixed()))
          : null
      );
    } else if (
      props.filterProject === "All Project" &&
      props.filterGateway !== "All Gateways"
    ) {
      tempArray.forEach((value) =>
        findProjectName(value[0]) === "Project 1"
          ? (arr[0] = parseInt(value[1].toFixed()))
          : findProjectName(value[0]) === "Project 2"
          ? (arr[1] = parseInt(value[1].toFixed()))
          : null
      );
    }

    return {
      datasets: [
        {
          data: arr,
          backgroundColor: ["#A259FF", "#F24E1E", "#FFC107", "#6497B1"],
          borderColor: ["#A259FF", "#F24E1E", "#FFC107", "#6497B1"],
          borderWidth: 1,
          hoverOffset: 2,
          offset: 1,
        },
      ],
    };
  };

  const option = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return currentValue + " (" + percentage + "%)";
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  };
  useEffect(() => {
    setFilterProjects((old_value) => [...old_value, props.filterProject]);
    setFilterGateway((old_value) => [...old_value, props.filterGateway]);

    setStartDate((old_value) => [...old_value, props.dateFrom]);
    setEndDate((old_value) => [...old_value, props.dateTo]);
    setShowDetails(0);
    let isApiSubscribed = true;

    if (isApiSubscribed === true) {
      let _data = postBody();
      fetch("http://178.63.13.157:8090/mock-api/api/report", {
        method: "POST",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((json) => {
          setDataArr(json.data);
        });
    }
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filterProject, props.filterGateway, props.dateFrom, props.dateTo]);

  //fetch data from url by selections

  const arrayOfProjectObjects = projects.map((value) => {
    return { project: value[1], data: [], amount: [] };
  });
  const arrayOfGatewayObjects = gateways.map((value) => {
    return { gateway: value[1], data: [], amount: [] };
  });
  const dataResize = (arr) => {
    arrayOfProjectObjects.map(({ project, data, amount }) => {
      arr
        .filter((element) => element.projectId === project)
        .forEach((value) => {
          data.push(value);
          amount.push(value.amount);
        });
    });

    return arrayOfProjectObjects;
  };
  const dataResizeGateway = (arr) => {
    arrayOfGatewayObjects.map(({ gateway, data, amount }) => {
      arr
        .filter((element) => element.gatewayId === gateway)
        .forEach((value) => {
          data.push(value);
          amount.push(value.amount);
        });
    });

    return arrayOfGatewayObjects;
  };

  const gatewayFilter = (dataObj) => {
    return dataObj.map((value, index) => {
      return (
        <div className={index % 2 === 0 ? "detail-style" : "detail-style-2"}>
          <div className="date-style-2">
            {value.created.toString().replace(/-/g, "/")}
          </div>
          <div className="gateway-style-2">
            {value.gatewayId === "i6ssp" ? "Gateway 1" : "Gateway 2"}
          </div>
          <div className="userId-style-2">{value.paymentId.toString()}</div>
          <div className="amount-style-2">
            {value.amount.toFixed(0).toString()} USD
          </div>
        </div>
      );
    });
  };
  const gatewayFilterSingle = (dataObj) => {
    return dataObj.map((value, index) => {
      return (
        <div className={index % 2 === 0 ? "detail-style" : "detail-style-2"}>
          <div className="date-style">
            {value.created.toString().replace(/-/g, "/")}
          </div>
          <div className="userId-style">{value.paymentId.toString()}</div>
          <div className="amount-style">
            {value.amount.toFixed(0).toString()} USD
          </div>
        </div>
      );
    });
  };
  const gatewayFilterAll = (dataObj) => {
    return dataObj.map((value, index) => {
      return (
        <div>
          {index === 0 ? (
            <div className={"detail-style-3"}>
              <div className="date-style-3">Date</div>
              <div className="userId-style-3">Transaction ID</div>
              <div className="amount-style-3">Amount</div>
            </div>
          ) : null}
          <div
            className={index % 2 === 0 ? "detail-style-3-v2" : "detail-style-3"}
          >
            <div className="date-style-3">
              {value.created.toString().replace(/-/g, "/")}
            </div>
            <div className="userId-style-3">{value.paymentId.toString()}</div>
            <div className="amount-style-3">
              {value.amount.toFixed(0).toString()} USD
            </div>
          </div>
        </div>
      );
    });
  };
  const openDetail = (id) => {
    setShowDetails(id);
  };

  const projectFilterAll = (dataObj) => {
    return dataObj.map((value, index) => {
      return (
        <div>
          {index === 0 ? (
            <div className={"detail-style-3"}>
              <div className="date-style-3">Date</div>
              <div className="userId-style-3">Transaction ID</div>
              <div className="amount-style-3">Amount</div>
            </div>
          ) : null}
          <div
            className={index % 2 === 0 ? "detail-style-3-v2" : "detail-style-3"}
          >
            <div className="date-style-3">
              {value.created.toString().replace(/-/g, "/")}
            </div>
            <div className="userId-style-3">{value.paymentId.toString()}</div>
            <div className="amount-style-3">
              {value.amount.toFixed(0).toString()} USD
            </div>
          </div>
        </div>
      );
    });
  };
  const renderData = () => {
    let total = 0;
    if (
      props.filterProject === "All Project" &&
      props.filterGateway === "All Gateways"
    ) {
      let tempObject = dataResize(dataArr);
      return (
        <div>
          <div className="detail-main-full">
            <div className="mini-breadcrumb">
              {props.filterProject} | {props.filterGateway}
            </div>

            {tempObject.map((element, index, data) => {
              total += element.amount.reduce((a, b) => a + b, 0);
              return (
                <div className={index === 0 ? "full-header-main" : ""}>
                  <button
                    onClick={() => openDetail(index)}
                    className={"full-header"}
                  >
                    <div className="full-header-1">
                      {findProjectName(element.project)}
                    </div>

                    <div className="full-header-2">
                      Total:&ensp;
                      {element.amount
                        .reduce((a, b) => a + b, 0)
                        .toFixed(3)
                        .toString()
                        .replace(".", ",")}
                    </div>
                  </button>
                  {index === showDetails ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          <div>
                            {index === showDetails ? (
                              <div className={"detail-style-2"}>
                                <div className="date-style-2">Date</div>
                                <div className="gateway-style-2">Gateway</div>

                                <div className="userId-style-2">
                                  Transaction ID
                                </div>
                                <div className="amount-style-2">Amount</div>
                              </div>
                            ) : null}
                            {gatewayFilter(element.data)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="detail-total-full">
            <div className="detail-total-full-text">
              TOTAL | {total.toFixed(3).toString().replace(".", ",")} USD
            </div>
          </div>
        </div>
      );
    } else if (
      props.filterProject !== "All Project" &&
      props.filterGateway !== "All Gateways"
    ) {
      let total = 0;
      let firstItem = 0;
      let tempObject = dataResize(dataArr);
      return (
        <div>
          <div className="detail-main">
            <div className="mini-breadcrumb">
              {props.filterProject} | {props.filterGateway}
            </div>
            <div className="datail-big-down">
              <div className="detail-big">
                <div className="container-scroll">
                  <div className="box-scroll">
                    {tempObject.map((value, id, data) => {
                      total += value.amount.reduce((a, b) => a + b, 0);
                      if (value.data.length > 0) {
                        return (
                          <div>
                            {id === firstItem ? (
                              <div className={"detail-style-2"}>
                                <div className="date-style">Date</div>
                                <div className="userId-style">
                                  Transaction ID
                                </div>
                                <div className="amount-style">Amount</div>
                              </div>
                            ) : null}
                            {gatewayFilterSingle(value.data)}
                          </div>
                        );
                      } else {
                        firstItem = 1;
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-total">
            <div className="detail-total-text">
              TOTAL | {total.toFixed(3).toString().replace(".", ",")} USD
            </div>
          </div>
        </div>
      );
    } else if (
      props.filterProject !== "All Project" &&
      props.filterGateway === "All Gateways"
    ) {
      let total = 0;
      let arr_data = [];
      let tempObject = dataResizeGateway(dataArr);
      return (
        <div>
          <div className="detail-main-full-v3">
            <div className="mini-breadcrumb">
              {props.filterProject} | {props.filterGateway}
            </div>

            {tempObject.map((element, index) => {
              total += element.amount.reduce((a, b) => a + b, 0);
              arr_data.push([
                element.gateway,
                element.amount.reduce((a, b) => a + b, 0),
              ]);
              return (
                <div className={index === 0 ? "full-header-main-v3" : ""}>
                  <button
                    onClick={() => openDetail(index)}
                    className={"full-header-v3"}
                  >
                    <div className="full-header-1-v3">
                      {findGatewayName(element.gateway)}
                    </div>

                    <div className="full-header-2-v3">
                      Total:&ensp;
                      {element.amount
                        .reduce((a, b) => a + b, 0)
                        .toFixed(3)
                        .toString()
                        .replace(".", ",")}
                    </div>
                  </button>
                  {index === showDetails ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          <div>{gatewayFilterAll(element.data)}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="temptheme">
            <div className="right-part-1">
              <div className="mini-box-right-1-1">
                <div className="mini-box-right1"></div>
                <div>Stripe</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right2"></div>
                <div>Authorize.NET</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right3"></div>
                <div>Gateway 1</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right4"></div>
                <div>Gateway 2</div>
              </div>
            </div>
            <div className="right-part-2">
              <div className="doughnut-box">
                {
                  <Doughnut
                    data={createChartData(arr_data)}
                    title={true}
                    options={{
                      plugins: {
                        datalabels: {
                          color: "black",
                          formatter: function (value, context) {
                            let total = context.dataset.data.reduce(
                              (a, b) => a + b,
                              0
                            );
                            let title_ = (value / total) * 100;
                            title_ = title_.toFixed().toString() + "%";
                            if (value === 0) {
                              value = 90;
                              return "";
                            } else {
                              return title_;
                            }
                          },
                        },
                      },
                    }}
                  />
                }
              </div>
            </div>
            <div className="right-part-3">
              PROJECT TOTAL | {total.toFixed(3).toString().replace(".", ",")}{" "}
              USD
            </div>
          </div>
        </div>
      );
    } else if (
      props.filterProject === "All Project" &&
      props.filterGateway !== "All Gateways"
    ) {
      let tempObject = dataResize(dataArr);
      let arr_data = [];
      return (
        <div>
          <div className="detail-main-full-v3">
            <div className="mini-breadcrumb">
              {props.filterProject} | {props.filterGateway}
            </div>

            {tempObject.map((element, index) => {
              total += element.amount.reduce((a, b) => a + b, 0);
              arr_data.push([
                element.project,
                element.amount.reduce((a, b) => a + b, 0),
              ]);
              return (
                <div className={index === 0 ? "full-header-main-v3" : ""}>
                  <button
                    onClick={() => openDetail(index)}
                    className={"full-header-v3"}
                  >
                    <div className={"full-header-v3"}>
                      <div className="full-header-1-v3">
                        {findProjectName(element.project)}
                      </div>

                      <div className="full-header-2-v3">
                        Total:&ensp;
                        {element.amount
                          .reduce((a, b) => a + b, 0)
                          .toFixed(3)
                          .toString()
                          .replace(".", ",")}
                      </div>
                    </div>
                  </button>

                  {index === showDetails ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          {projectFilterAll(element.data)}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="temptheme">
            <div className="right-part-1">
              <div className="mini-box-right-1-1">
                <div className="mini-box-right1"></div>
                <div className="mini-box-rightAll-text">Project 1</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right2"></div>
                <div className="mini-box-rightAll-text">Project 2</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right3"></div>
                <div className="mini-box-rightAll-text">Project 3</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right4"></div>
                <div className="mini-box-rightAll-text">Project 4</div>
              </div>
            </div>
            <div className="right-part-2">
              <div className="doughnut-box">
                <Doughnut
                  data={createChartData(arr_data)}
                  title={true}
                  options={{
                    plugins: {
                      datalabels: {
                        color: "black",
                        formatter: function (value, context) {
                          let total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          let title_ = (value / total) * 100;
                          title_ = title_.toFixed().toString() + "%";
                          if (value === 0) {
                            value = 90;
                            return "";
                          } else {
                            return title_;
                          }
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="right-part-3">PROJECT TOTAL | 14,065 USD</div>
          </div>
        </div>
      );
    } else {
      return <div>No Data</div>;
    }
  };
  return <div>{renderData()}</div>;
};

export default ProjectsPage;
