import { Popup, CircleMarker } from 'react-leaflet'
import axios from 'axios'
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

// 5m - 1.5h
// 1m - 18m
// 60s - 1080s
// 1s - 18s
// 0.5s - 9s
// Valor de avance sería de 9s

// NUEVO:
// 5m - 1440m (24h)
// 1m - 288m
// 60s - 17280s
// 1s - 288s
// 0.5s - 144s
// Valor de avance sería de 144s en el algoritmo

const Vehicule = forwardRef(({ vehicule, offices }, ref) => {
    const timeUpdateAlgorithm = 320000 // cada 5 minutos se ejecuta el algoritmo (ms)
    const timeUpdateVehicules = 500 // cada 0.5 segundos (500 ms) se actualiza la posición: 500 / 1000
    const timeRealUpdateVehicules = useRef(144) // Velocidad normal: x1.0
    const idIntervalVehicules = useRef(0)
    const idIntervalSimulation = useRef(0)

    const [position, setPosition] = useState([vehicule.abscisa, vehicule.ordenada])
    const currentRoute = useRef(false)
    const routesCompleted = useRef(0)
    const routes = useRef([])
    const steps = useRef([])

    const getRoutes = async (id) => {
        const response = await axios.get(`http://localhost:8080/ruta/ListarRutasxIdVehiculoSimulacion/${id}`)
        if (response.data.length) {
            routes.current = response.data
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

        if (idIntervalSimulation.current) {
            clearInterval(idIntervalSimulation.current)
            idIntervalSimulation.current = 0
        }

        await getRoutes(vehicule.id)

        if (routes.current.length) {
            calculatePositionVehicules()

            if (idIntervalVehicules.current) {
                clearInterval(idIntervalVehicules.current)
                idIntervalVehicules.current = 0
            }

            idIntervalVehicules.current = setInterval(() => {
                steps.current.length && setPosition(steps.current.shift())
            }, timeUpdateVehicules)
        }

        idIntervalSimulation.current = setInterval(async () => {
            await getRoutes(vehicule.id)

            if (routes.current.length) {
                calculatePositionVehicules()

                // if (idIntervalVehicules.current) {
                //     clearInterval(idIntervalVehicules.current)
                //     idIntervalVehicules.current = 0
                // }
            }
        }, timeUpdateAlgorithm)
    }

    const endSimulation = () => {
        if (idIntervalVehicules.current) {
            clearInterval(idIntervalVehicules.current)
            idIntervalVehicules.current = 0
        }
    }

    useImperativeHandle(ref, () => {
        return {
            startSimulation,
            endSimulation
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
