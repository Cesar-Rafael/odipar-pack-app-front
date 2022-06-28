// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Table Columns
import { multiLingColumns } from '../data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col } from 'reactstrap'

import axios from 'axios'
import moment from 'moment'
import API_URL from '../../config'

const DataTableWithButtons = () => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])

  const getVehicles = async () => {
    const response = await axios.get(`${API_URL}/UnidadTransporte/Listar/Operaciones`)
    setData(response.data.map(order => {
      order.fechaMantenimiento = moment(order.fechaMantenimiento).format('DD/MM/YYYY HH:mm')
      order.capacidadTotal = order.capacidadTotal.toString()
      order.capacidadDisponible = order.capacidadDisponible.toString()
      order.oficinaActual = order.oficinaActual.toString()
      return order
    }))
  }

  useEffect(async () => {
    await getVehicles()

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

    const status = {
      DISPONIBLE: { title: 'Disponible', color: 'light-success' },
      RESERVADO: { title: 'Reservado', color: 'light-primary' },
      EN_TRANSITO: { title: 'En Tránsito', color: 'light-info' },
      AVERIADO: { title: 'Averiado', color: 'light-danger' },
      EN_MANTENIMIENTO: { title: 'En Mantenimiento', color: 'light-danger' },
    }

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.codigo.toLowerCase().startsWith(value.toLowerCase()) ||
          item.capacidadTotal.toLowerCase().startsWith(value.toLowerCase()) ||
          item.capacidadDisponible.toLowerCase().startsWith(value.toLowerCase()) ||
          item.oficinaActual.toLowerCase().startsWith(value.toLowerCase()) ||
          item.fechaMantenimiento.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.estado].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.codigo.toLowerCase().includes(value.toLowerCase()) ||
          item.capacidadTotal.toLowerCase().includes(value.toLowerCase()) ||
          item.capacidadDisponible.toLowerCase().includes(value.toLowerCase()) ||
          item.oficinaActual.toLowerCase().includes(value.toLowerCase()) ||
          item.fechaMantenimiento.toLowerCase().includes(value.toLowerCase()) ||
          status[item.estado].title.toLowerCase().includes(value.toLowerCase())

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
      <CardHeader className='border-bottom'>
        <CardTitle tag='h4'>Vehiculos Registrados</CardTitle>
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
        selectableRowsNoSelectAll
        columns={multiLingColumns}
        className='react-dataTable'
        paginationPerPage={7}
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        paginationComponent={CustomPagination}
        data={searchValue.length ? filteredData : data}
      />
    </Card>
  )
}

export default DataTableWithButtons
