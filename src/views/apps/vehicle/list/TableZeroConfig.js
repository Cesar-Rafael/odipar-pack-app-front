import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Table Columns
import { basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle } from 'reactstrap'

const DataTablesBasic = () => {
  const [vehicules, setVehicules] = useState([])

  // useEffect(() => {
  //   axios.get('http://localhost:8080/UnidadTransporte/').then(response => {
  //     setVehicules(response.data)
  //   })
  // }, [])

  axios.get('/UnidadTransporte/Listar/Operaciones').then(response => {
      setVehicules(response.data)
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Vehículos Registrados</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        pagination
        data={vehicules}
        columns={basicColumns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  )
}

export default DataTablesBasic
