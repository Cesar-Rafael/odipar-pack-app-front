import { useState, Fragment, useEffect } from 'react'

import { FormattedMessage } from 'react-intl'
import ExpandableTable, { columns } from './dataRutas'

import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Row, Col, Label, Input, Button } from 'reactstrap'

import axios from 'axios'
import API_URL from '../../config'
import moment from 'moment'

const DataTableWithButtons = ({ id }) => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])

  useEffect(async () => {
    await getRoutesData()
    return () => {
      setData([])
    }
  }, [])

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

  const getPackagesPerOffice = (orders, partialOrders, ubigeo) => {
    let packages = 0
    for (let order of partialOrders) {
      const orderRespective = orders.find(o => o.id === order.idPedido)
      if (orderRespective.idCiudadDestino === ubigeo) packages += order.cantPaquetes
    }
    return packages
  }

  const getRoutesData = async () => {
    const response = await axios.get(`${API_URL}/ruta/ListarRutasxIdVehiculoDiaDia/${id}`)
    if (response.data) {
      const dataResponse = response.data
      const newData = []
      const currentTime = moment().unix()

      for (let i = 0; i < dataResponse.length; i++) {
        const times = dataResponse[i].arrayHorasLlegada;

        if (times[0] <= currentTime && currentTime <= times.slice(-1)) {
          const currentData = dataResponse[i]
          let totalPackages = 0

          const offices = currentData.arraySeguimiento
          const officesNames = currentData.nombreProvincias
          const times = currentData.arrayHorasLlegada
          const orders = currentData.pedidos
          const partialOrders = currentData.pedidosParciales
          const packages = getPackagesPerOffice(orders, partialOrders, offices[1])
          const officesTraveled = []

          officesTraveled.push(offices[1])
          totalPackages += packages

          const routes = [{
            origin: officesNames[0],
            originTime: times[0],
            destiny: officesNames[1],
            destinyTime: times[1],
            packages
          }]

          for (let j = 1; j < offices.length - 1; j++) {
            const packages = officesTraveled.includes(offices[j + 1]) ? 0 : getPackagesPerOffice(orders, partialOrders, offices[j + 1])
            totalPackages += packages
            officesTraveled.push(offices[j + 1])

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

          break
        }
      }

      setData(newData)
    }
  }

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
        <Col xs=''>
          <CardTitle tag='h4'>Rutas Asignadas</CardTitle>
        </Col>

        <Col xs='6' className='text-right'>
          <Button color='primary' onClick={getRoutesData}>Actualizar</Button>
        </Col>
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
        paginationPerPage={10}
        expandOnRowClicked
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        expandableRowsComponent={<ExpandableTable />}
        paginationComponent={CustomPagination}
        data={searchValue.length ? filteredData : data}
      />
    </Card>
  )
}

export default DataTableWithButtons
