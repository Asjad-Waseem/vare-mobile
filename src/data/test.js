const _               = require('lodash');
const Promise = require('bluebird');
const data = require('../datab/index');
const table = require('.');

const getInfo = (dee) => {
  const response = {
    Loads: {
      type:'number',
      placeholder:'Load#',
      required: true
    },
    Units: {
      type: 'number',
      placeholder: 'Units',
      required: true
    }
  }
  return response
}

const getVal = (table,key,match,value) =>{
  const imporVal=data[table].tableData
  const answ= imporVal && imporVal.filter(res => res[key]==match)
  return answ ? answ[0][value] : '';
}

const buildData = () =>{
  const imporData = data.tripReport.tableData
  console.log('imporData',imporData)
  imporData && imporData.map(res => {
    res['ActualMiles']= res.EndMileage - res.StartMileage
    res['DriverName'] = getVal('driver','Units',res['Units'],'Name')
    res['EstimatedFuel']= getVal('load','Units',res['Units'],'MileRate')*res.ActualMiles
  })
  return imporData
}


module.exports = {
 tableName: 'Test',
 formData: getInfo((args) => {
    return  args
  }),
 tableData: buildData()
}
