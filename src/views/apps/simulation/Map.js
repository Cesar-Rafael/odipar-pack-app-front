import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'

const Icon1 = new L.Icon({
    iconUrl: require('@src/assets/images/svg/map-marker.png').default,
    iconRetinaUrl: require('@src/assets/images/svg/map-marker.png').default,
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [55, 55],
    shadowSize: [68, 95],
    shadowAnchor: [20, 92]
})


const MapView = () => {
  const lat = -12.51
  const lng = -76.79
  const zoom = 5

  const position = [lat, lng]
  const position2 = [-12.044735293425935, -77.04272241869845]
  const position3 = [-16.383916708805785, -71.53271880646226]
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Mapa</CardTitle>
      </CardHeader>
      <CardBody>
        <MapContainer center={position} zoom={zoom} className='leaflet-map'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position3} icon={Icon1}>
            </Marker>
            <Marker position={position2} icon={Icon1}>
            </Marker>
        </MapContainer>
      </CardBody>
    </Card>
  )
}
export default MapView
