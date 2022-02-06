import React, { Component } from 'react';
import { Card, CardBody, Badge, CustomInput, Tooltip } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SummaryPill from '../../SummaryPill';


import { Colxx } from '../../common/CustomBootstrap';
var moment = require('moment');

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberId:2,
      events:{},
      tooltipOpen:false
    };
  }

  handleCheckChange(e){
    alert(e.target.value)
  }

  handleDateDiff(theDate){
    var now = moment();
    var date = theDate && moment(theDate.split(' ')[0])
    const duration = now - date
    if(duration > 1){
      // console.log('old',date)
      return 'old'
    } else {
      // console.log('new',date)
      return 'new'

    }
    // return duration > 1 ?
  }

  componentDidMount(){
    const { data } = this.props
    data && data.length > 0
      && data.map(res => {
        const temp = this.state.events
        temp[res.id]=true
        res.status && this.setState({
         events: temp
       },()=>{
         // console.log('ccc',this.state)
       })

      })
  }

render (){
  const { data, isSelected } = this.props
  const { tooltipOpen } = this.state



  return (   <>
              <div>
                  {data && data.length > 0
                    ? data.map((res, index) => {
                      return <div className="d-flex flex-row mb-1 border-bottom pb-3 mb-3">
                        <a className="d-flex" href="#" >
                            <img alt="Profile Picture" src={res.img}
                                className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                        </a>
                        <div className="d-flex flex-grow-1 min-width-zero">
                            <div
                                className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div className="min-width-zero">
                                    <a href="#"><p className=" mb-0 truncate">{res.title}</p>  </a>
                                         <CustomInput
                                          className="itemCheck mb-0 "
                                          type="checkbox"
                                          id={res.id}
                                          checked={res.endDate
                                            && this.handleDateDiff(res.endDate)
                                            && this.handleDateDiff(res.endDate) == 'new'
                                            && this.state.events[res.id] ? true : false}
                                          onChange={(event) => res.endDate
                                            && this.handleDateDiff(res.endDate)
                                            && this.handleDateDiff(res.endDate) == 'new'
                                            ? this.setState({
                                             events: {...this.state.events,[res.id]:
                                               this.state.events && this.state.events[res.id]
                                               ? !this.state.events[res.id]
                                               : true}
                                          },()=>{
                                            // console.log(this.state)
                                          }) : alert('Event Date Past')
                                        }
                                          label={this.state.events
                                              && this.state.events[res.id]
                                              && res.endDate
                                              && this.handleDateDiff(res.endDate)
                                              && this.handleDateDiff(res.endDate) == 'new'
                                             ? "Turn Event Off"
                                             : "Turn Event On"}
                                        />

                                    <p className="mb-1 text-muted text-small">{res.startDate}</p>
                                    <div className="w-15 w-sm-100">
                                      <span className="badge badge-pill"
                                      style={{marginTop:'10px', backgroundColor: '#236591', color:'#fff',fontSize:12,
                                       width:'150px'}}>
                                       {res.views} VIEWS
                                       </span>
                                       <span id={"Tooltip-6"}  className="badge badge-pill"
                                       style={{marginTop:'10px', backgroundColor: '#922c88', color:'#fff',fontSize:12,
                                      width:'150px'}}>
                                        {res.rsvp} RSVP
                                        </span>
                                        {/*<Tooltip
                                          placement={'auto'}
                                          isOpen={true}
                                          target={"Tooltip-" + indexs}
                                          toggle={() => {this.setState({
                                            tooltipOpen:!tooltipOpen
                                          })}}
                                        >
                                          {'item.body'}
                                        </Tooltip>*/}
                                    </div>


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

export default Events;
