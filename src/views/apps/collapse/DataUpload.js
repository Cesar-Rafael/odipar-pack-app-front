import { Fragment } from 'react'
import { FormGroup, Input } from 'reactstrap'
import moment from 'moment'

const DataUpload = ({ loadOrders, offices }) => {

    const getNameOffice = (ubigeo) => {
        const office = offices.find(o => o.ubigeo === ubigeo)
        return office !== undefined ? office.provincia : 0
    }

    const pedidoMasivo = (e) => {
        e.preventDefault()

        const currentDate = moment()
        const currentDay = currentDate.date()
        const currentMonth = currentDate.month()
        const currentYear = currentDate.year()

        const reader = new FileReader()
        reader.onload = (e) => {
            let pedidos = []
            const text = e.target.result
            const line = text.split('\n')
            //01 00:56, 150101 =>  020501,  77, 000484
            for (let i = 0; i < line.length; i++) {
                const part = line[i].split(/(\s+)/).filter(e => e.trim().length > 0)

                if (+part[0] === 8) break // Solo leen los primeros 7 días

                const hora = part[1].split(":")
                let date = moment().set({ 'year': currentYear, 'month': currentMonth, 'date': currentDay, 'hour': +hora[0], 'minute': parseInt(hora[1].slice(0, -1)) })
                date.add(part[0] - 1, 'days')

                const ubigeo = parseInt(part[4].slice(0, -1))

                if (part.length < 1) break
                const pedido = {
                    id: i,
                    rucCliente: parseInt(part[6]),
                    cantPaquetes: parseInt(part[5].slice(0, -1)),
                    cantPaquetesNoAsignado: parseInt(part[5].slice(0, -1)),
                    idCiudadDestino: ubigeo,
                    fechaHoraCreacion: date.toDate(),
                    ciudadDestino: getNameOffice(ubigeo),
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