import { Row, Col } from 'reactstrap'

import moment from 'moment'

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <Row>
        <Col xs='4'>
          <p>
            <span className='font-weight-bold'>Ciudad (Ubigeo)</span>
          </p>
        </Col>
        <Col xs='5'>
          <p>
            <span className='font-weight-bold'>Hora de Llegada</span>
          </p>
        </Col>
        <Col xs='3'>
          <p>
            <span className='font-weight-bold'>Paquetes</span>
          </p>
        </Col>
      </Row>
      {
        data.arraySeguimiento.map((office, idx) => {
          return (
            <Row key={`row-${data.id}-${idx}`}>
              <Col xs='4'>
                {office}
              </Col>
              <Col xs='5'>
                {moment.unix(data.arrayHorasLlegada[idx] - (idx <= 1 ? 0 : 3600)).format('DD/MM/YYYY h:mm a')}
              </Col>
              <Col xs='3'>
                {data.pedidosPorOficina[idx]}
              </Col>
            </Row>)
        })
      }
    </div>
  )
}

// ** Table Common Column
export const columns = [
  {
    name: 'N° Ruta',
    selector: 'idRuta',
    sortable: true,
    minWidth: '25px'
  },
  {
    name: 'Vehículo',
    selector: 'codigoPlaca',
    sortable: true,
    minWidth: '60px'
  },
  {
    name: 'Paquetes',
    selector: 'cantPaquetes',
    sortable: true,
    minWidth: '50px'
  }
]

export default ExpandableTable
