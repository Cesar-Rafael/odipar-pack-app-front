import { useState, forwardRef, useImperativeHandle, Fragment, useRef } from 'react'

import { FormattedMessage } from 'react-intl'
import ExpandableTable, { columns } from './data'

import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'

//
// 5m - 1440m (24h) 35m / 3 = 12m
// 1m - 288m

// 

const DataTableWithButtons = forwardRef((props, ref) => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])

  // ** Function to handle pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.totalPackages.toLowerCase().startsWith(value.toLowerCase()) ||
          item.codigoPlaca.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.totalPackages.toLowerCase().includes(value.toLowerCase()) ||
          item.codigoPlaca.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  // pedidos
  // inicioSimulacion
  // finalizado = false o true (true)
  // 

  const getPackagesPerOffice = (orders, ubigeo) => {
    let packages = 0
    for (let order of orders) {
      if (order.idCiudadDestino === ubigeo) packages += order.cantPaquetes
    }
    return packages
  }

  const getRoutesData = async () => {
    const response = await axios.get(`http://localhost:8080/ruta/simulacion/listar`)
    if (response.data) {
      const dataResponse = response.data
      const newData = []
      for (let i = 0; i < dataResponse.length; i++) {
        const currentData = dataResponse[i]
        let totalPackages = 0

        const offices = currentData.arraySeguimiento
        const officesNames = currentData.nombreProvincias
        const times = currentData.arrayHorasLlegada
        const orders = currentData.pedidos
        const packages = getPackagesPerOffice(orders, offices[1])
        totalPackages += packages

        const routes = [{
          origin: officesNames[0],
          originTime: times[0],
          destiny: officesNames[1],
          destinyTime: times[1],
          packages
        }]

        for (let j = 1; j < offices.length - 1; j++) {
          const packages = getPackagesPerOffice(orders, offices[j + 1])
          totalPackages += packages
          routes.push({
            origin: officesNames[j],
            originTime: times[j] + 3600,
            destiny: officesNames[j + 1],
            destinyTime: times[j + 1],
            packages
          })
        }

        newData.push({
          idRuta: currentData.idRuta,
          codigoPlaca: currentData.codigoPlaca,
          totalPackages: totalPackages.toString(),
          routes
        })
      }

      setData(newData)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      getRoutesData,
    }
  })

  // ** Pagination Previous Component
  const Previous = () => {
    return (
      <Fragment>
        <span className='align-middle d-none d-md-inline-block'>
          <FormattedMessage id='Prev' />
        </span>
      </Fragment>
    )
  }

  // ** Pagination Next Component
  const Next = () => {
    return (
      <Fragment>
        <span className='align-middle d-none d-md-inline-block'>
          <FormattedMessage id='Next' />
        </span>
      </Fragment>
    )
  }

  // ** Custom Pagination Component
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={<Previous size={15} />}
      nextLabel={<Next size={15} />}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={searchValue.length ? filteredData.length / 7 : data.length / 7 || 1}
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
      containerClassName={'pagination react-paginate pagination-sm justify-content-end pr-1 mt-1'}
    />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Rutas Asignadas</CardTitle>
      </CardHeader>

      <Row className='justify-content-end mx-0'>
        <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
          <Label className='mr-1' for='search-input-1'>
            <FormattedMessage id='Search' />
          </Label>
          <Input
            className='dataTable-filter mb-50'
            type='text'
            bsSize='sm'
            id='search-input-1'
            value={searchValue}
            onChange={handleFilter}
          />
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        expandableRows
        selectableRowsNoSelectAll
        columns={columns}
        className='react-dataTable'
        paginationPerPage={7}
        expandOnRowClicked
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        expandableRowsComponent={<ExpandableTable />}
        paginationComponent={CustomPagination}
        data={searchValue.length ? filteredData : data}
      />
    </Card>
  )
})

export default DataTableWithButtons
