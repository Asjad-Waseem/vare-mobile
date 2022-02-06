module.exports = {
    tableName:'Load',
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
        RateCon: {
          type: 'file',
          placeholder: 'RateCon',
          required: true
        },
        EstimatedPay: {
          type: 'text',
          placeholder: 'Estimated Pay',
          required: true
        },
        PayMethod: {
          type: 'select',
          placeholder: 'PayMethod',
          required: true,
          options:[
            {name:'Factoring',value:'Factoring'},
            {name:'ACH',value:'ACH'},
            {name:'Other',value:'Other'}
          ]
        },
        Miles: {
          type: 'text',
          placeholder: 'Miles',
          required: true
        },
        LoadedMiles : {
          type: 'text',
          placeholder: 'Loaded Miles',
          required: true
        },
        UnloadedMiles: {
          type: 'text',
          placeholder: 'Unloaded Miles',
          required: true
        },
        CompanyName: {
          type: 'text',
          placeholder: 'Company Name',
          required: true
        },
        ContactPhone: {
          type: 'tel',
          placeholder: 'Contact Phone',
          required: true
        },
        ContactName: {
          type: 'text',
          placeholder: 'Contact Name',
          required: true
        },
        Pickup: {
          type: 'text',
          placeholder: 'Pickup (ex: IN)',
          required: true
        },
        Delivery: {
          type: 'text',
          placeholder: 'Delivery (ex:TX)',
          required: true
        },
        PickupDate: {
          type: 'date',
          placeholder: 'Pickup Date',
          required: true
        },
        DeliveryDate: {
          type: 'text',
          placeholder: 'Delivery Date',
          required: true
        },
        Pieces: {
          type: 'text',
          placeholder: 'Pieces',
          required: true
        },
        Weight: {
          type: 'text',
          placeholder: 'Weight',
          required: true
        }
    },
  mapLocations: [
    { name:'SOMA', lat: 29.833780, lng: -95.452380 },
    { name:'Dolores park', lat: 29.760800, lng: -95.369510 },
    { name:'SomePlace', lat: 29.733890, lng: -95.512330 }
  ]
};
