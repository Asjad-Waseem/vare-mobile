import React, { Component } from 'react';
import { Card, CardBody, Badge, CustomInput } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import SummaryPill from '../../SummaryPill';

import Contacts from './contacts';


import { Colxx } from '../../common/CustomBootstrap';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideLink:false,
      viewOption:0,
      messages:[
        {
          name:'Sarah Kortney',
          img:'/assets/img/profiles/l-1.jpg',
          date:'14:20'
        },{
          name:'Rasheeda Vaquera',
          img:'/assets/img/profiles/l-2.jpg',
          date:'14:20'
        },
        {
          name:'Shelia Otterson',
          img:'/assets/img/profiles/l-3.jpg',
          date:'14:20'
        },
        {
          name:'Latarsha Gama',
          img:'/assets/img/profiles/l-4.jpg',
          date:'14:20'
        },
        {
          name:'Williemae Lagasse',
          img:'/assets/img/profiles/l-5.jpg',
          date:'14:20'
        },
        {
          name:'Tommy Nash',
          img:'/assets/img/profiles/l-6.jpg',
          date:'14:20'
        },
        {
          name:'Mayra Sibley',
          img:'/assets/img/profiles/l-7.jpg',
          date:'14:20'
        }
      ],
      contacts:[
        {
          name:'Latarsha Gama',
          img:'/assets/img/profiles/l-4.jpg',
          date:'14:20'
        },
        {
          name:'Shelia Otterson',
          img:'/assets/img/profiles/l-3.jpg',
          date:'14:20'
        },
        {
          name:'Rasheeda Vaquera',
          img:'/assets/img/profiles/l-2.jpg',
          date:'14:20'
        },
        {
          name:'Sarah Kortney',
          img:'/assets/img/profiles/l-1.jpg',
          date:'14:20'
        }
      ]
    };
  }

render (){
  const { item, handleCheckChange, isSelected } = this.props
  const {messages, contacts, viewOption} = this.state

  return (   <>
    <div className={!this.state.sideLink
      ? "app-menu"
      : "app-menu shown"}>
              <ul className="nav nav-tabs card-header-tabs ml-0 mr-0 mb-1"
                   role="tablist">
                  <li className="nav-item w-50 text-center">
                      <span
                      onClick={()=>{
                        this.setState({
                        viewOption:0
                      })
                    }}
                      className={viewOption == 0 ? "active nav-link" : "nav-link"}
                          id="first-tab"
                          data-toggle="tab"
                          role="tab"
                          aria-selected="true">Messages</span>
                  </li>
                  <li className="nav-item w-50 text-center">
                      <span
                          onClick={()=>{
                            this.setState({
                              viewOption:1
                            })
                          }}
                          className={viewOption == 1 ? "active nav-link" : "nav-link"}
                          id="second-tab"
                          data-toggle="tab"
                          role="tab"
                          aria-selected="false">Contacts</span>
                  </li>
              </ul>



              <div className="p-4 h-100">
                  <div className="form-group">
                      <input type="text" className="form-control rounded" placeholder="Search" />
                  </div>
                  <div className="tab-content h-100">
                      <div className="tab-pane fade show active  h-100" id="firstFull" role="tabpanel"
                          aria-labelledby="first-tab">

                          <div style={{overflow:'scroll',maxHeight:'400px'}}>
                               {viewOption == 0
                                 ? <Contacts
                                   data={messages}
                                />
                              : <Contacts
                                data={contacts}
                             />}
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

export default Chat;
