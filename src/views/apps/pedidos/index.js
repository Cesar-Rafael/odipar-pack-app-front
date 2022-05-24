// ** User List Component
import Table from './Table'
import React from 'react'
// ** Styles
import '@styles/react/apps/app-users.scss'


import axios from 'axios'

const PedidosList = () => {

  const obtenerDatos = async () => {
    const data = await axios.get('http://localhost:8080/api/Pedido')
    const user = data.response
    console.log(user)
  }

  const [pedido, setPedido] = React.useState(null)
  React.useEffect(() => {
    obtenerDatos()
  }, [])

  return (
    <div className='app-user-list'>  
      <Table/>
      {/**/}
    </div>
  )
}

export default PedidosList