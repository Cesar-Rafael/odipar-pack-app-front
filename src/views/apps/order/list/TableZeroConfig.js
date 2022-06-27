import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'

// ** Table Columns
import { basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle } from 'reactstrap'

const DataTablesBasic = () => {
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    const response = await axios.get('http://localhost:8080/Pedido/Listar')
    const ordersResponse = response.data.map(order => {
      order.fechaHoraCreacion = moment(order.fechaHoraCreacion).format('DD/MM/YYYY HH:mm')
      return order
    })
    setOrders(ordersResponse)
  }

  useEffect(async () => {
    await getOrders()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Pedidos Registrados</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        pagination
        data={orders}
        columns={basicColumns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  )
}

export default DataTablesBasic
