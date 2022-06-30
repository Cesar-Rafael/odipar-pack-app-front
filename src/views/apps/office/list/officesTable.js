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
import API_URL from '../../config'

const DataTableWithButtons = () => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])

  const getOffices = async () => {
    const response = await axios.get(`${API_URL}/Oficina/Listar`)
    setData(response.data.map(office => {
      office.ubigeo = office.ubigeo.toString()
      office.tipo = office.esPrincipal ? 'ALMACEN' : 'OFICINA'
      delete office.esPrincipal
      return office
    }))
  }

  useEffect(async () => {
    await getOffices()

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
      ALMACEN: { title: 'Almacén', color: 'light-primary' },
      OFICINA: { title: 'Oficina', color: 'light-info' }
    }

    const statusRegion = {
      COSTA: { title: 'Costa', color: 'light-warning' },
      SIERRA: { title: 'Sierra', color: 'light-info' },
      SELVA: { title: 'Selva', color: 'light-success' }
    }

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith =
          item.ubigeo.toLowerCase().startsWith(value.toLowerCase()) ||
          item.departamento.toLowerCase().startsWith(value.toLowerCase()) ||
          item.provincia.toLowerCase().startsWith(value.toLowerCase()) ||
          status[item.tipo].title.toLowerCase().startsWith(value.toLowerCase())
          statusRegion[item.region].title.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.ubigeo.toLowerCase().includes(value.toLowerCase()) ||
          item.departamento.toLowerCase().includes(value.toLowerCase()) ||
          item.provincia.toLowerCase().includes(value.toLowerCase()) ||
          status[item.tipo].title.toLowerCase().includes(value.toLowerCase())
          statusRegion[item.region].title.toLowerCase().includes(value.toLowerCase())

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
        <CardTitle tag='h4'>Oficinas Registrados</CardTitle>
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