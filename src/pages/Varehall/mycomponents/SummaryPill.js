/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import moment from 'moment';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}


class Pill extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }




render (){
  const data = this.props.data
  console.log(this.props.data)


   const SummaryPill = ({title,percent,index}) => {
    return <div
    key={title+index+'eed'}
    style={{
      Positions:'absolute',
      width:'500px',
      backgroundColor:'#f8f8f8',
      // paddingTop:'10px',
      borderWeight:'2px',
      borderRadius:'10px',
      height:'24px'
    }}>

        <div
           className={'badge-voteYes-color'}
           style={{
             Positions:'absolute',
             borderRadius:'10px',
             fontSize: '74%',
             flexDirection: 'row',
             // backgroundColor: '#00365a',
             width: percent+'%',
             height:'24px',
             margin:10,
             marginLeft:'0px',
           }}>
             <p style={{
               borderRadius:10,
               backgroundColor:'rgba(0,0,0,.40)',
               paddingLeft:'5px',
               float:'left',
               color:'white',
               textAlign:'center',
               fontSize:'12px',
               margin:'2px',
             }}>{percent}%
            </p>
            </div>
    </div>
  }

  return (<div style={{align:'center',flexDirection:'row'}}>
      {data
        && data[this.props.info]
        &&  Object.keys(data[this.props.info]).length > 0
       ? Object.keys(data[this.props.info]).map((res, index) => {
         return <SummaryPill
            key={'ksdflx'+index}
            title={res}
            percent={data[this.props.info][res]}
            handleShowDetails={()=>this.this.props.handleShowDetails()}
            index={index}
          />
       })
       : null}
    </div>
  );
 }
}
export default Pill;
