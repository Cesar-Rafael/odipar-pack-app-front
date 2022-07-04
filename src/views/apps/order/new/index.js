import { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import RegisterIndividual from './Individual'
import RegisterMasive from './Masive'

import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from './../../config'

const newOrder = () => {

  const [offices, setOffices] = useState([])

  const getOffices = async () => {
    const response = await axios.get(`${API_URL}/Oficina/Listar`)
    setOffices(response.data.filter(x => !x.esPrincipal).map(office => {
      return {
        value: office.ubigeo,
        label: office.provincia
      }
    }))
  }

  useEffect(async () => {
    await getOffices()

    return async () => {
      setOffices([])
    }
  }, [])

  return (
    <Fragment>
      <Row>
        <Col md='6' sm='12'>
          <RegisterIndividual offices={offices} />
        </Col>
        <Col md='6' sm='12'>
          <RegisterMasive offices={offices} />
        </Col>
      </Row>
    </Fragment>
  )
}
export default newOrder