// ** React Imports
import { Fragment, useState } from 'react'
import { Row, Col, FormGroup, Label, Input } from 'reactstrap'

const DataUpload = ({ loadOrders }) => {

    const actualDate = new Date()
    const [mes, setMes] = useState(actualDate.getMonth())

    const pedidoMasivo = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            let pedidos = []
            const text = e.target.result
            const line = text.split('\n')
            //01 00:56, 150101 =>  020501,  77, 000484
            for (let i = 0; i < line.length; i++) {
                const date = new Date()
                const part = line[i].split(/(\s+)/).filter(e => e.trim().length > 0)
                if (part.length < 1) break
                //console.log(part)
                const pedido = { id: i, rucCliente: parseInt(part[6]), cantPaquetes: 0, cantPaquetesNoAsignado: 0, idCiudadDestino: 0, fechaHoraCreacion: date, estado: 0 }
                pedido.idCiudadDestino = parseInt(part[4].slice(0, -1))
                pedido.cantPaquetes = parseInt(part[5].slice(0, -1))
                pedido.cantPaquetesNoAsignado = parseInt(part[5].slice(0, -1))
                date.setMonth(mes)
                date.setDate(parseInt(part[0]))
                const hora = part[1].split(":")
                date.setHours(parseInt(hora[0]), parseInt(hora[1].slice(0, -1)))
                pedido.fechaHoraCreacion = date
                pedidos.push(pedido)
            }

            //console.log(pedidos)
            //setPedidos(pedidos)
            loadOrders(pedidos)
        }

        reader.readAsText(e.target.files[0])
    }

    return (
        <Fragment>
            <FormGroup>
                {/*<Label for='fileOrders'>Carga de Pedidos</Label> */}
                <b>Carga de Pedidos:</b>
                {/*
                        <Input type='number' onChange={(e) => setMes(e.target.value)}></Input>
                        */}
                <Input type='file' id='fileOrders' name='fileOrders' onChange={pedidoMasivo} />
            </FormGroup>
        </Fragment>
    )
}

export default DataUpload