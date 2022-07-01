import { Badge } from 'reactstrap'

import { Link } from 'react-router-dom'

const status = {
  DISPONIBLE: { title: 'Disponible', color: 'light-success' },
  RESERVADO: { title: 'Reservado', color: 'light-primary' },
  EN_TRANSITO: { title: 'En Tránsito', color: 'light-info' },
  AVERIADO: { title: 'Averiado', color: 'light-danger' },
  EN_MANTENIMIENTO: { title: 'En Mantenimiento', color: 'light-danger' },
}

// ** Table Zero Config Column
export const multiLingColumns = [
  {
    name: 'ID',
    selector: 'id',
    sortable: true,
    maxWidth: '50px'
  },
  {
    name: 'Código',
    selector: 'codigo',
    sortable: true,
    minWidth: '100px'
  },
  {
    name: 'Capacidad Total',
    selector: 'capacidadTotal',
    sortable: true,
    minWidth: '100px'
  },
  {
    name: 'Capacidad Disponible',
    selector: 'capacidadDisponible',
    sortable: true,
    minWidth: '100px'
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
    name: 'Fecha de Mantenimiento',
    selector: 'fechaMantenimiento',
    sortable: true,
    minWidth: '180px'
  },
  {
    name: 'Acciones',
    minWidth: '100px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/vehicle/view/${row.id}`}
            className='w-100'
          >
            <FileText size={14} className='mr-50' />
            <span className='align-middle'>Ver Plan</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]