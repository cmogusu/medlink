import React, { Component } from 'react'
import camelCase from 'lodash/camelCase'
import { Table, Row, Col, InputNumber } from 'antd'
import { CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import './App.css'


const titles = [
  'Total collected Month',
  'Total Payroll',
  'Total Rent Payment',
  'Total Lab Charges',
  'Total Utilities (Electric/Water)',
  'Total Malpractice Insurance',
  'Total Employee Healthcare Premium',
  'Total SSI payment',
  'Total Medicare Payment',
  'Clinical Supply Expense',
  'Clerical Supply Expense',
  'Professional Services Expense',
  'Equipment (Lease or Own)',
  'Convention/Seminar/Travel Expense',
  'Advertising Expense',
  'Automobile Expense',
  'Total Utilities (Phone/Internet)',
]


const getTotal = data =>
  Object.values(data).reduce(
    (sum, value) => sum + value,
    0,
  )

const getDataSource = titles =>
  titles.map(title => ({
    key: camelCase(title),
    name: title,
  }))

const getValues = titles => {
  const obj = {}
  titles.forEach(title => {
    const key = camelCase(title)
    obj[key] = 0
  })
  return obj
}

const inputValueFormatter = value =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const inputValueParser = value => {
  const stringValue = value.replace(/\$\s?|(,*)/g, '')
  const numericValue = parseInt(stringValue, 10)
  return Number.isNaN(numericValue) ? 0 : numericValue
}

class App extends Component {
  state = {
    data: getValues(titles),
    totalExpenses: 0,
    totalCollected: 0,
  }

  constructor(props) {
    super(props)
    this.renderFooter = this.renderFooter.bind(this)
    this.handleTotalIncomeChange = this.handleTotalIncomeChange.bind(this)
  }

  columns = [
    {
      width: '50%',
      title: 'Expense',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: '50%',
      title: 'Amount in US Dollars',
      dataIndex: 'value',
      key: 'value',
      render: (_, item) => {
        const { key } = item
        const value = this.state.data[key]
        return (
          <span>
            <InputNumber
              className="table__input"
              formatter={inputValueFormatter}
              parser={inputValueParser}
              placeholder="0.00"
              value={value}
              onChange={this.handleOnChange(key)}
            />
          </span>
        )
      }
    },
  ]

  getTextAndIcon(percentageExpenses) {
    let Icon = () => null
    let color = ''
    if (!percentageExpenses) return '0 %'

    if (percentageExpenses >= 90) {
      Icon = ExclamationCircleOutlined
      color = 'red'
    } else if (percentageExpenses >= 70) {
      Icon = WarningOutlined
      color = '#faad14'
    } else if (percentageExpenses >= 50) {
      Icon = CheckCircleOutlined
      color = 'green'
    }

    return (
      <>
        <span style={{ color }}>
          {percentageExpenses.toFixed(2)} %
        </span>
        {' '}
        <Icon style={{ color }} />
      </>
    )
  }

  renderFooter() {
    const { totalExpenses, totalCollected } = this.state
    const expensesToIncomeRatio = totalExpenses / totalCollected
    const percentageExpenses = !Number.isNaN(expensesToIncomeRatio) && Number.isFinite(expensesToIncomeRatio)
      ? expensesToIncomeRatio * 100
      : 0

    return (
      <div className="totals">
        <Row className="totals__row1" gutter={20}>
          <Col span={12}>
            <span>Total expenses: </span>
          </Col>
          <Col span={12}>
            <span>$ {totalExpenses}</span>
          </Col>
        </Row>

        <Row className="totals__row2" gutter={20}>
          <Col span={12}>
            <span>Percentage Expenses: </span>
          </Col>
          <Col span={12}>
            {this.getTextAndIcon(percentageExpenses)}
          </Col>
        </Row>
      </div>
    )
  }

  handleOnChange = key => value => {
    const numericValue = value === ''
      ? 0
      : parseInt(value, 10)
    this.updateData(key, numericValue)
  }

  updateData(key, value) {
    this.setState(prevState => {
      const data = {
        ...prevState.data,
        [key]: value,
      }
      const totalExpenses = getTotal(data)
      return { data, totalExpenses }
    })
  }

  handleTotalIncomeChange(totalCollected) {
    this.setState({ totalCollected })
  }

  render() {
    const { totalCollected } = this.state
    return (
      <div className="table-container">
        <h1 className="table-container__title">Quick Survey Form</h1>
        <p>
          Please fill in the fields below
        </p>
        <hr />
        <Row gutter={20}>
          <Col className="total-income" sm={24} md={8}>
            <div className="total-income__floating">
              <Row>
                <Col span={8}>Total collected: </Col>
                <Col span={16}>
                  <InputNumber
                    className="total-income__input"
                    formatter={inputValueFormatter}
                    parser={inputValueParser}
                    placeholder="Total income"
                    value={totalCollected}
                    onChange={this.handleTotalIncomeChange}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm={24} md={16}>
            <Table
              bordered
              className="table"
              columns={this.columns}
              dataSource={getDataSource(titles)}
              footer={this.renderFooter}
              pagination={false}
              onCell={this.handleOnCell}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default App
