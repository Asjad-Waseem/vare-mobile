/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import moment from 'moment';

const nameCaptitalize = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const Pill = ({
  percent='10%',
  title='Yes'
}) => {

  return (<div style={{align:'center',flexDirection:'row'}}>
  <span style={{
  color:'black',
}}><p style={{textAlign:'center'}}>{percent}%</p></span>
  <div style={{
       // padding: "0.55em 0.0em 0.em 0.75em",
       fontSize: '74%',
       paddingRight: '1.25em',
       // paddingLeft: '1.25em',
       flexDirection: 'row',
       backgroundColor: 'red',
       width:'90px',
       height:'24px',
       borderRadius:25
     }}>
      <span style={{
        position:'absolute',
        borderRadius:20,
        width:'60px',
        height:'24px',
        backgroundColor:'#184f90',
        color:'white',
        float:'right'
    }}>
    <p style={{textAlign:'center',fontSize:'12px',margin:'2px'}}>{title}</p>
    </span>
    </div></div>
  );
};
export default Pill;
