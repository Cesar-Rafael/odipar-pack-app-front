import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Badge, CardTitle, CardText } from 'reactstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import API_URL from './../../config'
import TableExpandable from './Rutas'

import Breadcrumbs from '@components/breadcrumbs'

const status = {
    DISPONIBLE: { title: 'Disponible', color: 'light-success' },
    RESERVADO: { title: 'Reservado', color: 'light-primary' },
    EN_TRANSITO: { title: 'En Tránsito', color: 'light-info' },
    AVERIADO: { title: 'Averiado', color: 'light-danger' },
    EN_MANTENIMIENTO: { title: 'En Mantenimiento', color: 'light-danger' },
}

const VehicleView = () => {
    const params = useParams()
    const [data, setData] = useState(null)
    const id = params.id

    const getData = async () => {
        const response = await axios.get(`${API_URL}/UnidadTransporte/Obtener/${id}`)
        setData(response.data)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Plan de Transporte' breadCrumbParent='Vehiculos' breadCrumbActive='Listado' />

            {
                data !== null ?
                    <Fragment>
                        <Card>
                            <CardHeader className='pb-0'>
                                <CardTitle tag='h4'>Unidad de Transporte</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className='d-flex justify-content-between mt-1'>
                                    <div className='text-center'>
                                        <CardText className='mb-50'>Placa</CardText>
                                        <span className='font-large-1 font-weight-bold'>{data.codigo}</span>
                                    </div>
                                    <div className='text-center'>
                                        <CardText className='mb-50'>Capacidad Total</CardText>
                                        <span className='font-large-1 font-weight-bold'>{data.capacidadTotal}</span>
                                    </div>
                                    <div className='text-center'>
                                        <CardText className='mb-50'>Capacidad Disponible</CardText>
                                        <span className='font-large-1 font-weight-bold'>{data.capacidadDisponible}</span>
                                    </div>
                                    <div className='text-center'>
                                        <CardText className='mb-50'>Estado</CardText>
                                        <Badge color={status[data.estado].color} pill>
                                            {status[data.estado].title}
                                        </Badge>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <TableExpandable id={data.id} />
                    </Fragment> : ''
            }
        </Fragment>)
}

export default VehicleView
