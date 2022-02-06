/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import moment from 'moment';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const Table = ({data,title}) => {
  const goToBack = () => {
  };
  const goToNext = () => {
  };
  const goToCurrent = () => {
  };

  const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }


  const header = () => {
    return (
      <thead>
       <tr role="row">
           {Object.keys(data[0]).map((res, index) => {
             return <th colspan="1"
                 role="columnheader"
                 title="Toggle SortBy"
                 class=""
                 >{capitalize(res.toString())}<span>
                 </span>
              </th>
           })}
          </tr>
       </thead>
    );
  };

  const body = () => {
    return (data.map(rep => {
        return <tr role="row">
         {Object.keys(rep).map((res, index) => {
            return <td role="cell" class="text-muted w-50">{rep[res]}</td>
          })}
        </tr>
      })
    );
  };

  return (<div style={{"padding-bottom": "15px"}}>
    <div class="h-100 card"><div class="card-body">
 <div class="card-title">{title}</div>
  <table role="table" class="r-table table">
    {header()}
    <tbody role="rowgroup">
      {body()}
      </tbody>
      </table>
        <div class="text-center">
          <nav class="d-inline-block" aria-label="Page navigation example">
            <ul class="justify-content-center pagination pagination-sm">
              <li class="disabled page-item">
                 <button disabled="" class="prev page-link">
                 <i class="simple-icon-arrow-left"></i></button>
              </li>
              <li class="page-item active">
                <button class="page-link">1</button>
              </li>
              <li class="page-item">
                 <button class="page-link">2</button>
              </li>
              <li class="page-item">
                <button class="page-link">3</button>
              </li>
              <li class="page-item">
                <button class="page-link">4</button>
              </li>
              <li class="false page-item">
                <button class="next page-link">
                <i class="simple-icon-arrow-right"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
  );
};
export default Table;
