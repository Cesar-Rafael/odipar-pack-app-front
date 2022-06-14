import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button } from 'reactstrap'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'
import L from 'leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Vehicule from './Vehicule'

import { useState, useEffect, useRef, createRef } from 'react'
import axios from 'axios'

const OfficeIcon = new L.Icon({
  iconUrl: require('@src/assets/images/svg/officeIcon.png').default,
  iconRetinaUrl: require('@src/assets/images/svg/officeIcon.png').default,
  iconSize: [14, 14],
  iconAnchor: [7, 14]
  //popupAnchor: [10, -44],
  //shadowSize: [68, 95],
  //shadowAnchor: [20, 92]
})

const MapView = () => {
  // Parámetros:
  const zoom = 4.5
  const position = [-12.51, -76.79]

  const timeSimulation = 1640998200 // inicio de simulación 1640998200
  const timeUpdateAlgorithm = 300000 // cada 5 minutos se ejecuta el algoritmo (ms)

  // Referencias
  const idIntervalEdges = useRef(0)
  const coordenatesPerOffice = useRef({})
  //const vehiculesReferences = useRef([])

  // Estados
  const [offices, setOffices] = useState([])
  const [vehicules, setVehicules] = useState([])
  const [edgePositions, setEdgesPositions] = useState([])
  const [startedSimulation, setStartedSimulation] = useState(false)

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
    const totalVehicules = vehiculesResponse.length
    //for (let i = 0; i < totalVehicules; i++) vehiculesReferences.current.push(useRef())
  }

  useEffect(() => {
    getOffices()
    getVehicules()

    return () => {
      setOffices([])
      setVehicules([])
      setEdgesPositions([])
    }
  }, [])

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
    console.log('INICIO SIMULACION')

    const response = await axios.get('http://localhost:8080/ABCS/')
    if (response) {
      updateEdges()
      if (idIntervalEdges.current) {
        clearInterval(idIntervalEdges.current)
        idIntervalEdges.current = 0
      }

      setStartedSimulation(true)

      idIntervalEdges.current = setInterval(() => {
        updateEdges()
      }, timeUpdateAlgorithm)
    }
  }

  return (
    <Card>
      <CardHeader>
        <Col xs='6'>
          <CardTitle tag='h4'>Simulación 7 días</CardTitle>
        </Col>
        <Col xs='6' className='text-right'>
          <Button color='primary' onClick={startSimulation}>Iniciar Simulacion</Button>
        </Col>
      </CardHeader>
      <CardBody>
        <MapContainer center={position} zoom={zoom} className='leaflet-map' style={{ height: "100vh" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {offices.map((office, idx) => {
            return (<Marker key={`office-${idx}`} position={[office.latitud, office.longitud]} icon={OfficeIcon}>
              <Popup>
                <b>Ubigeo: </b> {office.ubigeo} <br />
                <b>Region: </b> {office.region} <br />
                <b>Departamento: </b> {office.departamento} <br />
                <b>Provincia: </b> {office.provincia} <br />
                <b>Latitud: </b> {office.latitud} <br />
                <b>Longitud: </b> {office.longitud} <br />
              </Popup>
            </Marker>)
          })}

          {vehicules.map((vehicule, idx) => <Vehicule key={`vehicule-${idx}`} vehicule={vehicule} offices={coordenatesPerOffice.current} startedSimulation={startedSimulation} />)}

          {edgePositions.map((position, idx) => {
            return (<Polyline key={`edge-${idx}`} positions={position} color={'black'} />)
          })}

        </MapContainer>
      </CardBody>
    </Card>
  )
}

export default MapView
