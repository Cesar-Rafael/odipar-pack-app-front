import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Table Columns
import { basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle } from 'reactstrap'

const DataTablesBasic = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/api/Pedido').then(response => {
      console.log(response.data)
      setOrders(response.data)
      console.log(orders)
    })
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
