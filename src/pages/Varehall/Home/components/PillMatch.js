/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import moment from 'moment';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const Pill = (props) => {
const data = props.data
console.log(props.data)


  const PillMatch = ({title,percent,index}) => {
    return <div
    key={title+index+'eed'}
    style={{
      Positions:'absolute',
      width:'100%',
      backgroundColor:'#f8f8f8',
      paddingTop:'10px',
      borderWeight:'2px',
      borderRadius:'10px'
    }}>
    <span style={{
      marginLeft:'10px',
      textAlign:'center',
      color: 'black'
    }}>{title}</span>
        <div
           style={{
             Positions:'absolute',
             fontSize: '74%',
             // paddingRight: '1.25em',
             flexDirection: 'row',
             backgroundColor: '#00365a',
             width: percent+'%',
             height:'24px',
             margin:10,
             marginLeft:'0px',
             // left:'0px'
           }}>
             <p style={{
               // marginLeft: 'auto',
               // marginRight: 'auto',
               // width: '8em',
               // whiteSpace: 'pre',
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
        && data[props.info]
        &&  Object.keys(data[props.info]).length > 0
       ? Object.keys(data[props.info]).map((res, index) => {
         return <PillMatch key={'ksdflx'+index} title={res} percent={data[props.info][res]} index={index} />
       })
       : null}
    </div>
  );
};
export default Pill;
