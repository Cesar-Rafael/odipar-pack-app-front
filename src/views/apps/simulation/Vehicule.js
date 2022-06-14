import { Marker, Popup } from 'react-leaflet'
import axios from 'axios'
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

const VehiculeIcon = new L.Icon({
    iconUrl: require('@src/assets/images/svg/vehicule.png').default,
    iconRetinaUrl: require('@src/assets/images/svg/vehicule.png').default,
    iconSize: [14, 14],
    iconAnchor: [7, 14]
})

// 1m - 18m
// 60s - 1080s
// 1s - 18s
// 0.5s - 9s
// Valor de avance sería de 9s

const Vehicule = ({ vehicule, offices, startedSimulation }) => {
    const timeUpdateVehicules = 500 // cada 0.5 segundos (500 ms) se actualiza la posición: 500 / 1000
    const timeRealUpdateVehicules = 9
    const idIntervalVehicules = useRef(0)
    const idIntervalSimulation = useRef(0)

    const [position, setPosition] = useState([vehicule.abscisa, vehicule.ordenada])
    const route = useRef(false)
    const steps = useRef([])

    const getRoute = async (id) => {
        const response = await axios.get(`http://localhost:8080/ruta/${id}`)
        if (response.data !== '') {
            const routeResponse = response.data
            routeResponse.tiemposLlegada = routeResponse.arrayHorasLlegada.split(',').map(tiempo => parseInt(tiempo))
            routeResponse.oficinas = JSON.parse(routeResponse.seguimiento)
            delete routeResponse.arrayHorasLlegada
            delete routeResponse.seguimiento
            route.current = routeResponse
        }
    }

    const calculatePositions = (origin, destiny, timeTaken) => {
        const fromLatitud = origin.latitud
        const fromLongitud = origin.longitud
        const toLatitud = destiny.latitud
        const toLongitud = destiny.longitud
        const diffLatitud = toLatitud - fromLatitud
        const diffLongitud = toLongitud - fromLongitud
        const percetangeTime = timeRealUpdateVehicules / timeTaken
        for (let progress = 0; progress < 1; progress += percetangeTime) {
            const currentLatitud = fromLatitud + (progress * diffLatitud)
            const currentLongitud = fromLongitud + (progress * diffLongitud)
            steps.current.push([currentLatitud, currentLongitud])
        }
    }

    const calculatePositionVehicules = () => {
        if (route.current) {
            const tiemposLlegada = route.current.tiemposLlegada
            const oficinas = route.current.oficinas

            for (let i = 0; i < tiemposLlegada.length - 1; i++) {
                if (tiemposLlegada[i + 1] <= tiemposLlegada[i]) {
                    console.log('gAA')
                    break
                }
                calculatePositions(offices[oficinas[i]], offices[oficinas[i + 1]], tiemposLlegada[i + 1] - tiemposLlegada[i])
            }
        }
    }

    const startSimulation = async () => {
        clearInterval(idIntervalSimulation.current)
        idIntervalSimulation.current = 0

        await getRoute(vehicule.id)
        calculatePositionVehicules()
        if (route.current) {
            if (idIntervalVehicules.current) {
                clearInterval(idIntervalVehicules.current)
                idIntervalVehicules.current = 0
            }

            let i = 0
            const maxStep = steps.current.length
            console.log(maxStep)
            idIntervalVehicules.current = setInterval(() => {
                if (i < maxStep) {
                    setPosition(steps.current[i])
                    i++
                }
            }, timeUpdateVehicules)
        }
    }

    const endSimulation = () => {
        if (idIntervalVehicules.current) {
            clearInterval(idIntervalVehicules.current)
            idIntervalVehicules.current = 0
        }
    }

    useEffect(() => {
        idIntervalSimulation.current = setInterval(() => {
            console.log(startedSimulation)
            if (startedSimulation) startSimulation()
        }, 5000)
    }, [])

    return (
        <Marker key={`vehicule-${vehicule.id}`} position={position} icon={VehiculeIcon}>
            <Popup>
                <b>Codigo: </b> {vehicule.codigo} <br />
                <b>Capacidad: </b> {vehicule.capacidadTotal} <br />
                <b>Latidud: </b> {vehicule.abscisa} <br />
                <b>Longitud: </b> {vehicule.ordenada} <br />
            </Popup>
        </Marker>)

}

export default Vehicule
