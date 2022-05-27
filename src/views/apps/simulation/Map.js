import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import '@styles/react/libs/maps/map-leaflet.scss'
import Markers from './Markers'

// ** Store & Actions
import { getAllData, getData } from '../office/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { Fragment, useState, useEffect } from 'react'

const Icon1 = new L.Icon({
    iconUrl: require('@src/assets/images/svg/map-marker.png').default,
    iconRetinaUrl: require('@src/assets/images/svg/map-marker.png').default,
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [15, 15],
    shadowSize: [68, 95],
    shadowAnchor: [20, 92]
})


const MapView = () => {
  const lat = -12.51
  const lng = -76.79
  const zoom = 5

  const position = [lat, lng]


  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => {
    return state.offices
  })

  useEffect(() => {
    dispatch(getAllData())
  }, [])

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
            <Markers offices={store.allData} icon={Icon1}/>
        </MapContainer>
      </CardBody>
    </Card>
  )
}
export default MapView
