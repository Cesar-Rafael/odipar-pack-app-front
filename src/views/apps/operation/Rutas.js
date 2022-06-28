// ** React Imports
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

// ** Table columns & Expandable Data
import ExpandableTable, { columns } from './data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle } from 'reactstrap'

import axios from 'axios'

const DataTableWithButtons = forwardRef((props, ref) => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])

  // ** Function to handle filter
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const getRoutesData = async () => {
    const response = await axios.get(`http://localhost:8080/ruta/simulacion/listar`)
    if (response.data) {
      const data = response.data.map(route => {
        let cantPaquetes = 0
        const pedidosPorOficina = Array(route.arraySeguimiento.length).fill(0)

        for (let pedido of route.pedidos) {
          cantPaquetes += pedido.cantPaquetes
          pedidosPorOficina[route.arraySeguimiento.findIndex(office => office === pedido.idCiudadDestino)] += pedido.cantPaquetes
        }

        route.cantPaquetes = cantPaquetes
        route.pedidosPorOficina = pedidosPorOficina
        return route
      })
      setData(data)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      getRoutesData,
    }
  })

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={10}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={'active'}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName='page-item'
      breakLinkClassName='page-link'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1'}
    />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Rutas Asignadas</CardTitle>
      </CardHeader>
      <DataTable
        noHeader
        pagination
        data={data}
        expandableRows
        columns={columns}
        expandOnRowClicked
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        expandableRowsComponent={<ExpandableTable />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationComponent={CustomPagination}
      />
    </Card>
  )
})

export default DataTableWithButtons
