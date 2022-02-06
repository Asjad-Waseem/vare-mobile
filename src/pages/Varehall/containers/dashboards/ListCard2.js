/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import React, {useState, useEffect, useRef, Fragment} from "react";
import {useTable, usePagination, useSortBy} from "react-table";
import {Card, CardBody, CardTitle, Progress, FormGroup} from "reactstrap"; //
import DatatablePagination from "../../mycomponents/DatatablePagination";
// import IntlMessages from "../../helpers/IntlMessages";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import Doughnut from "../../mycomponents/charts/Doughnut";
import {CircularProgressbar} from "react-circular-progressbar";
import moment from "moment";
import DemographyList from "../../containers/dashboards/DemographyList";
import "./select.css";

import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";

import products from "../../data/products";

const doughnutChartData = {
  labels: ["Support", "Reject", "No Vote"],
  datasets: [
    {
      label: "",
      color: ["white", "white", "white"],
      borderColor: ["gray", "gray", "gray"],
      backgroundColor: ["green", "#FA8072", "#2096F3"],
      borderWidth: 2,
      data: [20, 30, 30]
    }
  ]
};

function Table({columns, data, setDemographyData}) {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: {pageIndex, pageSize}
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 6}
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} className="r-table table">
        <thead>
          {headerGroups.map((headerGroup, id) => (
            <tr key={"aassszzz" + id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`th_${columnIndex}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sorted-desc"
                        : "sorted-asc"
                      : ""
                  }
                >
                  {column.render("Header")}
                  <span />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, tt) => {
            prepareRow(row);
            return (
              <tr key={"sdxmdmd" + tt} {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`td_${cellIndex}`}
                    {...cell.getCellProps({
                      className: cell.column.cellClass
                    })}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <DatatablePagination
        page={pageIndex}
        pages={pageCount}
        canPrevious={canPreviousPage}
        canNext={canNextPage}
        pageSizeOptions={[4, 10, 20, 30, 40, 50]}
        showPageSizeOptions={false}
        showPageJump={false}
        defaultPageSize={pageSize}
        onPageChange={p => gotoPage(p)}
        onPageSizeChange={s => setPageSize(s)}
        paginationMaxSize={pageCount}
      />
    </>
  );
}

function TableCard({
  columns,
  data,
  setDemographyData,
  bgColor,
  period,
  // selectedOptions,
  avgVoterBillDemography
}) {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: {pageIndex, pageSize}
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 6}
    },
    useSortBy,
    usePagination
  );

  const tableCardColumns = {
    date: "Date",
    bill_id: "Bill Id",
    vote: "Your Vote",
    reactions: "Reactions",
    messages: "Messages",
    followers: "Followers",
    description: "Description",
    support: "Support"
  };
  const [sortedBuildData, setSortedBuildData] = useState([]);
  const [groupByData, setGroupByData] = useState(null);

  const [selectedPartyOptions, setPartyOptions] = useState([]);
  const [listIndex, setListIndex] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [viewLevel, setViewLevel] = useState(null);
  const bgColorObject = bgColor ? {backgroundColor: bgColor} : {};

  useEffect(() => {
    // console.log("yyy", data);
    const dateSetByPeriod = data; //&& period && data[period];
    const dataNewArray = {};
    const buildData = {};
    dateSetByPeriod &&
      dateSetByPeriod.length > 0 &&
      dateSetByPeriod.map(res => {
        // console.log("yyy22res", res);
        res["demography"] &&
          Object.keys(res["demography"]).map(rep => {
            // console.log("yyy22rep", rep);

            if (rep == "age") {
              buildData["age"] = Object.keys(res["demography"][rep]).map(
                info => {
                  return {
                    title: info,
                    total: 100,
                    status: res["demography"][rep][info]
                  };
                }
              );
            } else if (rep == "race") {
              buildData["race"] = Object.keys(res["demography"][rep]).map(
                info => {
                  return {
                    title: info,
                    total: 100,
                    status: res["demography"][rep][info]
                  };
                }
              );
            } else if (rep == "party") {
              buildData["party"] = Object.keys(res["demography"][rep]).map(
                info => {
                  return {
                    title: info,
                    total: 100,
                    status: res["demography"][rep][info]
                  };
                }
              );
            }
          });
      });
    if (
      selectedOptions &&
      selectedOptions.value &&
      buildData[selectedOptions.value] &&
      selectedOptions.value != "na"
    ) {
      setSortedBuildData(buildData);
      // setAvgVoterBillDemography(buildData[selectedOptions.value]);
      // console.log("yyy22", buildData, selectedOptions);
    } else {
      setSortedBuildData([]);
      //setAvgVoterBillDemography(buildData["race"]);
    }
  }, [selectedOptions, period]);

  return (
    <>
      <div>
        <div
          lg={12}
          sm={12}
          className="row"
          // className={"card"}
          style={{
            // ...bgColorObject,
            color: "gray"
            // padding: -20
          }}
        >
          {data.map((info, i) => {
            // console.log("xxcc", selectedOptions);
            return (
              <Fragment key={"ghghnbvb" + i}>
                <Colxx
                  key={"sdsdbvsxddd" + i}
                  lg={4}
                  sm={12}
                  style={{
                    padding: 10
                    // minHeight: 300,
                    // borderColor: "gray"
                    // backgroundColor: "red"
                  }}
                  className={"card"}
                >
                  {bgColor ? (
                    <span
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "#2096F3",
                        paddingLeft: 10
                      }}
                    >
                      Summary
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "#2096F3",
                        paddingLeft: 10
                      }}
                    >
                      Bill: {info["bill_id"]}
                    </span>
                  )}
                  {Object.keys(tableCardColumns).map((res, index) => {
                    if (
                      bgColor &&
                      (res == "bill_id" ||
                        res == "vote" ||
                        res == "description")
                    ) {
                      return;
                    }
                    if (res == "bill_id") {
                      return;
                    }
                    if (res == "support") {
                      return (
                        <div
                          key={"ssddxxpxx" + index}
                          className="glide__slide--active"
                        >
                          <FormGroup>
                            <Colxx
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingTop: 30,
                                display: "flex",
                                flexDirection: "row",
                                width: "100%"
                              }}
                              sm={12}
                              lg={12}
                            >
                              <Colxx style={{width: "100%"}} sm={12} lg={12}>
                                <Select
                                  style={{
                                    backgroundColor: "red",
                                    top: "auto",
                                    bottom: "100%"
                                  }}
                                  className={"react-select my-cool-select-top"}
                                  components={{Input: CustomSelectInput}}
                                  // className="react-select"
                                  classNamePrefix="react-select"
                                  name="form-field-name"
                                  placeholder={"Filter by Demography"}
                                  value={
                                    selectedOptions.listIndex == i
                                      ? selectedPartyOptions
                                      : []
                                  }
                                  onChange={val => {
                                    setPartyOptions(val);
                                    setSelectedOptions({
                                      value: val.value,
                                      listIndex: i
                                    });
                                  }}
                                  options={[
                                    {label: "None", value: "na", key: 0},
                                    {label: "Party", value: "party", key: 0},
                                    {label: "Age", value: "age", key: 1},
                                    {label: "Race", value: "race", key: 1}
                                  ]}
                                />
                              </Colxx>
                            </Colxx>
                          </FormGroup>
                          {selectedOptions &&
                          selectedOptions.value &&
                          selectedOptions.listIndex == i ? (
                            <Colxx
                              key={"sdsdbvsxddd" + i}
                              lg={12}
                              sm={12}
                              style={{
                                padding: 10
                                // minHeight: 300,
                                // borderColor: "gray"
                                // backgroundColor: "red"
                              }}
                              // className={"card"}
                            >
                              <DemographyList
                                avgVoterBillDemography={
                                  sortedBuildData[selectedOptions.value]
                                }
                                selectedOptions={selectedOptions}
                                // selectedPartyOptions={selectedPartyOptions}
                                // selectedRaceOptions={selectedRaceOptions}
                                // selectedAgeOptions={selectedAgeOptions}
                                title={"Demography"}
                                subTitle={""}
                                backMenu={() => {
                                  setSelectedOptions(null);
                                  // setViewLevel("bills");
                                  // setDemographyData("party");
                                }}
                                cardClass="dashboard-progress"
                              />
                            </Colxx>
                          ) : null}
                          <div
                            style={{
                              position: "absolute",
                              top: 46,
                              right: 60,
                              height: 70,
                              width: 70
                              // color: "#922c88"
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                paddingLeft: 15,
                                top: 15,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                                // color: "#922c88"
                              }}
                            >
                              <div style={{color: "black"}}>{info[res]}% </div>
                              <div style={{fontSize: 11, color: "black"}}>
                                Support
                              </div>
                            </div>
                            <CircularProgressbar
                              value={info[res]}
                              text={``}
                              styles={{
                                // Customize the root svg element
                                root: {},
                                // Customize the path, i.e. the "completed progress"
                                path: {
                                  // Path color
                                  stroke: `#2096F3`,
                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                  strokeLinecap: "butt",
                                  // Customize transition animation
                                  transition: "stroke-dashoffset 0.5s ease 0s",
                                  // Rotate the path
                                  transform: "rotate(0.25turn)",
                                  transformOrigin: "center center"
                                },

                                // Customize the circle behind the path, i.e. the "total progress"
                                trail: {
                                  // Trail color
                                  stroke: "red",
                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                  strokeLinecap: "butt",
                                  // Rotate the trail
                                  transform: "rotate(0.25turn)",
                                  transformOrigin: "center center"
                                },
                                // Customize the text
                                text: {
                                  // Text color
                                  fill: "#f88",
                                  // Text size
                                  fontSize: "16px"
                                },
                                // Customize background - only used when the `background` prop is true
                                background: {
                                  fill: "#3e98c7"
                                }
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                left: -12,
                                width: 120,
                                paddingTop: 5,
                                flexDirection: "row",
                                fontSize: 12,
                                flexDirection: "row"
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontWeight: "bold",
                                  fontSize: 10
                                }}
                              >
                                <i
                                  style={{
                                    color: "#2096F3"
                                  }}
                                  className={"fas fa-square"}
                                />
                                {" Support "}
                              </span>
                              <span
                                style={{
                                  color: "black",
                                  fontWeight: "bold",
                                  fontSize: 10
                                }}
                              >
                                <i
                                  style={{marginLeft: 10, color: "red"}}
                                  className={"fas fa-square"}
                                />
                                {" Reject "}
                              </span>
                            </div>
                          </div>
                          {/*<Progress value={(info[res] / 100) * 100} />*/}
                        </div>
                      );
                    } else if (res == "followers") {
                      return (
                        <div
                          className="glide__slide--active"
                          key={"sdsdxddd" + index}
                        >
                          <span
                            style={{
                              fontWeight: "bold"
                            }}
                          >
                            {tableCardColumns[res]}:
                          </span>{" "}
                          <span
                            style={{
                              paddingLeft: 20,
                              paddingRight: 20
                            }}
                            className="badge badge-primary badge-pill"
                          >
                            {info[res]}
                          </span>
                        </div>
                      );
                    } else if (res == "messages") {
                      return (
                        <div
                          className="glide__slide--active"
                          key={"sdsdxddd" + index}
                        >
                          <span
                            style={{
                              fontWeight: "bold"
                            }}
                          >
                            {tableCardColumns[res]}:
                          </span>{" "}
                          <span
                            style={{
                              paddingLeft: 20,
                              paddingRight: 20
                            }}
                            className="badge badge-primary badge-pill"
                          >
                            {info[res]}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="glide__slide--active"
                          key={"sdsdxddd" + index}
                        >
                          <span
                            style={{
                              fontWeight: "bold"
                            }}
                          >
                            {tableCardColumns[res]}:
                          </span>{" "}
                          {info[res]}
                        </div>
                      );
                    }
                  })}
                </Colxx>
              </Fragment>
            );
          })}
        </div>
      </div>

      {!bgColor ? (
        <DatatablePagination
          page={pageIndex}
          pages={pageCount}
          canPrevious={canPreviousPage}
          canNext={canNextPage}
          pageSizeOptions={[4, 10, 20, 30, 40, 50]}
          showPageSizeOptions={false}
          showPageJump={false}
          defaultPageSize={pageSize}
          onPageChange={p => gotoPage(p)}
          onPageSizeChange={s => setPageSize(s)}
          paginationMaxSize={pageCount}
        />
      ) : null}
    </>
  );
}

