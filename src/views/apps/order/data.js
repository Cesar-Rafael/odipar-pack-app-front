import { Badge } from "reactstrap"

const status = {
  NO_ASIGNADO: { title: 'No Asignado', color: 'light-danger' },
  EN_PROCESO: { title: 'En Proceso', color: 'light-primary' },
  EN_TRANSITO: { title: 'En Tránsito', color: 'light-info' },
  ENTREGADO: { title: 'Entregado', color: 'light-success' }
}

// ** Table Zero Config Column
export const basicColumns = [
  {
    name: 'ID',
    selector: 'id',
    sortable: true,
    maxWidth: '25px'
  },
  {
    name: 'RUC Cliente',
    selector: 'rucCliente',
    sortable: true,
    minWidth: '200px'
  },
  {
    name: 'Paquetes Solicitados',
    selector: 'cantPaquetes',
    sortable: true,
    minWidth: '80px'
  },
  {
    name: 'Estado',
    selector: 'estado',
    sortable: true,
    minWidth: '100px',
    cell: row => {
      return (
        <Badge color={status[row.estado].color} pill>
          {status[row.estado].title}
        </Badge>
      )
    }
  },
  {
    name: 'Ciudad Destino',
    selector: 'ciudadDestino',
    sortable: true,
    minWidth: '140px'
  },
  {
    name: 'Fecha de Registro',
    selector: 'fechaHoraCreacion',
    sortable: true,
    minWidth: '180px'
  }
]