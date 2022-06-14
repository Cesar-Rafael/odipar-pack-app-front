import { Row, Col } from 'reactstrap'
import { Fragment } from 'react'
import MapView from './Map'

// ** Styles
// import '@styles/react/apps/app-users.scss'


const Simulation = () => {
  return (
    <Fragment>
      {/*<Breadcrumbs breadCrumbTitle='Pedidos Registrados' breadCrumbParent='Páginas' breadCrumbActive='Listado' />*/}
      <Row>
        <Col sm='12'>
          <MapView />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Simulation