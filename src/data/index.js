const driver = require('./driver');
const drugTest = require('./drugTest');
const importantFilings = require('./importantFilings');
const issues = require('./issues');
const load = require('./load');
const maintenance = require('./maintenance');
const maintenanceRecord = require('./maintenanceRecord');
const mileageRecord = require('./mileageRecord');
const payroll = require('./payroll');
const tripReport = require('./tripReport');
const units = require('./units');
const calendar = require('./calendar');

module.exports = {
  driver:driver,
  drugTest:drugTest,
  importantFilings:importantFilings,
  issues:issues,
  load:load,
  maintenance:maintenance,
  maintenanceRecord:maintenanceRecord,
  mileageRecord:mileageRecord,
  payroll:payroll,
  tripReport:tripReport,
  units:units,
  calendar:calendar
}
