import { Table } from 'reactstrap'
import './Rutas.css'

import moment from 'moment'

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content'>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Origen</th>
            <th>Hora</th>
            <th>Destino</th>
            <th>Hora</th>
            <th>Paquetes</th>
          </tr>
        </thead>
        <tbody>
          {
            data.routes.map((row) => {
              return (
                <tr key={`row-${row.origin}-${row.destiny}`}>
                  <td>{row.origin}</td>
                  <td>{moment.unix(row.originTime).format('DD/MM h:mm a')}</td>
                  <td>{row.destiny}</td>
                  <td>{moment.unix(row.destinyTime).format('DD/MM h:mm a')}</td>
                  <td>{row.packages}</td>
                </tr>)
            })
          }
        </tbody>
      </Table>
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
    selector: 'totalPackages',
    sortable: true,
    minWidth: '50px'
  }
]

export default ExpandableTable
