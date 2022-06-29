// ** React Imports
import { Fragment, useState } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap'

// ** Tables
import DataTableWithButtons from './BlocksTable'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import API_URL from '../../config'


const Tables = () => {
    const [bloqueos, setBloqueos] = useState([])

    const enviarBloqueos = async () => {
        console.log(bloqueos)
        await axios.post(`${API_URL}/Bloqueo/PostBloqueos`, [...bloqueos]).then(response => console.log(response.data))
    }

    const bloqueoMasivo = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            let bloques = []
            const text = e.target.result
            const line = text.split('\n')
            for (let i = 0; i < line.length; i++) {
                const d = new Date()
                const part = line[i].split(" ")
                const bloqueo = { id: 0, fechaInicio: d, fechaFin: d, ubigeoInicio: 0, ubigeoFin: 0 }
                bloqueo.ubigeoInicio = parseInt(part[0])
                const parts = part[2].split(";")
                bloqueo.ubigeoFin = parseInt(parts[0])
                const fechas = parts[1].split("==")
                const dia1 = fechas[0].split(",")
                const dia2 = fechas[1].split(",")
                const mes = parseInt(dia1[0]) / 100
                const dia = parseInt(dia1[0]) % 100
                d.setMonth(Math.floor(mes) - 1)
                d.setDate(dia)
                const horas = dia1[1].split(":")
                d.setHours(parseInt(horas[0]), parseInt(horas[1]))
                bloqueo.fechaInicio = d
                const d2 = new Date()
                mes = parseInt(dia2[0]) / 100
                dia = parseInt(dia2[0]) % 100
                d2.setMonth(Math.floor(mes) - 1)
                d2.setDate(dia)
                horas = dia2[1].split(":")
                d2.setHours(parseInt(horas[0]), parseInt(horas[1]))
                bloqueo.fechaFin = d2
                bloques = [...bloques, bloqueo]
            }
            setBloqueos([...bloqueos, ...bloques])
        }
        reader.readAsText(e.target.files[0])
    }

  return (
    <Fragment>
      {/*<Breadcrumbs breadCrumbTitle='Bloqueos Registrados' breadCrumbParent='Páginas' breadCrumbActive='Listado' />*/}
      <Row>
        <Col sm='12'>
            <FormGroup>
            <Label for='inputFile'>carga de bloqueos masivo</Label>
            <Input type='file' id='inputFile' name='fileInput' onChange={bloqueoMasivo}/>
            </FormGroup>
        </Col>
        <Button onClick={enviarBloqueos}>
            guardar bloqueos
        </Button>
        <Col sm='12'>
          <DataTableWithButtons />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables