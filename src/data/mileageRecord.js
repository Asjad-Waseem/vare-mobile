module.exports = {
   tableName:'Mileage Record',
   formData: {
       Loads: {
         type:'text',
         placeholder:'Load#',
         required: true
       },
       Units: {
         type: 'select',
         placeholder: 'Select Units',
         required: true,
         options:[
           {name:1,value:1},
           {name:2,value:2},
           {name:3,value:3}
         ]
       },
       Jurisdiction: {
         type: 'text',
         placeholder: 'Start Mileage',
         required: true
       },
       Date: {
         type: 'date',
         placeholder: 'End Mileage',
         required: true
       },
       Route: {
         type: 'text',
         placeholder: 'Highway/Route',
         required: true
       },
       StartOdometer: {
         type: 'number',
         placeholder: 'Start Odometer#',
         required: true
       },
       EndOdometer: {
         type: 'number',
         placeholder: 'End Odometer#',
         required: true
       },
       FuelTruckStopName: {
         type: 'text',
         placeholder: 'Fuel/truck Stop Name',
         required: true
       },
       FuelStopAddress: {
         type: 'text',
         placeholder: 'Fuel Stop Address',
         required: true
       },
       GallonsPurchased: {
         type: 'text',
         placeholder: 'Gallons Purchased',
         required: true
       },
       Receipt: {
         type: 'file',
         placeholder: 'Gallons Purchased',
         required: true
       }
   }
}
