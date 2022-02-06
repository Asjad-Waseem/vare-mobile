import React, { Fragment,useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';


const GetInTouch =  (props) => {
  console.log('props',props)
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {

  }, []);
  return (<Fragment>
    {props.status
      ? <div
    style={{
      backgroundColor:'black',
      position:'absolute',
      zIndex:99,
      width:'100%',
      height:'100%',
    }}
    >
          <div>asasasa</div>
  </div> : null}
  </Fragment>);
}

export default GetInTouch;
