import { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import HorizontalFormIcons from './HorizontalFormIcons'

const newOrder = () => {
  return (
    <Fragment>
      <Row>
        <Col md='6' sm='12'>
          <HorizontalFormIcons />
        </Col>
      </Row>
    </Fragment>
  )
}
export default newOrder