/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import moment from 'moment';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const TableCard = ({data,title}) => {
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
           {Object.keys(data[0]).map((res, index) => {
             return res != 'URL' && <th colspan="1"
                 role="columnheader"
                 title="Toggle SortBy"
                 class=""
                 >{capitalize(res.toString())}
              </th>
           })}
       </thead>
    );
  };

  const body = () => {
    return (data.map(rep => {
        return <tr role="row">
         {Object.keys(rep).map((res, index) => {
            return res != 'URL' && <td role="cell" class="text-muted w-10">
              {res.includes('%')
              ? <div style={{align:'center'}}>
              <span style={{
              color:'black',
            }}>10%</span>
              <div style={{
                   // padding: "0.55em 0.0em 0.em 0.75em",
                   fontSize: '74%',
                   paddingRight: '1.25em',
                   // paddingLeft: '1.25em',
                   flexDirection: 'row',
                   backgroundColor: 'red',
                   width:'90px',
                   height:'24px',
                   borderRadius:25
                 }}>
                  <span style={{
                    position:'absolute',
                    borderRadius:20,
                    width:'60px',
                    height:'24px',
                    backgroundColor:'#184f90',
                    color:'white',
                    float:'right'
                }}>
                <p style={{textAlign:'center',fontSize:'12px',margin:'2px'}}>Yes</p>
                </span>
                </div></div>
              :  rep[res]}
            </td>
          })}
        </tr>
      })
    );
  };

  return (<div style={{"padding-bottom": "15px"}}>
    <div class="h-100 card"><div class="card-body">
 <div class="card-title">{title}</div>
  <table role="table" class="r-table table" style={{width: '100%'}}>
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
export default TableCard;
