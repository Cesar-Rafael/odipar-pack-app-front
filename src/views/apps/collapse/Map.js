import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button, Spinner, FormGroup, Input, Label, Progress, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Vehicule from './Vehicule'
import DataUpload from './DataUpload'
import TableExpandable from './Rutas'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Legend from './Legend'
import API_URL from './../config'

const MapView = () => {
  // Parámetros:
  const zoom = 5.5
  const position = [-12.51, -76.79]

  const totalVehicules = 45

  // Referencias
  const idTimeSimulation = useRef(0)
  const coordenatesPerOffice = useRef({})
  const ordersReference = useRef([])
  const vehiculesReferences = useRef([])
  const startTimeSimulation = useRef(false)
  const currentTimeSimulationRef = useRef(false)
  const timeUpdate = useRef(480)
  const routesTableRef = useRef()
  const ordersTimeToAttend = useRef(0)
  const ordersTimeToCall = useRef(1)
  const currentDateToAttend = useRef()
  const currentDateToCall = useRef()
  const isPaused = useRef(false)
  const totalOrdersAttended = useRef(0)
  const numberExecutionCollapse = useRef(null)

  const vehiculesReferencesAux = []
  for (let i = 0; i < totalVehicules; i++) vehiculesReferencesAux.push(useRef())
  vehiculesReferences.current = vehiculesReferencesAux

  // Estados
  const [currentTimeSimulation, setCurrentTimeSimulation] = useState(false)
  const [offices, setOffices] = useState([])
  const [vehicules, setVehicules] = useState([])
  const [edgePositions, setEdgesPositions] = useState([])
  const [showButton, setShowButton] = useState(true)
  const [showLoaderButton, setShowLoaderButton] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [blocks, setBlocks] = useState([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [map, setMap] = useState(null)
  const [simulationFinished, setSimulationFinished] = useState(false)
  const [simulationStopped, setSimulationStopped] = useState(false)
  const [report, setReport] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const getOffices = async () => {
    const response = await axios.get(`${API_URL}/Oficina/Listar`)
    const officesResponse = response.data
    setOffices(officesResponse)
    for (const office of officesResponse) {
      coordenatesPerOffice.current[office.ubigeo] = { latitud: office.latitud, longitud: office.longitud }
    }
  }

  const getVehicules = async () => {
    const response = await axios.get(`${API_URL}/UnidadTransporte/Listar/Simulacion`)
    const vehiculesResponse = response.data
    setVehicules(vehiculesResponse)
  }

  const getBlocks = async (startDate, endDate) => {
    const response = await axios.post(`${API_URL}/bloqueo/listar_por_fechas`, { inicio: startDate, fin: endDate })

    const listBlocks = response.data
    const positions = []

    for (const block of listBlocks) {
      const origin = coordenatesPerOffice.current[block.ubigeoInicio]
      const destiny = coordenatesPerOffice.current[block.ubigeoFin]
      positions.push([[origin.latitud, origin.longitud], [destiny.latitud, destiny.longitud]])
    }

    setBlocks(positions)
  }

  const endSimulation = async () => {
    clearInterval(idTimeSimulation.current)
    setSimulationFinished(true)
    /*
    for (let vehiculeReference of vehiculesReferences.current) {
      vehiculeReference.current.stopSimulation()
    }*/
  }

  useEffect(async () => {
    await getOffices()
    await getVehicules()
    axios.get(`${API_URL}/simulacion/reiniciar`)

    return async () => {
      await endSimulation()
      setOffices([])
      setVehicules([])
      setEdgesPositions([])
      setBlocks([])
      console.log('Unmounted')
    }
  }, [])

  const setOrders = orders => {
    ordersReference.current = orders
    setOrdersTotal(orders.length)
  }

  const updateEdges = async () => {
    const response = await axios.get(`${API_URL}/TramosUsadosSimulacion/`)
    const listEdges = response.data
    const positions = []

    for (const edge of listEdges) {
      const origin = coordenatesPerOffice.current[edge.idCiudadI]
      const destiny = coordenatesPerOffice.current[edge.idCiudadJ]
      positions.push([[origin.latitud, origin.longitud], [destiny.latitud, destiny.longitud]])
    }

    setEdgesPositions(positions)
  }

  const getOrdersToAttend = () => {
    const ordersToAttend = []
    const startDate = moment.unix(currentDateToAttend.current).subtract(12, 'hours')
    const endDate = moment.unix(currentDateToAttend.current)
    for (let order of ordersReference.current) {
      const dateOrder = moment(order.fechaHoraCreacion)
      if (startDate <= dateOrder && dateOrder <= endDate) ordersToAttend.push(order)
    }
    getBlocks(startDate.toDate(), endDate.toDate())
    ordersTimeToAttend.current++
    currentDateToAttend.current = endDate.add(12, 'hours').unix()
    totalOrdersAttended.current += ordersToAttend.length
    return ordersToAttend
  }

  const updateRoutes = () => {
    ordersTimeToCall.current++
    routesTableRef.current.getRoutesData(currentDateToCall.current)

    for (let vehiculeReference of vehiculesReferences.current) {
      vehiculeReference.current.addRoutes(currentDateToCall.current)
    }

    updateEdges()
  }

  const callAlgorithm = async () => {
    while (true) {
      const payload = {
        inicioSimulacion: moment.unix(currentDateToAttend.current).toDate(),
        pedidos: getOrdersToAttend(),
      }

      const response = await axios.post(`${API_URL}/ABCS/`, payload)
      if (response.data) {
        numberExecutionCollapse.current = ordersTimeToAttend.current
        console.log(`COLAPSO en corrida n° ${ordersTimeToAttend.current}`)
        break
      } else {
        console.log(`Corrida n° ${ordersTimeToAttend.current} exitosa`)
      }
    }
  }

  const getReport = async () => {
    const response = await axios.get(`${API_URL}/SimulacionReporte`)
    setReport({
      ...response.data, ordersTotal: totalOrdersAttended.current
    })
    setIsOpen(true)
  }

  const startSimulation = async () => {
    if (ordersReference.current.length === 0) {
      alert('Cargue un archivo de pedidos')
      return
    }

    setShowButton(false)
    setShowLoaderButton(true)

    // Empieza a las 00:00 horas y va avanzando cada 8 horas
    startTimeSimulation.current = moment(new Date()).set({ 'hour': 12, 'minute': 0, 'second': 0 })
    currentDateToAttend.current = moment(startTimeSimulation.current).unix()
    currentDateToCall.current = moment(startTimeSimulation.current).add(12, 'hours').unix()

    setCurrentTimeSimulation(moment(startTimeSimulation.current))
    currentTimeSimulationRef.current = moment(startTimeSimulation.current)

    timeUpdate.current *= speed

    const payload = {
      inicioSimulacion: moment.unix(currentDateToAttend.current).toDate(),
      pedidos: getOrdersToAttend()
    }

    await axios.post(`${API_URL}/ABCS/`, payload)

    callAlgorithm()

    updateEdges()
    routesTableRef.current.getRoutesData(currentDateToCall.current)

    for (let vehiculeReference of vehiculesReferences.current) {
      vehiculeReference.current.startSimulation(speed, currentDateToCall.current)
    }

    setShowLoaderButton(false)

    idTimeSimulation.current = setInterval(async () => {
      if (!isPaused.current) {
        currentTimeSimulationRef.current.add(timeUpdate.current, 'seconds')
        setCurrentTimeSimulation(currentTime => moment(currentTime).add(timeUpdate.current, 'seconds'))
        const currentTimeSeconds = currentTimeSimulationRef.current.unix()

        if (currentTimeSeconds >= currentDateToCall.current) {
          if (numberExecutionCollapse.current !== ordersTimeToCall.current) {
            stopSimulation()
            updateRoutes()
            currentDateToCall.current = moment.unix(currentDateToCall.current).add(12, 'hours').unix()
            resumeSimulation()
          } else {
            await getReport()
            endSimulation()
          }
        }
      }
    }, 1000)
  }

  const setSpeedValue = (e) => {
    setSpeed(e.currentTarget.value)
  }

  const stopSimulation = async () => {
    isPaused.current = true
    setSimulationStopped(true)
  }

  const resumeSimulation = async () => {
    isPaused.current = false
    setSimulationStopped(false)
  }

  return (
    <Card>
      <CardHeader>
        <Col xs='4'>
          <CardTitle tag='h3'>
            <b>Colapso Logístico</b>
          </CardTitle>
        </Col>
        {
          showButton ?
            <Col xs='8' className='text-right'>
              <Button color='primary' onClick={startSimulation}>Iniciar Simulacion</Button>
            </Col> : ''}
        {
          showLoaderButton ?
            <Col xs='8' className='text-right'>
              <Button.Ripple color='primary' outline disabled>
                <Spinner size='sm' />
                <span className='ml-50'>Calculando...</span>
              </Button.Ripple>
            </Col> : ''
        }
        {
          !showButton && !showLoaderButton && !simulationFinished ?
            <Col xs='8' className='text-right'>
              <Button className='mr-2' color='primary' onClick={stopSimulation} disabled={simulationStopped}>Pausar Simulacion</Button>
              <Button color='info' onClick={resumeSimulation} disabled={!simulationStopped}>Reanudar Simulacion</Button>
            </Col>
            : ''
        }
        {
          simulationFinished ?
            <Col xs='8' className='text-right'>
              <Button color='success' onClick={getReport}>Consultar Reporte</Button>
            </Col>
            : ''
        }
      </CardHeader>
      <CardBody>
        <Row>
          <Col md='6'>
            <Row>
              <Col xs='12'>
                <MapContainer center={position} zoom={zoom} className='leaflet-map' style={{ height: "100vh" }} scrollWheelZoom={true}
                  whenCreated={setMap}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {offices.map((office, idx) => {
                    return (<CircleMarker key={`office-${idx}`} center={[office.latitud, office.longitud]} radius={office.esPrincipal ? 6 : 4} weight={office.esPrincipal ? 6 : 5} color={office.esPrincipal ? '#C72E30' : '#6E5600'} fillColor={office.esPrincipal ? '#C72E30' : '#6E5600'}>
                      <Popup>
                        <b>Ubigeo: </b> {office.ubigeo} <br />
                        <b>Region: </b> {office.region} <br />
                        <b>Departamento: </b> {office.departamento} <br />
                        <b>Provincia: </b> {office.provincia} <br />
                        <b>Latitud: </b> {office.latitud} <br />
                        <b>Longitud: </b> {office.longitud} <br />
                      </Popup>
                    </CircleMarker>)
                  })}

                  {vehicules.map((vehicule, idx) => <Vehicule key={`vehicule-${idx}`} vehicule={vehicule} offices={coordenatesPerOffice.current} ref={vehiculesReferences.current[idx]} />)}

                  {edgePositions.map((position, idx) => {
                    return (<Polyline key={`edge-${idx}`} positions={position} color={'#7F7F7F'} weight={1.25} />)
                  })}

                  {blocks.map((position, idx) => {
                    return (<Polyline key={`block-${idx}`} positions={position} color={'#A12C22'} weight={0.5} />)
                  })}

                  <Legend map={map} />

                </MapContainer>
              </Col>
            </Row>
          </Col>

          <Col md='6'>
            <Row>
              <Col xs='6'>
                <DataUpload loadOrders={setOrders} offices={offices} />
              </Col>
              <Col xs='6'>
                <FormGroup check inline>
                  <b className='mr-2'>Velocidad:</b>
                  <Label check>
                    <Input type='radio' name='speed' value={1} defaultChecked onChange={setSpeedValue} /> x1.0
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input type='radio' name='speed' value={2} onChange={setSpeedValue} /> x2.0
                  </Label>
                </FormGroup>
                {
                  /*
                  <FormGroup check inline>
                    <Label check>
                      <Input type='radio' name='speed' value={3} onChange={setSpeedValue} /> x3.0
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <b className='mr-2'>Cantidad de Pedidos:</b>
                    {ordersTotal}
                  </FormGroup>
                  */
                }

              </Col>
              <Col xs='6'>
                <b>Inicio:</b> <br />
                {startTimeSimulation.current ? startTimeSimulation.current.format('DD/MM h:mm a') : '-'}
              </Col>
              <Col xs='6'>
                <b>Avance:</b> <br />
                <b style={{ fontSize: 18, borderStyle: 'dotted' }}>
                  {currentTimeSimulation ? currentTimeSimulation.format('DD/MM h:mm a') : '-'}
                </b>
              </Col>
              <Col xs='12'>
                <TableExpandable key='table-1' ref={routesTableRef} />
              </Col>
            </Row>
          </Col>
        </Row>

      </CardBody>
      {
        isOpen ?
          <Modal
            isOpen={isOpen}
            className='modal-dialog-centered'
            modalClassName={'modal-success'}
          >
            <ModalHeader>Colapso Alcanzado</ModalHeader>
            <ModalBody>
              <b>Fecha de Colapso: </b> {currentTimeSimulation.format('DD/MM h:mm a')} <hr></hr>
              <b>Días de simulación: </b> {numberExecutionCollapse.current / 2} <hr></hr>
              <b>Cantidad de Pedidos Atendidos: </b> {report.ordersTotal} <hr></hr>
              <b>Cantidad de Rutas Generadas:</b> {report.cantRutas} <hr></hr>
              <b>Tiempo promedio de entrega:</b> {(report.promTiempo / 3600).toFixed(2)} horas <hr></hr>
              <b>Pedidos Atendidos a COSTA:</b> {parseInt(report.cantCosta)} <hr></hr>
              <b>Pedidos Atendidos a SIERRA:</b> {parseInt(report.cantSierra)} <hr></hr>
              <b>Pedidos Atendidos a SELVA:</b> {parseInt(report.cantSelva)} <hr></hr>
              <b>Cantidad Promedio de Pedidos Parciales por Pedido:</b> {report.pedidosParcialesxPedido.toFixed(2)} <hr></hr>
            </ModalBody>
            <ModalFooter>
              <Button color={'success'} onClick={() => setIsOpen(false)}>
                OK
              </Button>
            </ModalFooter>
          </Modal>
          : ''
      }
    </Card>
  )
}

export default MapView
