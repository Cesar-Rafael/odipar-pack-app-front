// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Table Columns
import { multiLingColumns } from '../data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import DataTable from 'react-data-table-component'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  Label,
  Alert,
  Row
} from 'reactstrap'

import axios from 'axios'
import moment from 'moment'

import API_URL from '../../config'

const DataTableWithButtons = () => {
  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])
  const [blocks, setBlocks] = useState([])
  const [registered, setRegistered] = useState(false)

  const registerBlocks = async (event) => {
    event.preventDefault()

    const response = await axios.post(`${API_URL}/Bloqueo/PostBloqueos`, blocks)
    if (response.data) {
      setRegistered(true)
      setBlocks([])
      setTimeout(() => {
        setRegistered(false)
      }, 3500)
    }

    await getBlocks()
  }

  const readBlocksFile = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (e) => {
      let bloques = []
      const text = e.target.result
      const line = text.split('\n')
      for (let i = 0; i < line.length; i++) {
        const d = new Date()
        const part = line[i].split(" ")
        const bloqueo = { id: 0, fechaInicio: d, fechaFin: d, ubigeoInicio: 0, ubigeoFin: 0 }
        bloqueo.ubigeoInicio = parseInt(part[0])
        const parts = part[2].split(";")
        bloqueo.ubigeoFin = parseInt(parts[0])
        const fechas = parts[1].split("==")
        const dia1 = fechas[0].split(",")
        const dia2 = fechas[1].split(",")
        const mes = parseInt(dia1[0]) / 100
        const dia = parseInt(dia1[0]) % 100
        d.setMonth(Math.floor(mes) - 1)
        d.setDate(dia)
        const horas = dia1[1].split(":")
        d.setHours(parseInt(horas[0]), parseInt(horas[1]))
        bloqueo.fechaInicio = d
        const d2 = new Date()
        mes = parseInt(dia2[0]) / 100
        dia = parseInt(dia2[0]) % 100
        d2.setMonth(Math.floor(mes) - 1)
        d2.setDate(dia)
        horas = dia2[1].split(":")
        d2.setHours(parseInt(horas[0]), parseInt(horas[1]))
        bloqueo.fechaFin = d2
        bloques = [...bloques, bloqueo]
      }

      e.target.value = null

      setBlocks(bloques)
    }
    
    reader.readAsText(e.target.files[0])
  }

  const getBlocks = async () => {
    const response = await axios.get(`${API_URL}/Bloqueo/`)
    setData(response.data.map(block => {
      block.fechaInicio = moment(block.fechaInicio).format('DD/MM/YYYY HH:mm')
      block.fechaFin = moment(block.fechaFin).format('DD/MM/YYYY HH:mm')
      block.ubigeoInicio = block.ubigeoInicio.toString()
      block.ubigeoFin = block.ubigeoFin.toString()
      return block
    }))
  }

  useEffect(async () => {
    await getBlocks()

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
          item.fechaInicio.toLowerCase().startsWith(value.toLowerCase()) ||
          item.fechaFin.toLowerCase().startsWith(value.toLowerCase()) ||
          item.ubigeoFin.toLowerCase().startsWith(value.toLowerCase()) ||
          item.ubigeoInicio.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.fechaInicio.toLowerCase().includes(value.toLowerCase()) ||
          item.fechaFin.toLowerCase().includes(value.toLowerCase()) ||
          item.ubigeoFin.toLowerCase().includes(value.toLowerCase()) ||
          item.ubigeoInicio.toLowerCase().includes(value.toLowerCase())

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
    <Fragment>
      <Col xs='9'>
        <FormGroup>
          <Label for='inputFile'>Carga de Bloqueos Masivo</Label>
          <Input type='file' id='inputFile' name='fileInput' onChange={readBlocksFile} />
        </FormGroup>
      </Col>

      <Col xs='3' className='text-right'>
        <FormGroup className='mb-1' row>
          <Col className='d-flex' md={{ size: 9, offset: 3 }}>
            <Button.Ripple className='mr-1' color='primary' type='submit' onClick={registerBlocks}>
              Registrar
            </Button.Ripple>
          </Col>
        </FormGroup>
      </Col>

      <Col xs='12'>
        {blocks.length ? <FormGroup row>
          <Col xs='4' className='text-center'>
            <Alert color='info'>
              <h4 className='alert-heading'>Cantidad de Bloqueos: {blocks.length}</h4>
            </Alert>
          </Col>
        </FormGroup> : ''}

        {registered ? <FormGroup row>
          <Col xs='4' className='text-center ml-2'>
            <Alert color='success'>
              <h4 className='alert-heading'>Bloqueos Registrados Exitosamente</h4>
            </Alert>
          </Col>
        </FormGroup> : ''}
      </Col>

      <Col xs='12'>
        <Card>
          <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>Bloqueos Registrados</CardTitle>
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
      </Col>
    </Fragment>
  )
}

export default DataTableWithButtons