// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

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
    name: 'Cliente',
    selector: 'nombreCompletoCliente',
    sortable: true,
    minWidth: '200px'
  },
  {
    name: 'Correo Cliente',
    selector: 'correoCliente',
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
    name: 'Paquetes no Asignados',
    selector: 'cantPaquetesNoAsignado',
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

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <p>
        <span className='font-weight-bold'>City:</span> {data.city}
      </p>
      <p>
        <span className='font-weight-bold'>Experience:</span> {data.experience}
      </p>
      <p className='m-0'>
        <span className='font-weight-bold'>Post:</span> {data.post}
      </p>
    </div>
  )
}

// ** Table Common Column
export const columns = [
  {
    name: 'Name',
    selector: 'full_name',
    sortable: true,
    minWidth: '250px',
    cell: row => (
      <div className='d-flex align-items-center'>
        {row.avatar === '' ? (
          <Avatar color={`light-${states[row.status]}`} content={row.full_name} initials />
        ) : (
          <Avatar img={require(`@src/assets/images/portrait/small/avatar-s-${row.avatar}`).default} />
        )}
        <div className='user-info text-truncate ml-1'>
          <span className='d-block font-weight-bold text-truncate'>{row.full_name}</span>
          <small>{row.post}</small>
        </div>
      </div>
    )
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Date',
    selector: 'start_date',
    sortable: true,
    minWidth: '150px'
  },

  {
    name: 'Salary',
    selector: 'salary',
    sortable: true,
    minWidth: '150px'
  },
  {
    name: 'Age',
    selector: 'age',
    sortable: true,
    minWidth: '100px'
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
    minWidth: '150px',
    cell: row => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: row => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ml-50'>Details</span>
              </DropdownItem>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <Archive size={15} />
                <span className='align-middle ml-50'>Archive</span>
              </DropdownItem>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <Trash size={15} />
                <span className='align-middle ml-50'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]

// ** Table Intl Column
export const multiLingColumns = [
  {
    name: 'Name',
    selector: 'full_name',
    sortable: true,
    minWidth: '200px'
  },
  {
    name: 'Position',
    selector: 'post',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Date',
    selector: 'start_date',
    sortable: true,
    minWidth: '150px'
  },

  {
    name: 'Salary',
    selector: 'salary',
    sortable: true,
    minWidth: '150px'
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
    minWidth: '150px',
    cell: row => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: row => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <FileText size={15} />
                <span className='align-middle ml-50'>Details</span>
              </DropdownItem>
              <DropdownItem>
                <Archive size={15} />
                <span className='align-middle ml-50'>Archive</span>
              </DropdownItem>
              <DropdownItem>
                <Trash size={15} />
                <span className='align-middle ml-50'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]

// ** Table Server Side Column
export const serverSideColumns = [
  {
    name: 'Full Name',
    selector: 'full_name',
    sortable: true,
    minWidth: '225px'
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Position',
    selector: 'post',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Office',
    selector: 'city',
    sortable: true,
    minWidth: '150px'
  },
  {
    name: 'Start Date',
    selector: 'start_date',
    sortable: true,
    minWidth: '150px'
  },
  {
    name: 'Salary',
    selector: 'salary',
    sortable: true,
    minWidth: '150px'
  }
]

// ** Table Adv Search Column
export const advSearchColumns = [
  {
    name: 'Name',
    selector: 'full_name',
    sortable: true,
    minWidth: '200px'
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'Post',
    selector: 'post',
    sortable: true,
    minWidth: '250px'
  },
  {
    name: 'City',
    selector: 'city',
    sortable: true,
    minWidth: '150px'
  },
  {
    name: 'Date',
    selector: 'start_date',
    sortable: true,
    minWidth: '150px'
  },

  {
    name: 'Salary',
    selector: 'salary',
    sortable: true,
    minWidth: '100px'
  }
]

export default ExpandableTable
