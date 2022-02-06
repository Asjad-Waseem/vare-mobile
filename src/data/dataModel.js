const _               = require('lodash');
const Promise = require('bluebird');
// const data = require('../datab/index');
const table = require('.');

let data = []

const getVal = (table,key,match,value) =>{
  // console.log('info5',table,key,match,value)
  const imporVal = table
  && data[table]
  && data[table].tableData
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
  const importData = data[reportTable]
  && data[reportTable].tableData

  importData
  && Array.isArray(importData)
  && importData.map(res => {
    res['ActualMiles'] = res.EndMileage - res.StartMileage
    res['DriverName'] = getVal('driver','Units',res['Units'],'Name')
    res['EstimatedFuel'] = getVal('load','Units',res['Units'],'MileRate')*res.ActualMiles
  })
  return importData
}

const driver = () => { return '' }
const drugTest = () => { return '' }
const importantFilings = () => { return '' }
const issues = () => { return '' }

const load = (reportTable) => {
  const importData = data[reportTable]
  && data[reportTable].tableData

  importData
  && Array.isArray(importData)
  && importData.map(res => {
    res['MileRate']= res.EstimatePay && res.Miles
    ? (res.EstimatePay/res.Miles)
    : 0
    res['Driver'] = getVal('driver','Units',res['Units'],'Name')
    res['FuelRatePerMile']=
    (getVal('units','Units',res['Units'],'FuelCapacity')
    *res.FuelRate) /
    (getVal('units','Units',res['Units'],'FuelCapacity')
    * getVal('units','Units',res['Units'],'MilesPerGallon'))
    res['EstimatedFuelCost']=res.Miles * res.FuelRatePerMile

  })
  return importData
}

const maintenance = () => { return '' }
const maintenanceRecord = () => { return '' }
const mileageRecord = () => { return '' }
const payroll = () => { return '' }
const units = () => { return '' }


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
        units: units(reportTable)
}
   return allRecords[reportTable]
   ? allRecords[reportTable]
   : info[reportTable]
   ? info[reportTable].tableData
   : []
}

export default Info
