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

import products from "../../data/products";

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

  const tableCardColumns = [
    "bill_id",
    "support",
    "reactions",
    "messages",
    "description"
  ];

  return (
    <>
      <div>
        <div>
          {data.map(info => {
            return (
              <div
                style={{
                  padding: 10
                }}
                className={"card"}
              >
                {tableCardColumns.map((res, index) => {
                  if (res == "support") {
                    return (
                      <div key={"sdsdxddd" + index}>
                        <span
                          style={{
                            fontWeight: "bold"
                          }}
                        >
                          {res}:
                        </span>{" "}
                        {info[res]}%
                        <Progress value={(info[res] / 100) * 100} />
                      </div>
                    );
                  }
                  return (
                    <div key={"sdsdxddd" + index}>
                      <span
                        style={{
                          fontWeight: "bold"
                        }}
                      >
                        {res}:
                      </span>{" "}
                      {info[res]}
                    </div>
                  );
                })}
              </div>
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

const BestSellers = ({reports}) => {
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
        </CardTitle>
        {width && width < 960 ? (
          <TableCard columns={cols} data={reports} />
        ) : (
          <Table columns={cols} data={reports} />
        )}
      </CardBody>
    </Card>
  );
};

export default BestSellers;
