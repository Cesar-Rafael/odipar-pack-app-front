import { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import RegisterIndividual from './Individual'
import RegisterMasive from './Masive'

const newOrder = () => {
  return (
    <Fragment>
      <Row>
        <Col md='6' sm='12'>
          <RegisterIndividual />
        </Col>
        <Col md='6' sm='12'>
          <RegisterMasive />
        </Col>
      </Row>
    </Fragment>
  )
}
export default newOrder