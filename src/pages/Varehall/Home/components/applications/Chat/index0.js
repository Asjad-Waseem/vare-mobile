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
    };
  }

render (){
  const { item, handleCheckChange, isSelected } = this.props

  return (   <>
    <div className="app-menu">
              <ul className="nav nav-tabs card-header-tabs ml-0 mr-0 mb-1" role="tablist">
                  <li className="nav-item w-50 text-center">
                      <a className="nav-link active" id="first-tab" data-toggle="tab" href="#firstFull" role="tab"
                          aria-selected="true">Messages</a>
                  </li>
                  <li className="nav-item w-50 text-center">
                      <a className="nav-link" id="second-tab" data-toggle="tab" href="#secondFull" role="tab"
                          aria-selected="false">Contacts</a>
                  </li>
              </ul>



              <div className="p-4 h-100">
                  <div className="form-group">
                      <input type="text" className="form-control rounded" placeholder="Search" />
                  </div>
                  <div className="tab-content h-100">
                      <div className="tab-pane fade show active  h-100" id="firstFull" role="tabpanel"
                          aria-labelledby="first-tab">

                          <div className="scroll">

                               <Contacts />

                              <div className="d-flex flex-row mb-1 border-bottom pb-3 mb-3">
                                  <a className="d-flex" href="#" >
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-1.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className=" mb-0 truncate">Sarah Kortney</p>
                                              </a>
                                              <p className="mb-1 text-muted text-small">14:20</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>


                              <div className="d-flex flex-row mb-1 border-bottom pb-3 mb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-2.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className=" mb-0 truncate">Rasheeda Vaquera</p>
                                              </a>
                                              <p className="mb-1 text-muted text-small">11:10</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-1 border-bottom pb-3 mb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-3.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className=" mb-0 truncate">Shelia Otterson</p>
                                              </a>
                                              <p className="mb-1 text-muted text-small">09:50</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-1  pb-3 mb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className=" mb-0 truncate">Latarsha Gama</p>
                                              </a>
                                              <p className="mb-1 text-muted text-small">09:10</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="tab-pane fade  h-100" id="secondFull" role="tabpanel" aria-labelledby="second-tab">
                          <div className="scroll">

                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-1.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Sarah Kortney</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-2.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Williemae Lagasse</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-3.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Tommy Nash</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Mayra Sibley</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-5.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Kathryn Mengel</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-2.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Williemae Lagasse</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-3.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Tommy Nash</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Mayra Sibley</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-3.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Tommy Nash</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Mayra Sibley</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-5.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Kathryn Mengel</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-2.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Williemae Lagasse</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 border-bottom pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-3.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Tommy Nash</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="d-flex flex-row mb-3 pb-3">
                                  <a className="d-flex" href="#">
                                      <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                                          className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                                  </a>
                                  <div className="d-flex flex-grow-1 min-width-zero">
                                      <div
                                          className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                          <div className="min-width-zero">
                                              <a href="#">
                                                  <p className="mb-0 truncate">Mayra Sibley</p>
                                              </a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>

              <a className="app-menu-button d-inline-block d-xl-none" href="#">
                  <i className="simple-icon-options"></i>
              </a>
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
