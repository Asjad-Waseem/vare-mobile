/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import moment from 'moment';
import PillMatch from './PillMatch';
import SummaryPill from './SummaryPill';
import { Card, CardBody, Row, DropdownToggle } from 'reactstrap';
import DatatablePagination from './DatatablePagination';
import { Colxx, Separator } from '../components/common/CustomBootstrap';
import ReportCardList from '../components/applications/ReportCardList';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

class TableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
     showDetails:-1
    };
  }

render (){
  const { data,title } = this.props
  const { showDetails } = this.state

  const SelecBox = () => {
    return <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
            <input type="text" name="keyword" id="search" placeholder="Keyword Search" />
        </div>
  }


    const sumObject = (info) => {
        const arrayInfo = Object.keys(info).map(res => {
          return info[res]*1
        })
        const total = arrayInfo.reduce(function(a, b){
              return a + b;
          }, 0)
           return Math.round(total/arrayInfo.length)
        };
        const capitalize = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }


    const header = (res,indexNum) => {
       const newHeaders = ["Legislation Details","Your Vote","Race Vote Match","Age Group Vote Match","Party Vote Match"]
       const dataHeaders = ["Race","Age Group","Party"]
       return newHeaders.map((res, index) => {
          return <th  style={{width: '100%', color: showDetails !== indexNum
            ? '#fffff' :'#922c88'}}>
           {res} {res == 'Legislation Details' ?
            `(${data[indexNum]['title']})`
          : ''}
          </th>
        })
    };

    const summaryTable = (rep,indexNum) => {
         const averageRace = sumObject(rep['race'])
         const averageAge = sumObject(rep['age'])
         const averageParty = sumObject(rep['party'])
          // console.log('xxx2',averageRace,averageAge,averageParty)

         const average = {
           "race":{
             "All Race": averageRace
           },
           "age":{
             "All Age Group": averageAge
           },
           "party":{
               "All Parties": averageParty
            }
         }
         const newTable = {}
           newTable["legislation#"]= rep["legislation#"]
           newTable["vote"]= rep["vote"]
           const tableConst = Object.keys(newTable).map((res, index) => {
              return res != 'url' && <td
              key={'kflx'+index} role="cell" className="text-muted w-10">
              <span style={{color:'white'}}>
                  {res == "legislation#" ?
                  rep['title'] : rep[res]}
               </span>
              </td>
              })
              console.log('sss',rep)
              return  <ReportCardList
                  isSelected={true}
                  handleShowDetails={()=>{
                    this.setState({
                      showDetails: this.state.showDetails == indexNum ? -1 : indexNum
                    })
                  }}
                   item={{
                      id:1,
                      title:rep['title'],
                      status:'PENDING',
                      vote:rep['vote'],
                      createDate:rep['createDate'],
                      labelColor:'red',
                      label:'label',
                      data:average
                  }}  />
    };

    const bodyB = (rep,indexNum) => {

          return  <Row onClick={()=>
            this.setState({
              showDetails: this.state.showDetails == indexNum ? -1 : indexNum
            })
          }>
            <Colxx md="2" style={{margin:20}}>
               <span style={{fontSize:15}}>
                 {rep["legislation#"]}
               </span>
            </Colxx>

            <Colxx md="2" style={{margin:10}}>
                <div style={{padding:10}}>
                  <span style={{fontSize:15,fontWeight:'bold'}}>{`Your Vote:`}</span>
                  <span style={{fontSize:15,fontWeight:''}}>{` ${rep["vote"]}`}</span>
               </div>
            </Colxx>

           <Colxx md="2" style={{margin:10}}>
              <div style={{padding:10}}>
                  <span style={{fontSize:15,fontWeight:'bold'}}>Vote By Race</span>
              </div>
              <div>
                <PillMatch info={'race'} data={rep}  />
              </div>
             </Colxx>

             <Colxx md="2" style={{margin:10}}>
               <div style={{padding:10}}>
                  <span style={{fontSize:15,fontWeight:'bold'}}>Vote By Age</span>
               </div>
               <div>
                 <PillMatch info={'age'} data={rep}  />
               </div>
             </Colxx>

             <Colxx md="2" style={{margin:10}}>
                <div style={{padding:10}}>
                   <span style={{fontSize:15,fontWeight:'bold'}}>Vote By Party</span>
               </div>
               <div>
               <PillMatch info={'party'} data={rep}  />
               </div>
            </Colxx>

        </Row>
    };

    const tableBuilt = (data) => {
       return data.map((info, index) => {
        return <div>
        {showDetails !== index
          ? summaryTable(info,index)
          : null}
          {showDetails == index
            ? <Card style={{
              marginBottom:'30px',
              width: '100%',
            }} >
            {bodyB(info)}
            </Card>
          : null}
          </div>
        })
    }

    return (<div style={{paddingBottom: "15px"}}>
      <SelecBox />
        <div className="card-title">
          {title}
        </div>

           {tableBuilt(data)}


          <Row >
          <Colxx style={{alignSelf:'center'}}>
           <DatatablePagination
               page={1}
               pages={10}
               canPrevious={false}
               canNext={true}
               pageSizeOptions={[]}
               showPageSizeOptions={true}
               showPageJump={true}
               defaultPageSize={2}
               onPageChange={()=>{}}
               onPageSizeChange={()=>{}}
               paginationMaxSize={2}
            />
            </Colxx>
          </Row>

    </div>
    );
  }
}

export default TableCard;
