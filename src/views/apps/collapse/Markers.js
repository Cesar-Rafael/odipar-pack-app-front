import React from "react"
import { Marker } from "react-leaflet"

const Markers = (props) => {
    const { offices, icon } = props
    const office = offices.map(office => (
        <Marker key={office.ubigeo} position={{lat: office.latitud, lng: office.longitud}} icon={icon}/>
    ))
    return (
        office
    )
}
export default Markers