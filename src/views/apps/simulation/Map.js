import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'
import L from 'leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Markers from './Markers'

import { Fragment, useState, useEffect } from 'react'
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

const VehiculeIcon = new L.Icon({
  iconUrl: require('@src/assets/images/svg/vehicule.png').default,
  iconRetinaUrl: require('@src/assets/images/svg/vehicule.png').default,
  iconSize: [14, 14],
  iconAnchor: [7, 14]
  //popupAnchor: [10, -44],
  //shadowSize: [68, 95],
  //shadowAnchor: [20, 92]
})

const MapView = () => {
  const lat = -12.51
  const lng = -76.79
  const zoom = 4.5
  const position = [lat, lng]
  const coordenatesPerOffice = {}
  let edges = []

  const [offices, setOffices] = useState([])
  const [vehicules, setVehicules] = useState([])
  const [edgePositions, setEdgesPositions] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/Oficina/').then(response => {
      setOffices(response.data)
      const offices = response.data
      for (const office of offices) {
        coordenatesPerOffice[office.ubigeo] = { latitud: office.latitud, longitud: office.longitud }
      }
    })

    axios.get('http://localhost:8080/UnidadTransporte/').then(response => {
      setVehicules(response.data)
    })

    // axios.get('http://localhost:8080/ABC/').then(response => {
    //   console.log(response)
    // })

    axios.get('http://localhost:8080/Tramo/').then(response => {
      edges = response.data
      axios.get('http://localhost:8080/TramosUsados/').then(response => {
        const listEdges = response.data
        const positions = []
        console.log(edges)
        for (const idEdge of listEdges) {
          const edge = edges.find(obj => obj.id === idEdge)
          const origin = coordenatesPerOffice[edge.idCiudadI]
          const destiny = coordenatesPerOffice[edge.idCiudadJ]
          positions.push([[origin.latitud, origin.longitud], [destiny.latitud, destiny.longitud]])
        }

        setEdgesPositions(positions)
      })
    })

  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Mapa</CardTitle>
      </CardHeader>
      <CardBody>
        <MapContainer center={position} zoom={zoom} className='leaflet-map' style={{ height: "100vh" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vehicules.map((vehicule, idx) => {
            const position = [vehicule.abscisa, vehicule.ordenada]
            return (<Marker key={`vehicule-${idx}`} position={position} icon={VehiculeIcon}>
              <Popup>
                <span>Latitud: {vehicule.abscisa}</span>
                <span>Longitud: {vehicule.ordenada}</span>
              </Popup>
            </Marker>)
          })}

          {offices.map((office, idx) => {
            const position = [office.latitud, office.longitud]
            return (<Marker key={`office-${idx}`} position={position} icon={OfficeIcon}>
              <Popup>
                <span>Latitud: {office.latitud}</span>
                <span>Longitud: {office.longitud}</span>
              </Popup>
            </Marker>)
          })}

          {edgePositions.map((position, idx) => {
            return (<Polyline key={`edge-${idx}`} positions={position} color={'yellow'} />)
          })}

        </MapContainer>
      </CardBody>
    </Card>
  )
}
export default MapView
