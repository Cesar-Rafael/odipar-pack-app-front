import { Popup, CircleMarker } from 'react-leaflet'
import axios from 'axios'
import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import API_URL from './../config'

// 5m - 1440m (24h) 35m / 3 = 12m
// 1m - 288m
// 60s - 17280s
// 2s - 576
// 1s - 288s
// 0.5s - 144s
// 0.1s - 29s
// 0.25s - 77s
// Valor de avance sería de 144s en el algoritmo

const Vehicule = forwardRef(({ vehicule, offices }, ref) => {
    const timeUpdateVehicules = useRef(100) // cada 0.25 segundos se actualiza la posición (ms)
    const timeRealUpdateVehicules = useRef(29) // Velocidad normal: x1.0
    const idIntervalVehicules = useRef(0)

    const [position, setPosition] = useState([vehicule.abscisa, vehicule.ordenada])
    const currentRoute = useRef(false)
    const routesCompleted = useRef(0)
    const routes = useRef([])
    const steps = useRef([])

    const getRoutes = async (id) => {
        const response = await axios.get(`${API_URL}/ruta/ListarRutasxIdVehiculoSimulacion/${id}`)
        if (response.data.length) {
            routes.current = response.data
            currentRoute.current = routes.current[0]
        }
    }

    const calculatePositions = (origin, destiny, timeTaken) => {
        const fromLatitud = origin.latitud
        const fromLongitud = origin.longitud
        const toLatitud = destiny.latitud
        const toLongitud = destiny.longitud
        const diffLatitud = toLatitud - fromLatitud
        const diffLongitud = toLongitud - fromLongitud
        const percetangeTime = timeRealUpdateVehicules.current / timeTaken
        for (let progress = 0; progress < 1; progress += percetangeTime) {
            const currentLatitud = fromLatitud + (progress * diffLatitud)
            const currentLongitud = fromLongitud + (progress * diffLongitud)
            steps.current.push([currentLatitud, currentLongitud])
        }

        const stopTime = timeRealUpdateVehicules.current / 3600
        for (let progress = 0; progress < 1; progress += stopTime) {
            steps.current.push([toLatitud, toLongitud])
        }
    }

    const calculatePositionVehicules = () => {
        while (routes.current.length > routesCompleted.current) {
            currentRoute.current = routes.current[routesCompleted.current]
            const tiemposLlegada = currentRoute.current.arrayHorasLlegada
            const oficinas = currentRoute.current.arraySeguimiento

            for (let i = 0; i < tiemposLlegada.length - 1; i++) {
                if (tiemposLlegada[i + 1] <= tiemposLlegada[i]) {
                    console.log(currentRoute.current.idRuta)
                    break
                }
                calculatePositions(offices[oficinas[i]], offices[oficinas[i + 1]], tiemposLlegada[i + 1] - tiemposLlegada[i] - (i === 0 ? 0 : 3600))
            }

            routesCompleted.current++
        }
    }

    const startSimulation = async (speed) => {
        // Setting parameters   
        timeRealUpdateVehicules.current *= speed
        //timeUpdateVehicules.current *= speed

        await getRoutes(vehicule.id)

        if (routes.current.length) {

            calculatePositionVehicules()

            if (idIntervalVehicules.current) {
                clearInterval(idIntervalVehicules.current)
                idIntervalVehicules.current = 0
            }

            idIntervalVehicules.current = setInterval(() => {
                steps.current.length && setPosition(steps.current.shift())
            }, timeUpdateVehicules.current)
        }
    }

    const addRoutes = async () => {
        //stopSimulation()
        await getRoutes(vehicule.id)
        calculatePositionVehicules()
        //resumeSimulation()
    }

    const stopSimulation = () => {
        if (idIntervalVehicules.current) {
            clearInterval(idIntervalVehicules.current)
            idIntervalVehicules.current = 0
        }
    }

    const resumeSimulation = () => {
        idIntervalVehicules.current = setInterval(() => {
            steps.current.length && setPosition(steps.current.shift())
        }, timeUpdateVehicules.current)
    }

    useImperativeHandle(ref, () => {
        return {
            startSimulation,
            stopSimulation,
            resumeSimulation,
            addRoutes
        }
    })

    return (
        <CircleMarker key={`vehicule-${vehicule.id}`} radius={3} weight={5} center={position} color={'#1828BA'}>
            <Popup>
                <b>Codigo: </b> {vehicule.codigo} <br />
                <b>Capacidad: </b> {vehicule.capacidadTotal} <br />
                <b>Latidud: </b> {vehicule.abscisa} <br />
                <b>Longitud: </b> {vehicule.ordenada} <br />
            </Popup>
        </CircleMarker>)

})

export default Vehicule
