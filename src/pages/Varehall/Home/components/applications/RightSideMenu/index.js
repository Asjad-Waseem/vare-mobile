import React, { Component } from 'react';
import { Card, CardBody, Badge, CustomInput } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SummaryPill from '../../SummaryPill';

import EventsMenu from './eventsMenu';
import MessagesMenu from './messagesMenu';
import ContactsMenu from './contactsMenu';




import { Colxx } from '../../common/CustomBootstrap';

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberId:2,
      sideLink:false,
      viewSelected:'',
    };
  }

  componentDidMount(){
    this.setState({
      viewSelected:this.props.defaultVal ? this.props.defaultVal : 'Messages'
    })
  }

render (){
  const { data, defaultVal, titles, titleA, titleB, handleCheckChange, titleAData,titleBData } = this.props
  const { viewSelected } = this.state

  const ViewComponents = ({data,title}) => {

        return <>
        {title == 'Events' && viewSelected == title
        ? <EventsMenu
           data={data}
           handleEvents={this.props.handleEvents.bind(this)}
        />
        : title == 'Messages' && viewSelected == title
        ? <MessagesMenu
            handleMessage={this.props.handleMessage.bind(this)}
            data={data}
         />
         : title == 'Contacts' && viewSelected == title
         ? <ContactsMenu
          handleContacts={this.props.handleContacts.bind(this)}
          data={data}
          />
          : null}
        </>
  }

  return (   <>
    <div className={!this.state.sideLink
      ? "app-menu"
      : "app-menu shown"}>
              <ul className="nav nav-tabs card-header-tabs ml-0 mr-0 mb-1"
                   role="tablist">
                  {titles && titles.length > 0
                    ? titles.map((res, index) => {
                      return <li key={'dfbhcc'+index} className="nav-item w-50 text-center">
                        <span
                        onClick={()=>{
                          this.setState({
                          viewSelected:res
                        },()=>{
                          this.props.handleRightSideMenu(index)
                        })
                      }}
                        className={viewSelected == res ? "active nav-link" : "nav-link"}
                            id="first-tab"
                            data-toggle="tab"
                            role="tab"
                            aria-selected="true">{res}</span>
                    </li>
                  }) : <li></li>}
              </ul>



              <div className="p-4 h-100">
                  <div className="form-group">
                      <input type="text" className="form-control rounded" placeholder="Search" />
                  </div>
                  <div className="tab-content h-100">
                      <div className="tab-pane fade show active  h-100" id="firstFull" role="tabpanel"
                          aria-labelledby="first-tab">

                          <div style={{overflow:'scroll',maxHeight:'400px'}}>
                               {titles && titles.length > 0
                                 ? titles.map(res => {
                                  return <ViewComponents
                                     data={data[res]}
                                     title={res}
                                  />
                               }) : null}
                          </div>

                      </div>
                  </div>
              </div>

              <span onClick={()=>{this.setState({
                sideLink: !this.state.sideLink
              })}}
              className={!this.state.sideLink
                ? "app-menu-button d-inline-block d-xl-none  nav-link"
                : "app-menu-button d-inline-block d-xl-none"} >
                  <i className="simple-icon-options"></i>
              </span>
          </div>

          {/*<div className="chat-input-container d-flex justify-content-between align-items-center">
              <input className="form-control flex-grow-1" type="text" placeholder="Say something..." />
              <div>
                  <button type="button" className="btn btn-outline-primary icon-button large">
                      <i className="simple-icon-paper-clip"></i>
                  </button>
                  <button type="button" className="btn btn-primary icon-button large">
                      <i className="simple-icon-arrow-right"></i>
                  </button>

              </div>
          </div>*/}
      </>
  );
 }
}

export default Notice;
