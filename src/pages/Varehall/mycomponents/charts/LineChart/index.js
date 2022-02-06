import React, { Component } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
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
import getSelectValues from '../getSelectValues';



import FormInput from '../FormInput';
const _               = require('lodash');

const shuffle = (array) => {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

const SalesDataChart = ({ data, dataKey, dataColumns, chartType }) => (
  <ResponsiveContainer>
    {chartType=='Bar'
      ? <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <XAxis dataKey={dataKey} axisLine={false} fontSize={10} tickLine={false} padding={{ left: 0, right: 5 }} />
        <YAxis fontSize={10} axisLine={false} tickLine={false} />
        <CartesianGrid stroke="#eee" vertical={false} />
        <Tooltip wrapperStyle={{ borderColor: '#eee' }} />
        <Legend />
        {dataColumns && dataColumns.map((res, i)=>
          dataKey !=res && <Bar type='monotone' dataKey={res} stackId="1" strokeWidth={2} stroke={Colors[i]} fill={Colors[i]} fillOpacity=".8" />
        )}
      </BarChart>
      : chartType=='Line'
        ? <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey={dataKey} axisLine={false} fontSize={10} tickLine={false} padding={{ left: 0, right: 5 }} />
          <YAxis fontSize={10} axisLine={false} tickLine={false} />
          <CartesianGrid stroke="#eee" vertical={false} />
          <Tooltip wrapperStyle={{ borderColor: '#eee' }} />
          <Legend />
          {dataColumns && dataColumns.map((res, i)=>
            dataKey !=res && <Line type='monotone' dataKey={res} stackId="1" strokeWidth={2} stroke={Colors[i]} fill={Colors[i]} fillOpacity=".8" />
          )}
        </LineChart>
        : <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey={dataKey} axisLine={false} fontSize={10} tickLine={false} padding={{ left: 0, right: 5 }} />
          <YAxis fontSize={10} axisLine={false} tickLine={false} />
          <CartesianGrid stroke="#eee" vertical={false} />
          <Tooltip wrapperStyle={{ borderColor: '#eee' }} />
          <Legend />
          {dataColumns && dataColumns.map((res, i)=>
            dataKey !=res && <Area type='monotone' dataKey={res} stackId="1" strokeWidth={2} stroke={Colors[i]} fill={Colors[i]} fillOpacity=".8" />
          )}
        </AreaChart>}
  </ResponsiveContainer>
)


export default class LineChartCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      filter:'',
      average: '',
      activeIndex: 0,
      newDataColumns:[],
      chartType:''
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
    const myColum = getSelectValues(event)
    this.setState({
      newDataColumns: myColum
    },()=>{
      this.props.newDataColumns(this.state.newDataColumns)
      console.log(this.state)
    })
  }


  groupListBy (event) {

    this.setState({
      newDataKey: event.target.value
    },()=>{

      const groupName = this.state.newDataKey
      console.log(groupName)
      const { data, dataColumns, dataKey } = this.props
      const { newDataColumns } = this.state
      let oldData = data
      const output = _.groupBy(oldData, function(b) {
        if (b[groupName]!=undefined && b[groupName]!='' && b[groupName]!='#N/A')
        {
          return b[groupName]
        }
      })
      const columInfo = newDataColumns && newDataColumns.length > 0
        ? newDataColumns : dataColumns

      console.log('groupName',groupName)
      console.log('columInfo',columInfo)
      console.log('output',output)

      const result = []
      output
      && Object.keys(output).map(res => {
        const newObject = {}
        output[res] && columInfo.map(info => {
          newObject[groupName] = res
          newObject[info] = _.sumBy(output[res], info)
           &&  _.sumBy(output[res], info) != ''
           &&  _.sumBy(output[res], info) != undefined
            ? _.sumBy(output[res], info) : 0
        })
        result.push(newObject)
      })
      console.log('free', result)

      this.setState({
        newData: groupName
          ? result : []
      })
    })
  }


  getChartType (event) {
    console.log(event.target.value)
    this.setState({
      chartType: event.target.value
        ? event.target.value : ''
    }, () => {
      console.log('getChartType',this.state)
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
    const {
      show
      , filter
      , avgValue
      , maxValue
      , expectedValue
      , newDataColumns
      , newDataKey
      , newData
      , chartType
    } = this.state

    const dataColumnVals = newDataColumns
    && newDataColumns.length>0
      ? newDataColumns
      : dataColumns
      console.log('newDataColumns',newDataColumns)
          console.log('dataColumns',dataColumns)

    const groupByKey =  newDataKey
      ? newDataKey
      : dataKey
    console.log('newDataKey',newDataKey)
        console.log('groupByKey',groupByKey)


    const updatedData =  newData && newData.length > 0
      ? newData
      : data
      console.log('newData',newData)
          console.log('data',data)

    return (
      <Card style={{ 'flex': '3 0 0' }}>
        <CardBlock>
          <CardTitle className="text-uppercase h6">
          {title}
          </CardTitle>
          <FormInput
            getFieldValue={this.getChartType.bind(this)}
            type='select'
            name={'grouplistby'}
            placeholder={'Select Chart Type'}
            options={
              ['Area','Line','Bar']
            }
          />
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
              newDataKey={newDataKey}
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
              chartType={chartType}
              data={updatedData}
              dataKey={groupByKey}
              dataColumns={dataColumnVals}
            />
          </div>
        </CardBlock>

      </Card>
    )
  }
}

// export default TableOrderableComponent
