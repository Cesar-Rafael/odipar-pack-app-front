// ** React Imports
import { Fragment } from 'react'
import { FormGroup, Input } from 'reactstrap'

const DataUpload = ({ loadOrders }) => {

    const currentDate = new Date()
    const currentDay = currentDate.getDay()

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
                date.setMonth(mes)
                date.setDate(currentDay + part[0] - 1)
                const hora = part[1].split(":")
                date.setHours(parseInt(hora[0]), parseInt(hora[1].slice(0, -1)))

                const part = line[i].split(/(\s+)/).filter(e => e.trim().length > 0)
                if (part.length < 1) break
                const pedido = {
                    id: i,
                    rucCliente: parseInt(part[6]),
                    cantPaquetes: parseInt(part[5].slice(0, -1)),
                    cantPaquetesNoAsignado: parseInt(part[5].slice(0, -1)),
                    idCiudadDestino: parseInt(part[4].slice(0, -1)),
                    fechaHoraCreacion: date,
                    estado: 0
                }
                pedidos.push(pedido)
            }

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