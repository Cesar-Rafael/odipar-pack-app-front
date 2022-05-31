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
            setBloqueos(bloques)
            console.log(bloques)
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
        </Row>
        </Fragment>
    )
}

export default Tables