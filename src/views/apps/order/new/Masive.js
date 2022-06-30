import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  Label,
  Alert
} from 'reactstrap'
import axios from 'axios'

import { useState } from 'react'

import API_URL from '../../config'

const RegisterMasive = ({ offices }) => {
  const [registered, setRegistered] = useState(false)
  const [ordersToRegister, setOrdersToRegister] = useState([])

  const getNameOffice = (ubigeo) => {
    const office = offices.find(o => o.value === ubigeo)
    return office !== undefined ? office.label : ''
  }

  const registerOrders = async (event) => {
    event.preventDefault()

    const response = await axios.post(`${API_URL}/Pedido/Insertar/Masivo`, ordersToRegister)
    if (response.data) {
      setRegistered(true)
      setOrdersToRegister([])
      setTimeout(() => {
        setRegistered(false)
      }, 3500)
    }
  }

  const readOrdersFile = (e) => {
    e.preventDefault()

    const reader = new FileReader()
    reader.onload = e => {
      const orders = []
      const text = e.target.result
      const lines = text.split('\r\n')
      lines.shift()
      const fechaHoraCreacion = new Date()
      for (const line of lines) {
        const [rucCliente, cantPaquetes, idCiudadDestino] = line.split(';')
        const ciudadDestino = getNameOffice(+idCiudadDestino)
        orders.push({
          rucCliente: +rucCliente,
          cantPaquetes: +cantPaquetes,
          cantPaquetesNoAsignado: +cantPaquetes,
          idCiudadDestino: +idCiudadDestino,
          ciudadDestino,
          fechaHoraCreacion,
          estado: 0
        })
      }

      e.target.value = null

      setOrdersToRegister(orders)
    }

    reader.readAsText(e.target.files[0])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Registro Masivo</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup>
            <Label for='ordersFile'>Carga de Archivo CSV</Label>
            <Input type='file' id='ordersFile' name='ordersFile' onChange={readOrdersFile} />
          </FormGroup>

          <FormGroup className='mb-1' row>
            <Col className='d-flex' md={{ size: 9, offset: 3 }}>
              <Button.Ripple className='mr-1' color='primary' type='submit' onClick={registerOrders}>
                Registrar
              </Button.Ripple>
            </Col>
          </FormGroup>

          {ordersToRegister.length ? <FormGroup row>
            <Col xs='12' className='text-center'>
              <Alert color='info'>
                <h4 className='alert-heading'>Cantidad de Pedidos: {ordersToRegister.length}</h4>
              </Alert>
            </Col>
          </FormGroup> : ''}

          {registered ? <FormGroup row>
            <Col xs='12' className='text-center'>
              <Alert color='success'>
                <h4 className='alert-heading'>Pedidos Registrados Exitosamente</h4>
              </Alert>
            </Col>
          </FormGroup> : ''}
        </Form>
      </CardBody>
    </Card>
  )
}
export default RegisterMasive