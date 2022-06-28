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
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert
} from 'reactstrap'
import Select from 'react-select'
import { User, Smartphone, Package } from 'react-feather'

import { selectThemeColors } from '@utils'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const RegisterIndividual = () => {
  const [registered, setRegistered] = useState(false)
  const [ruc, setRuc] = useState('')
  const [packages, setPackages] = useState('')
  const [office, setOffice] = useState(null)
  const [offices, setOffices] = useState([])

  const getOffices = async () => {
    const response = await axios.get('http://localhost:8080/Oficina/')
    setOffices(response.data.filter(x => !x.esPrincipal).map(office => {
      return {
        value: office.ubigeo,
        label: office.provincia
      }
    }))
  }

  const resetValues = () => {
    setRuc('')
    setPackages('')
    setOffice(null)
  }

  useEffect(async () => {
    await getOffices()

    return async () => {
      setOffices([])
    }
  }, [])

  const registerOrder = async (event) => {
    event.preventDefault()
    const order = {
      rucCliente: +ruc,
      cantPaquetes: +packages,
      cantPaquetesNoAsignado: +packages,
      idCiudadDestino: office.value,
      ciudadDestino: office.label,
      fechaHoraCreacion: new Date(),
      estado: 0
    }

    const response = await axios.post('http://localhost:8080/Pedido/Insertar', order)
    if (response.data.id >= 0) {
      setRegistered(true)
      resetValues()
      setTimeout(() => {
        setRegistered(false)
      }, 3500)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Registro Individual</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <Label sm='3' for='nameIcons'>
              RUC Cliente
            </Label>
            <Col sm='9'>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <User size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input type='number' value={ruc} placeholder='RUC' onChange={e => setRuc(e.target.value)} />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='3' for='EmailIcons'>
              Paquetes
            </Label>
            <Col sm='9'>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <Package size={15} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input type='number' value={packages} placeholder='Cantidad' onChange={e => setPackages(e.target.value)} />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label sm='3'>
              Oficina
            </Label>
            <Col className='mb-1' md='9' sm='9'>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={offices}
                isClearable={false}
                value={office}
                onChange={setOffice}
              />
            </Col>
          </FormGroup>

          <FormGroup className='mb-1' row>
            <Col className='d-flex' md={{ size: 9, offset: 3 }}>
              <Button.Ripple className='mr-1' color='primary' type='submit' onClick={registerOrder}>
                Registrar
              </Button.Ripple>
              <Button.Ripple outline color='secondary' type='reset'>
                Limpiar
              </Button.Ripple>
            </Col>
          </FormGroup>


          {registered ? <FormGroup row>
            <Col xs='12' className='text-center'>
              <Alert color='success'>
                <h4 className='alert-heading'>Pedido Registrado</h4>
              </Alert>
            </Col>
          </FormGroup> : ''}
        </Form>
      </CardBody>
    </Card>
  )
}
export default RegisterIndividual
