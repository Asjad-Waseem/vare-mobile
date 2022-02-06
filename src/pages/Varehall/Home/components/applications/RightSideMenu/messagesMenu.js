import React, { Component } from 'react';
import { Card, CardBody, Badge, CustomInput } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SummaryPill from '../../SummaryPill';


import { Colxx } from '../../common/CustomBootstrap';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

render (){
  const { data, handleCheckChange, isSelected } = this.props
  console.log('data',data)

  return (<>
            <div>
              {data && data.length > 0
                ? data.map((res, index) => {
                  return <div key={'sdxbskk'+index} className="d-flex flex-row mb-1 border-bottom pb-3 mb-3">
                    <a className="d-flex" href="#" >
                        <img alt="Profile Picture" src={res.img}
                            className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                    </a>
                    <div className="d-flex flex-grow-1 min-width-zero">
                        <div
                            className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                            <div className="min-width-zero">
                                <a onClick={()=>{
                                   this.props.handleMessage(index)
                                }}>
                                    <p className=" mb-0 truncate">{res.name}</p>
                                </a>
                                <p className="mb-1 text-muted text-small">{res.date}</p>
                            </div>
                        </div>
                    </div>
                </div>
              }) : null}
          </div>
      </>
   );
 }
}

export default Messages;
