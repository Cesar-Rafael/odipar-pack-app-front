import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button, Spinner, Alert, FormGroup, Input, Label, Progress } from 'reactstrap'
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Vehicule from './Vehicule'
import DataUpload from './DataUpload'
import TableExpandable from './Rutas'
import { useState, useEffect, useRef, Fragment } from 'react'
import axios from 'axios'
import moment from 'moment'
import Legend from './Legend'

const MapView = () => {
  // Parámetros:
  const zoom = 5.5
  const position = [-12.51, -76.79]

  const timeUpdateAlgorithm = 320000 // cada 5 minutos se ejecuta el algoritmo (ms) porque 30 segundos del tiempo de ejecución del algoritmo  
  const totalVehicules = 45
  const totalTimeSimulation = 604800

  // Referencias
  const idIntervalEdges = useRef(0)
  const idTimeSimulation = useRef(0)
  const coordenatesPerOffice = useRef({})
  const ordersReference = useRef([])
  const vehiculesReferences = useRef([])
  const startTimeSimulation = useRef(false)
  const endTimeSimulation = useRef(false)
  const currentTimeSimulationRef = useRef(false)
  const timeUpdate = useRef(288)
  const routesTableRef = useRef()

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
  const [percentageProgress, setPercentageProgress] = useState(0)
  const [blocks, setBlocks] = useState([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [map, setMap] = useState(null);

  const getOffices = async () => {
    const response = await axios.get('http://localhost:8080/Oficina/')
    const officesResponse = response.data
    setOffices(officesResponse)
    for (const office of officesResponse) {
      coordenatesPerOffice.current[office.ubigeo] = { latitud: office.latitud, longitud: office.longitud }
    }
  }

  const getVehicules = async () => {
    const response = await axios.get('http://localhost:8080/UnidadTransporte/')
    const vehiculesResponse = response.data
    setVehicules(vehiculesResponse)
  }

  const getBlocks = async (startDate, endDate) => {
    const response = await axios.post(`http://localhost:8080/bloqueo/listar_por_fechas`, { inicio: startDate, fin: endDate })
  }

  useEffect(async () => {
    await getOffices()
    await getVehicules()

    return async () => {
      await endSimulation()
      console.log('Unmounted')
    }
  }, [])

  const setOrders = orders => {
    ordersReference.current = orders
    setOrdersTotal(orders.length)
  }

  const updateEdges = async () => {
    const response = await axios.get('http://localhost:8080/TramosUsados/')
    const listEdges = response.data
    const positions = []

    for (const edge of listEdges) {
      const origin = coordenatesPerOffice.current[edge.idCiudadI]
      const destiny = coordenatesPerOffice.current[edge.idCiudadJ]
      positions.push([[origin.latitud, origin.longitud], [destiny.latitud, destiny.longitud]])
    }

    setEdgesPositions(positions)
  }

  const startSimulation = async () => {
    if (ordersReference.current.length === 0) {
      alert('Cargue un archivo de pedidos')
      return
    }

    startTimeSimulation.current = moment(new Date())
    endTimeSimulation.current = moment(startTimeSimulation.current).add(7, 'days')
    setCurrentTimeSimulation(moment(startTimeSimulation.current))
    currentTimeSimulationRef.current = moment(startTimeSimulation.current)

    setShowButton(false)
    setShowLoaderButton(true)

    timeUpdate.current *= speed

    const payload = {
      pedidos: ordersReference.current,
      inicioSimulacion: startTimeSimulation.current.toDate(),
      velocidad: speed
    }

    const response = await axios.post('http://localhost:8080/ABCS/', payload)
    if (response) {
      await updateEdges()
      await getBlocks(startTimeSimulation.current.toDate(), currentTimeSimulationRef.current.add(1, 'day').toDate())
      await routesTableRef.current.getRoutesData()

      for (let vehiculeReference of vehiculesReferences.current) {
        vehiculeReference.current.startSimulation(payload.velocidad)
      }

      if (idIntervalEdges.current) {
        clearInterval(idIntervalEdges.current)
        idIntervalEdges.current = 0
      }

      idIntervalEdges.current = setInterval(() => {
        updateEdges()
      }, timeUpdateAlgorithm)

      if (idTimeSimulation.current) {
        clearInterval(idTimeSimulation.current)
        idTimeSimulation.current = 0
      }

      idTimeSimulation.current = setInterval(() => {
        currentTimeSimulationRef.current.add(timeUpdate.current, 'seconds')
        setCurrentTimeSimulation(currentTime => moment(currentTime).add(timeUpdate.current, 'seconds'))
        setPercentageProgress(((currentTimeSimulationRef.current.unix() - startTimeSimulation.current.unix()) / totalTimeSimulation) * 100)
      }, 1000) // Avanza cada 1 segundo, 288 segundos
    }

    setShowLoaderButton(false)
  }

  const setSpeedValue = (e) => {
    setSpeed(e.currentTarget.value)
  }

  const endSimulation = async () => {
    setOffices([])
    setVehicules([])
    setEdgesPositions([])
    clearInterval(idIntervalEdges.current)
    clearInterval(idTimeSimulation.current)
    await axios.get('http://localhost:8080/simulacion/detener')
  }

  const stopSimulation = async () => {
    clearInterval(idIntervalEdges.current)
    clearInterval(idTimeSimulation.current)
    await axios.get('http://localhost:8080/simulacion/detener')
  }

  return (
    <Card>
      <CardHeader>
        <Col xs='6'>
          <CardTitle tag='h3'><b>Simulación 7 días</b></CardTitle>
        </Col>
        {
          showButton ?
            <Col xs='6' className='text-right'>
              <Button color='primary' onClick={startSimulation}>Iniciar Simulacion</Button>
            </Col> : ''}
        {
          showLoaderButton ?
            <Col xs='6' className='text-right'>
              <Button.Ripple color='primary' outline disabled>
                <Spinner size='sm' />
                <span className='ml-50'>Calculando...</span>
              </Button.Ripple>
            </Col> : ''
        }
        {
          !showButton && !showLoaderButton ?
            <Fragment>
              <Col xs='3' className='text-right'>
                <Alert color='success'>
                  <h4 className='alert-heading'>Simulación Iniciada</h4>
                </Alert>
              </Col>
              <Col xs='3' className='text-right'>
                <Button color='danger' onClick={stopSimulation}>Detener Simulacion</Button>
              </Col>
            </Fragment>
            : ''
        }
      </CardHeader>
      <CardBody>
        <Row className='mb-1'>
          <Col xs='4'>
            <DataUpload loadOrders={setOrders} />
          </Col>
          <Col xs='4'>
            <Label className='mr-2'>
              <b>Cantidad de Pedidos:</b>
            </Label>
            <FormGroup check inline>
              {ordersTotal}
            </FormGroup>
          </Col>
          <Col xs='4'>
            <Label className='mr-2'>
              <b>Velocidad:</b>
            </Label>
            <FormGroup check inline>
              <Label check>
                <Input type='radio' name='speed' value={1} defaultChecked onChange={setSpeedValue} /> x1.0
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type='radio' name='speed' value={2} onChange={setSpeedValue} /> x2.0
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type='radio' name='speed' value={3} onChange={setSpeedValue} /> x3.0
              </Label>
            </FormGroup>
          </Col>
          <Col xs='4'>
            <b>Inicio Simulacion:</b> <br />
            {startTimeSimulation.current ? startTimeSimulation.current.format('DD/MM/YYYY h:mm a') : '-'}
          </Col>
          <Col xs='4'>
            <b>Tiempo Actual Simulacion:</b> <br />
            <b style={{ fontSize: 18 }}>
              {currentTimeSimulation ? currentTimeSimulation.format('DD/MM/YYYY h:mm a') : '-'}
            </b>
          </Col>
          <Col xs='4'>
            <b>Fin de Simulacion:</b> <br />
            {endTimeSimulation.current ? endTimeSimulation.current.format('DD/MM/YYYY h:mm a') : '-'}
          </Col>
        </Row>
        <Row className='mb-2'>
          <Col xs='12'>
            <Progress animated striped className='progress-bar-info' value={percentageProgress}>{percentageProgress.toFixed(2)} %</Progress>
          </Col>
        </Row>
        <Row>
          <Col xs='7'>
            <MapContainer center={position} zoom={zoom} className='leaflet-map' style={{ height: "100vh" }} scrollWheelZoom={true}
              whenCreated={setMap}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {offices.map((office, idx) => {
                return (<CircleMarker key={`office-${idx}`} center={[office.latitud, office.longitud]} radius={office.esPrincipal ? 6 : 5} weight={office.esPrincipal ? 6 : 6} color={office.esPrincipal ? '#C72E30' : '#6E5600'} fillColor={office.esPrincipal ? '#C72E30' : '#6E5600'}>
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
                return (<Polyline key={`edge-${idx}`} positions={position} color={'#7F7F7F'} weight={1} />)
              })}

              <Legend map={map} />

            </MapContainer>
          </Col>
          <Col xs='5'>
            <TableExpandable key='table-1' ref={routesTableRef} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default MapView