const ListCard = ({
  reports,
  backMenu,
  setDemographyData,
  period,
  title,
  // selectedOptions,
  avgVoterBillDemography
}) => {
  const cols = React.useMemo(
    () => [
      {
        Header: "Bill ID",
        accessor: "bill_id",
        cellClass: "text-muted w-25",
        Cell: props => <>{props.value}</>,
        sortType: "basic"
      },
      {
        Header: "Support",
        accessor: "support",
        cellClass: "text-muted w-25",
        Cell: props => <>{props.value}</>,
        sortType: "basic"
      },
      {
        Header: "Reactions",
        accessor: "reactions",
        cellClass: "text-muted w-25",
        Cell: props => <>{props.value}</>,
        sortType: "basic"
      },
      {
        Header: "Messages",
        accessor: "messages",
        cellClass: "text-muted w-25",
        Cell: props => <>{props.value}</>,
        sortType: "basic"
      },
      {
        Header: "Description",
        accessor: "description",
        cellClass: "text-muted w-25",
        Cell: props => <>{props.value}</>,
        sortType: "basic"
      }
    ],
    []
  );

  const [width, setWidth] = React.useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, []);
  // console.log("width", width);
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    // setHeight(window.innerHeight);
  };

  const [startdate, setStartdate] = useState(null);
  useEffect(() => {
    let startdate = moment(period);
    startdate = startdate.subtract(7, "days");
    startdate = startdate.format("MM/DD/YY");
    setStartdate(startdate);
    // console.log("enddate", startdate);
  }, [period]);

  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          <div>{startdate ? `${startdate} to ${period}` : `${period}`}</div>
          {/*<div
            onClick={() => {
              backMenu();
            }}
            style={{
              position: "absolute",
              right: 20,
              top: 15
            }}
            className="w-15 w-xs-100"
          >
            <span className="badge badge-primary badge-pill">{"< Back"}</span>
          </div>*/}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            {title}
          </span>
        </CardTitle>
        {/*<TableCard
          bgColor={"#2096F3"}
          columns={cols}
          data={[reports[0]]}
          setDemographyData={setDemographyData}
        />*/}

        <TableCard
          avgVoterBillDemography={avgVoterBillDemography}
          // selectedOptions={selectedOptions}
          columns={cols}
          data={reports}
          period={period}
          setDemographyData={setDemographyData}
        />
      </CardBody>
    </Card>
  );
};

export default ListCard;
