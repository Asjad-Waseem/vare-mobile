//import axios from 'axios'
// import thunk from 'redux-thunk'
import axiosQuery from './axiosQuery'
export const APPOINTMENT_ORIGINAL = 'APPOINTMENT_ORIGINAL'


const ENV = process.env

/** Login Form Actions */

export const appointmentOriginal = (response) => {
  return {
    type: APPOINTMENT_ORIGINAL,
    payload: { response }
  }
}


export const getAppointmentData = () => {

  return (dispatch, getState) => {
    const myRequest = {
    //  url:'https://goproverify.com/data/data-post.php/',
      request: 'get',
      resource:'appointments',
      query:{},
      id: -1,
      sortme:'',
      orderme:''
    }
    //console.log('myRequest',myRequest)
    axiosQuery(myRequest)
      .then(response => {
          // console.log('appointments',response.data)
          dispatch(appointmentOriginal(response.data))
          return
    })
      .catch(error => {
          //dispatch(appointmentFailure(error))
        return error
      })
      .then(res => {
        //alert('res')
        // console.log('res',res)
        return res
      })
  }
}
