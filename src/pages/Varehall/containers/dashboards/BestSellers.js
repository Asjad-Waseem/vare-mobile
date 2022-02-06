/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import React, {useState, useEffect, useRef} from "react";
import {useTable, usePagination, useSortBy} from "react-table";
import {Card, CardBody, CardTitle, Progress} from "reactstrap"; //
import DatatablePagination from "../../mycomponents/DatatablePagination";
// import IntlMessages from "../../helpers/IntlMessages";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import Doughnut from "../../mycomponents/charts/Doughnut";
import {CircularProgressbar} from "react-circular-progressbar";

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

function Table({columns, data}) {
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
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
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
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
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

function TableCard({columns, data}) {
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
    bill_id: "Bill Id",
    support: "Support",
    reactions: "Reactions",
    messages: "Messages",
    description: "Description"
  };

  return (
    <>
      <div>
        <div
          lg={12}
          sm={12}
          className="row"
          // className={"card"}
          style={{
            color: "#922c88"
            // padding: -20
          }}
        >
          {data.map(info => {
            return (
              <Colxx
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
                {Object.keys(tableCardColumns).map((res, index) => {
                  if (res == "support") {
                    return (
                      <div
                        className="glide__slide--active"
                        key={"sdsdbvxddd" + index}
                      >
                        <span
                          style={{
                            fontWeight: "bold"
                          }}
                        >
                          {tableCardColumns[res]}:
                        </span>{" "}
                        {info[res]}%
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 70,
                            height: 70,
                            width: 70
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              paddingLeft: 22,
                              top: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {info[res]}%
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
                                stroke: `rgba(62, 152, 199, ${info[res] /
                                  100})`,
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
                                stroke: "#d6d6d6",
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
                        </div>
                        {/*<Progress value={(info[res] / 100) * 100} />*/}
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
            );
          })}
        </div>
      </div>

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

const BestSellers = ({reports, backMenu}) => {
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

  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          <div>VARE Report</div>
          <div
            onClick={() => {
              backMenu();
            }}
            style={{
              position: "absolute",
              right: 20,
              top: 15
            }}
            class="w-15 w-xs-100"
          >
            <span class="badge badge-primary badge-pill">{"< Back"}</span>
          </div>
        </CardTitle>
        <TableCard columns={cols} data={reports} />
      </CardBody>
    </Card>
  );
};

export default BestSellers;
