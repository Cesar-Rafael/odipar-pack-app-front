// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row } from 'reactstrap'

// ** Tables
import DataTableWithButtons from './blocksTable'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      {/*<Breadcrumbs breadCrumbTitle='Bloqueos Registrados' breadCrumbParent='Páginas' breadCrumbActive='Listado' />*/}
      <Row>
        <DataTableWithButtons />
      </Row>
    </Fragment>
  )
}

export default Tables