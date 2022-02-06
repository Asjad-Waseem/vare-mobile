import React, { Component } from 'react';
import { Card, CardBody, Badge, CustomInput } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SummaryPill from '../SummaryPill';


import { Colxx } from '../common/CustomBootstrap';

class ReportCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

render (){
  const { item, handleCheckChange, isSelected } = this.props

  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3">
        <div onClick={()=>
          this.props.handleShowDetails()
        }
        className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row min-width-zero align-items-md-center">
            <NavLink
              to="#"
              location={{}}
              id={`toggler${item.id}`}
              className="w-15 list-item-heading mb-0 truncate w-10 w-xs-100  mb-1 mt-1"
            >
              <i
                className={`${
                  item.status === 'COMPLETED'
                    ? 'simple-icon-check heading-icon'
                    : 'simple-icon-refresh heading-icon'
                }`}
              />
              <span className="align-middle d-inline-block">{item.title}</span>
            </NavLink>
            <p className="w-15 mb-1 text-muted text-small w-xs-100">
              {`Your Vote: ${item.vote}`}
            </p>
            <p className="w-15 mb-1 text-muted text-small w-xs-100">
              {item.createDate}
            </p>
            <div className="w-55 w-xs-100">
            <p className="w-55 mb-1 text-muted text-small w-xs-100">
              {'% of VARE Voters aligned with you:'}
            </p>
              <SummaryPill info={'race'} data={item.data}  />
            </div>

          </CardBody>

        </div>
      </Card>
    </Colxx>
  );
 }
}

export default React.memo(ReportCardList);
