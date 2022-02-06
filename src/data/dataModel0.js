const _               = require('lodash');
const Promise = require('bluebird');
// const data = require('../datab/index');
const table = require('.');

let data = []

const getVal = (table,key,match,value) =>{
  // console.log('info5',table,key,match,value)
  const imporVal = table && data[table].tableData
  ? data[table].tableData : ''
  const answ = imporVal
  && table
  && key
  && match
  && value
  && imporVal.filter(res => res[key]==match)
  return imporVal && answ
  && answ[0]
  && answ[0][value]
  ? answ[0][value]
  : '';
}

const tripReport = (reportTable) =>{
  const imporData = data[reportTable].tableData
  imporData
  && Array.isArray(imporData)
  && imporData.map(res => {
    res['ActualMiles']= res.EndMileage - res.StartMileage
    res['DriverName'] = getVal('driver','Units',res['Units'],'Name')
    res['EstimatedFuel']= getVal('load','Units',res['Units'],'MileRate')*res.ActualMiles
  })
  return imporData
}

const driver = () => { return '' }
const drugTest = () => { return '' }
const importantFilings = () => { return '' }
const issues = () => { return '' }
const load = () => { return '' }
const maintenance = () => { return '' }
const maintenanceRecord = () => { return '' }
const mileageRecord = () => { return '' }
const payroll = () => { return '' }
const units = () => { return '' }
const test = () => { return '' }


const Info = (reportTable, info) => {
  data = info
  const allRecords = {
        driver: driver(reportTable),
        drugTest: drugTest(reportTable),
        importantFilings: importantFilings(reportTable),
        issues: issues(reportTable),
        load: load(reportTable),
        maintenance: maintenance(reportTable),
        maintenanceRecord: maintenanceRecord(reportTable),
        mileageRecord: mileageRecord(reportTable),
        payroll: payroll(reportTable),
        tripReport: tripReport(reportTable),
        units: units(reportTable),
        test: test(reportTable)
}
   return allRecords[reportTable]
   ? allRecords[reportTable]
   : info[reportTable]
}

export default Info
