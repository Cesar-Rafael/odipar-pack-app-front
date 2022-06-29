import { Badge } from "reactstrap"

const status = {
  ALMACEN: { title: 'Almacén', color: 'light-primary' },
  OFICINA: { title: 'Oficina', color: 'light-info' }
}

const statusRegion = {
  COSTA: { title: 'Costa', color: 'light-warning' },
  SIERRA: { title: 'Sierra', color: 'light-info' },
  SELVA: { title: 'Selva', color: 'light-success' }
}

export const multiLingColumns = [
  {
    name: 'Ubigeo',
    selector: 'ubigeo',
    sortable: true,
    minWidth: '50px'
  },
  {
    name: 'Region',
    selector: 'region',
    sortable: true,
    minWidth: '100px',
    cell: row => {
      return (
        <Badge color={statusRegion[row.region].color} pill>
          {statusRegion[row.region].title}
        </Badge>
      )
    }
  },
  {
    name: 'Departamento',
    selector: 'departamento',
    sortable: true,
    minWidth: '100px'
  },
  {
    name: 'Provincia',
    selector: 'provincia',
    sortable: true,
    minWidth: '100px'
  },
  {
    name: 'Latitud',
    selector: 'latitud',
    sortable: true,
    minWidth: '80px'
  },
  {
    name: 'Longitud',
    selector: 'longitud',
    sortable: true,
    minWidth: '140px'
  },
  {
    name: 'Tipo',
    selector: 'Tipo',
    sortable: true,
    minWidth: '100px',
    cell: row => {
      return (
        <Badge color={status[row.tipo].color} pill>
          {status[row.tipo].title}
        </Badge>
      )
    }
  },
]