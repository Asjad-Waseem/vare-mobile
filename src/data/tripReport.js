module.exports = {
  tableName:'Trip Report',
  numberFormat:[
    "ActualMiles",
     "Loads",
      "Units",
       "StartMileage",
        "EndMileage",
         "FuelCost",
          "EstimatedFuel",
           "TollCost"
         ],
  formData: {
      Loads: {
        type:'number',
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
      StartMileage: {
        type: 'number',
        placeholder: 'Start Mileage',
        required: true
      },
      EndMileage: {
        type: 'number',
        placeholder: 'End Mileage',
        required: true
      },
      FuelCost: {
        type: 'number',
        placeholder: 'Fuel Cost',
        required: true
      },
      EstimatedFuel: {
        type: 'number',
        placeholder: 'Fuel Cost',
        required: true
      },
      FuelReceipts: {
        type: 'file',
        placeholder: 'Fuel Receipts',
        required: true
      },
      MiscReceipts: {
        type: 'file',
        placeholder: 'Misc Receipts',
        required: true
      },
      Retention: {
        type: 'text',
        placeholder: 'Retention',
        required: true
      },
      LoadUnload: {
        type: 'text',
        placeholder: 'Load Unload',
        required: true
      },
      BOL: {
        type: 'text',
        placeholder: 'BOL',
        required: true
      },
      Photo: {
        type: 'file',
        placeholder: 'Photo',
        required: true
      },
      TollCost: {
        type: 'number',
        placeholder: 'Toll Cost',
        required: true
      },
      TollReceipts: {
        type: 'file',
        placeholder: 'Toll Receipts',
        required: true
      },
      Inspections: {
        type: 'text',
        placeholder: 'Inspections',
        required: true
      }
  },
  lineChartData: {
      dataColumns:[
        'EndMileage',
        'ActualMiles'
      ],
      dataKey:'Timestamp',
      title:'Sales Statistics',
      subTitle:'Growth over time'
  },
  summaryData: [
    {
      title: '',
      value: '2.544',
      changeRatio: '-28',
      dataKey: 'ActualMiles',
      data: [
        { 'uv': 2034, 'sales': 623, 'br': 56, 'ns': 2343},
        { 'uv': 2734, 'sales': 1223, 'br': 43, 'ns': 3200},
        { 'uv': 2522, 'sales': 723, 'br': 64, 'ns': 3063},
        { 'uv': 2944, 'sales': 1043, 'br': 44, 'ns': 3666},
        { 'uv': 1822, 'sales': 433, 'br': 74, 'ns': 1909}
      ],
      stroke: '#69F0AE',
      fill: '#69F0AE'
    },
    {
      title: '',
      value: '65%',
      changeRatio: '+19',
      dataKey: 'FuelCost',
      data: [
        { 'uv': 2034, 'sales': 623, 'br': 56, 'ns': 2343},
        { 'uv': 2734, 'sales': 1223, 'br': 43, 'ns': 3200},
        { 'uv': 2522, 'sales': 723, 'br': 64, 'ns': 3063},
        { 'uv': 2944, 'sales': 1043, 'br': 44, 'ns': 3666},
        { 'uv': 1822, 'sales': 433, 'br': 74, 'ns': 1909}
      ],
      stroke: '#448AFF',
      fill: '#448AFF'
    }
  ],
  pieChartData:{
    title: 'sssss',
    data : [
      {name: 'Direct', value: 23},
      {name: 'Referral', value: 8},
      {name: 'Organic', value: 44},
      {name: 'Social', value: 25}
    ]
  },
  mapLocations: [
    { name:'SOMA', lat: 29.833780, lng: -95.452380 },
    { name:'Dolores park', lat: 29.760800, lng: -95.369510 },
    { name:'SomePlace', lat: 29.733890, lng: -95.512330 }
  ]
}
