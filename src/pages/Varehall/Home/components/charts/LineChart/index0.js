import React, { Component } from 'react';
import {
  AreaChart, Area,
  PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, Sector,
  ResponsiveContainer
} from 'recharts'
import { Table, Th, Thead } from 'reactable'
import ViewHeader from '../ViewHeader'
import {
  FormGroup, CardGroup, Card, CardBlock, CardTitle, Row, Button
} from 'reactstrap'

import IconDollar from 'react-icons/lib/fa/dollar'
import IconTrendUp from 'react-icons/lib/md/trending-up'
import IconFilter from 'react-icons/lib/fa/filter';
import Colors from '../../data/colors'


import FormInput from '../FormInput';
const _               = require('lodash');



const SalesDataChart = ({ data, dataKey, dataColumns }) => (
  <ResponsiveContainer>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
      <XAxis dataKey={dataKey} axisLine={false} fontSize={10} tickLine={false} padding={{ left: 0, right: 5 }} />
      <YAxis fontSize={10} axisLine={false} tickLine={false} />
      <CartesianGrid stroke="#eee" vertical={false} />
      <Tooltip wrapperStyle={{ borderColor: '#eee' }} />
      <Legend />
      {dataColumns && dataColumns.map((res, i)=>
        dataKey !=res && <Area type='monotone' dataKey={res} stackId="1" strokeWidth={2} stroke={Colors[i]} fill={Colors[i]} fillOpacity=".8" />
      )}
    </AreaChart>
  </ResponsiveContainer>
)


export default class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      filter:'',
      average: '',
      activeIndex: 0,
      newDataColumns:[]
    }
  }

  componentWillMount(){
    // const { data, dataKey } = this.props
    // this.getAverageValue(data, dataKey)
  }

  setView () {
    this.setState({
      show: !this.state.show,
    })
  }

  getFieldValue (event) {
    console.log(event.target.value)
    const { newDataColumns } = this.state
    const indexVal = newDataColumns.indexOf(event.target.value)
    console.log('indexVal',indexVal)
    if(indexVal>0)
     newDataColumns.splice(indexVal,1)
     else
    newDataColumns.push(event.target.value)

    this.setState({
      newDataColumns: event.target.value !='' ? newDataColumns : []
    },()=>{
      this.props.newDataColumns(this.state.newDataColumns)
      console.log(this.state)
    })
  }


  groupListBy (event) {

    this.setState({
      newDataKey: event.target.value !='' ? event.target.value : ''
    })
  }



  getExpectedValue (event) {
    console.log(event.target.value)
    event.target.value && this.setState({
      expectedValue: parseInt(event.target.value)
    })
  }

  getAverageValue (data, dataKey) {
    const output = _.groupBy(data, function(b) {
      if (b[dataKey]!='' && b[dataKey]!='#N/A' && typeof (b[dataKey]*1) == 'number')
      {
        return parseInt(b[dataKey])
      } else {
        return 0
      }
    })
    console.log('Voutput',Object.keys(output),Object.keys(output)[Object.keys(output).length-1])
    this.setState({
      avgValue: Math.round(Object.keys(output).reduce((a, b) => parseInt(a) + parseInt(b), 0)/(Object.keys(output).length)),
      maxValue: Object.keys(output)[Object.keys(output).length-1]*1,
      changeRate: []
    })
  }

  render () {
    const { data, title, subTitle, dataKey, dataColumns } = this.props
    const { show, filter, avgValue, maxValue, expectedValue, newDataColumns, newDataKey } = this.state

    const dataColumnVals = newDataColumns.length>0 ? newDataColumns : dataColumns

    const groupByKey =  newDataKey
      ? newDataKey
      : ''

    return (
      <Card style={{ 'flex': '3 0 0' }}>
        <CardBlock>
          <CardTitle className="text-uppercase h6">{title}</CardTitle>
          <IconFilter onClick={()=>{this.setView()}}  size="14" />
          {show && <FormGroup>
            <FormInput
              getFieldValue={this.groupListBy.bind(this)}
              type='select'
              name={'grouplistby'}
              placeholder={'Select Group By'}
              options={
                Object.keys(data[0])
              }
            />
            <FormInput
              getFieldValue={this.getFieldValue.bind(this)}
              type='multiselect'
              name={'chartname'}
              placeholder={'Select Option'}
              options={
                Object.keys(data[0])
              }
            />
          </FormGroup>}
          <div className="small mb-4 card-subtitle">{subTitle}</div>
          <div style={{width: '100%', height: '280px'}}>
            <SalesDataChart
              data={data}
              dataKey={dataKey}
              dataColumns={dataColumnVals}
            />
          </div>
        </CardBlock>

      </Card>
    )
  }
}

// export default TableOrderableComponent
