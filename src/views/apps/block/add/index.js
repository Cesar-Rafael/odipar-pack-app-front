// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input } from 'reactstrap'

// ** Tables
//import TableZeroConfig from './TableZeroConfig'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {

    const [bloqueos, setBloqueos] = useState([])
    const [pedidos, setPedidos] = useState([])

    const showFile = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            let bloques = []
            const text = e.target.result
            const line = text.split('\n')
            for (let i = 0; i < line.length; i++) {
                const d = new Date()
                const part = line[i].split(" ")
                const bloqueo = { id: 0, fecha_inicio: d, fecha_fin: d, ubigeo_inicio: 0, ubigeo_fin: 0 }
                bloqueo.ubigeo_inicio = parseInt(part[0])
                const parts = part[2].split(";")
                bloqueo.ubigeo_fin = parseInt(parts[0])
                const fechas = parts[1].split("==")
                const dia1 = fechas[0].split(",")
                const dia2 = fechas[1].split(",")
                const mes = parseInt(dia1[0]) / 100
                const dia = parseInt(dia1[0]) % 100
                d.setMonth(Math.floor(mes) - 1)
                d.setDate(dia)
                const horas = dia1[1].split(":")
                d.setHours(parseInt(horas[0]), parseInt(horas[1]))
                bloqueo.fecha_inicio = d
                const d2 = new Date()
                mes = parseInt(dia2[0]) / 100
                dia = parseInt(dia2[0]) % 100
                d2.setMonth(Math.floor(mes) - 1)
                d2.setDate(dia)
                horas = dia2[1].split(":")
                d2.setHours(parseInt(horas[0]), parseInt(horas[1]))
                bloqueo.fecha_fin = d2
                bloques = [...bloques, bloqueo]
            }

            console.log(bloques)
            setBloqueos(bloques)

        }
        reader.readAsText(e.target.files[0])
    }

    const pedidoMasivo = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            let pedidos = []
            const text = e.target.result
            const line = text.split('\n')
            //01 00:56, 150101 =>  020501,  77, 000484
            for (let i = 0; i < line.length; i++) {
                const d = new Date()
                
                const part = line[i].split(/(\s+)/).filter(e => e.length > 1)
                if (part.length < 1) break
                const pedido = { id: 0, idCliente: 0, cantPaquetes: d, cantPaquetesNoAsignado: 0, idCiudadDestino: 0, fechaHoraCreacion: d, estado: 0 }
                pedido.idCiudadDestino = parseInt(part[5].slice(0, -1))
                pedido.cantPaquetes = parseInt(part[6].slice(0, -1))
                pedido.idCliente = parseInt(part[7].slice(0, -1))
                d.setDate(parseInt(part[0]))
                const hora = part[1].split(":")
                d.setHours(parseInt(hora[0]), parseInt(hora[1].slice(0, -1)))
                pedido.fechaHoraCreacion = d
                pedidos = [...pedidos, pedido]
            }

            console.log(pedidos)
            setPedidos(pedidos)

        }
        reader.readAsText(e.target.files[0])
    }

    return (
        <Fragment>
        <Row>
            <Col sm='12'>
                <FormGroup>
                <Label for='inputFile'>carga de bloqueos masivo</Label>
                <Input type='file' id='inputFile' name='fileInpur' onChange={showFile}/>
                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                <Label for='inputFile'>carga de pedidos masivo</Label>
                <Input type='file' id='inputFile' name='fileInpur' onChange={pedidoMasivo}/>
                </FormGroup>
            </Col>
        </Row>
        </Fragment>
    )
}

export default Tables