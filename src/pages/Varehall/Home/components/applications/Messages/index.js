import React, { Component } from 'react';
import { Row, Card } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';



const users = [
  {
    memberId:0,
    name: 'Sarah Kortney',
    type: 'congress'
  },
  {
    memberId:1,
    name: 'John Larry',
    type: 'user'
  },
  {
    memberId:2,
    name: 'Mimi Carreira',
    type: 'user'
  },
  {
    memberId:3,
    name: 'Larry White',
    type: 'user'
  }
]




class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showDetails:-1
       }
    }



  render(){
     const { match, memberId, messages } = this.props
     // const { messageThread } = this.state

     const accountInfo = users.filter(res => {
       return res.memberId == memberId
     })


     console.log('accountInfo',messages)


     const MemberMessage = ({msg,index,id}) => {
       const messageInfo = users.filter(res => {
         return res.memberId == id
       })
       // console.log('msg2',messageInfo)

       return    <div style={{width:'400px',right:0}} key={'k775jkj'+index}> <div className="clearfix"></div>
          <div className="card d-inline-block mb-3 float-left mr-2">
              <div className="position-absolute pt-1 pr-2 r-0">
                  <span className="text-extra-small text-muted">{msg.time}</span>
              </div>
              <div className="card-body">
                  <div className="d-flex flex-row pb-2">
                      <a className="d-flex" href="#">
                          <img alt="Profile Picture" src="/assets/img/profiles/l-1.jpg"
                              className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                      </a>
                      <div className=" d-flex flex-grow-1 min-width-zero">
                          <div
                              className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                              <div className="min-width-zero">
                                  <p className="mb-0 truncate list-item-heading">
                                  {messageInfo && messageInfo[0] ? messageInfo[0].name : ''}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="chat-text-left">
                      <p className="mb-0 text-semi-muted">
                          {msg.meesage}
                      </p>
                  </div>
              </div>
          </div>
           </div>
     }

     const VareUserMessage = ({msg,id,index}) => {
       const messageInfo = users.filter(res => {
         return res.memberId == id
       })
       console.log('msg1',messageInfo)

       return  <div style={{paddingLeft: '200px',width:'500px'}} key={'kkjjkj'+index}><div className="clearfix"></div>
       <div className="card d-inline-block mb-3 float-right  mr-2">
           <div className="position-absolute pt-1 pr-2 r-0">
               <span className="text-extra-small text-muted">{msg.time}</span>
           </div>
           <div className="card-body">
               <div style={{width:'400px'}} className="d-flex flex-row pb-2">
                   <a className="d-flex" href="#">
                       <img alt="Profile Picture" src="/assets/img/profiles/l-4.jpg"
                           className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                   </a>
                   <div className="d-flex flex-grow-1 min-width-zero">
                       <div
                           className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                           <div className="min-width-zero">
                               <p className="mb-0 list-item-heading truncate">
                               {messageInfo && messageInfo[0] ? messageInfo[0].name : ''}
                               </p>
                           </div>
                       </div>
                   </div>

               </div>

               <div className="chat-text-left">
                   <p className="mb-0 text-semi-muted">
                       {msg.meesage}
                   </p>
               </div>
           </div>
       </div>
        </div>
     }

      return (
      <>
       <div>
       <Row>
         <Colxx xxs="6" style={{"paddingTop": "15px","fontSize":"6px"}}>
           <div  className="card-title">{'H.R. 7994 - To authorize the President to award the Purple Heart to Anselm \"Jerry\" Cramer for injuries incurred during the Korean War while a member of the Marine Corps."'}</div>
           <Separator className="mb-5" />
         </Colxx>
       </Row>
           <div className="container-fluid">
               <div className="row app-row">
                   <div className="col-12 chat-app">
                       <div className="d-flex flex-row justify-content-between mb-3 chat-heading-container">
                           <div className="d-flex flex-row chat-heading">
                               <a className="d-flex" href="#">
                                   <img alt="Profile Picture" src="/assets/img/profiles/l-1.jpg"
                                       className="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small" />
                               </a>
                               <div className=" d-flex min-width-zero">
                                   <div
                                       className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                       <div className="min-width-zero">
                                           <a href="#">
                                               <p className="list-item-heading mb-1 truncate ">{accountInfo && accountInfo[0] ? accountInfo[0].name : ''}</p>
                                           </a>
                                           {/*<p className="mb-0 text-muted text-small">Last seen today 01:24</p>*/}
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>

                       <div className="separator mb-5"></div>

                       <div className="scroll">
                           <div className="scroll-content">

                               {messages.map((res,index) => {
                                 console.log('xxmessages',res)

                                 return <div key={'sdskk'+index}>
                                   {res.sent == true
                                     ? <Row ><MemberMessage
                                         msg={res}
                                         index={index}
                                         id={res.memberId}
                                      /></Row>
                                     : <Row><VareUserMessage
                                        msg={res}
                                        index={index}
                                        id={res.userId}
                                  /></Row >}
                                 </div>
                               })
                               }

                           </div>
                       </div>
                   </div>
               </div>
           </div>



               <a className="app-menu-button d-inline-block d-xl-none" href="#">
                   <i className="simple-icon-options"></i>
               </a>

           <div className="chat-input-container d-flex justify-content-between align-items-center"  >
               <input className="form-control flex-grow-1" type="text" placeholder="3Say something..." />
               <div>
                   <button type="button" className="btn btn-outline-primary icon-button large">
                       <i className="simple-icon-paper-clip"></i>
                   </button>
                   <button type="button" className="btn btn-primary icon-button large">
                       <i className="simple-icon-arrow-right"></i>
                   </button>

               </div>
           </div>
       </div>

      </>
    )
   }
 }
export default MessageBox;
