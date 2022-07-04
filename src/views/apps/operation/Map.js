import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button } from 'reactstrap'
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Vehicule from './Vehicule'
import TableExpandable from './Rutas'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import moment from 'moment'
import Legend from './Legend'
import API_URL from '../config'

const MapView = () => {
  // Parámetros:
  const zoom = 5.5
  const position = [-12.51, -76.79]

  const totalVehicules = 45

  // Referencias
  const coordenatesPerOffice = useRef({})
  const vehiculesReferences = useRef([])
  const routesTableRef = useRef()
  const currentDateToAttend = useRef()


  const vehiculesReferencesAux = []
  for (let i = 0; i < totalVehicules; i++) vehiculesReferencesAux.push(useRef())
  vehiculesReferences.current = vehiculesReferencesAux

  // Estados
  const [offices, setOffices] = useState([])
  const [vehicules, setVehicules] = useState([])
  const [edgePositions, setEdgesPositions] = useState([])
  const [blocks, setBlocks] = useState([])
  const [map, setMap] = useState(null)

  const getOffices = async () => {
    const response = await axios.get(`${API_URL}/Oficina/Listar`)
    const officesResponse = response.data
    setOffices(officesResponse)
    for (const office of officesResponse) {
      coordenatesPerOffice.current[office.ubigeo] = { latitud: office.latitud, longitud: office.longitud }
    }
  }

  const getVehicules = async () => {
    const response = await axios.get(`${API_URL}/UnidadTransporte/Listar/Operaciones`)
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

  useEffect(async () => {
    await getOffices()
    await getVehicules()
    const currentTime = moment().unix()

    /*
    for (let vehiculeReference of vehiculesReferences.current) {
      vehiculeReference.current.startMovement(currentTime)
    }*/

    return async () => {
      setOffices([])
      setVehicules([])
      console.log('Unmounted')
    }
  }, [])

  const updateEdges = async () => {
    const response = await axios.get(`${API_URL}/TramosUsadosDiaDia/`)
    const listEdges = response.data
    const positions = []

    for (const edge of listEdges) {
      const origin = coordenatesPerOffice.current[edge.idCiudadI]
      const destiny = coordenatesPerOffice.current[edge.idCiudadJ]
      positions.push([[origin.latitud, origin.longitud], [destiny.latitud, destiny.longitud]])
    }

    setEdgesPositions(positions)
  }

  const runAlgorithm = async () => {

    await axios.get(`${API_URL}/ABCDD`)

    updateEdges()
    routesTableRef.current.getRoutesData()

    const currentTime = moment().unix()

    for (let vehiculeReference of vehiculesReferences.current) {
      vehiculeReference.current.addRoutes(currentTime)
    }
  }

  return (
    <Card>
      <CardHeader>
        <Col xs='6'>
          <CardTitle tag='h3'>
            <b>Operaciones Día a Día</b>
          </CardTitle>
        </Col>
        <Col xs='6' className='text-right'>
          <Button color='primary' onClick={runAlgorithm}>Atender Pedidos</Button>
        </Col>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs='6'>
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

              {blocks.map((position, idx) => {
                return (<Polyline key={`block-${idx}`} positions={position} color={'#A12C22'} weight={1} />)
              })}

              <Legend map={map} />

            </MapContainer>
          </Col>
          <Col xs='6'>
            <TableExpandable key='table-1' ref={routesTableRef} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default MapView
