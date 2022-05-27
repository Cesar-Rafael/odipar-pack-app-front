import { Col } from 'reactstrap'
import MapView from './Map'
// ** Styles
import '@styles/react/apps/app-users.scss'


const Simulation = () => {
  return (
    <div className='app-simulation'>
    <Col sm='12'>
        <MapView/>
    </Col>
      
    </div>
  )
}

export default Simulation