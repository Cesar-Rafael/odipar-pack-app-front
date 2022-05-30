import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Table Columns
import { basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle } from 'reactstrap'

const DataTablesBasic = () => {
  const [offices, setOffices] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/Oficina/').then(response => {
      setOffices(response.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Oficinas Registradas</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        pagination
        data={offices}
        columns={basicColumns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  )
}

export default DataTablesBasic
