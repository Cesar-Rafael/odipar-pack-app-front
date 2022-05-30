// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import TableZeroConfig from './TableZeroConfig'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'


const Tables = () => {
  return (
    <Fragment>
      {/*<Breadcrumbs breadCrumbTitle='Pedidos Registrados' breadCrumbParent='Páginas' breadCrumbActive='Listado' />*/}
      <Row>
        <Col sm='12'>
          <TableZeroConfig />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
