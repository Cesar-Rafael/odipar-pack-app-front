import axios from 'axios'

// ** Get all Data
export const getAllData = () => {
  return async dispatch => {
    await axios.get('http://localhost:8080/api/UnidadTransporte').then(response => {
      console.log(response.data)
      dispatch({
        type: 'GET_ALL_DATA',
        data: response.data
      })
    })
  }
}

// ** Get data on page or row change
export const getData = params => {
  return async dispatch => {
    await axios.get('http://localhost:8080/api/UnidadTrasporte', params).then(response => {
      console.log(response.data)
      dispatch({
        type: 'GET_DATA',
        data: response.data,
        //data: response.data.users,
        //totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get User
export const getVehicle = id => {
  return async dispatch => {
    await axios
      .get('/api/vehicles/vehicle', { id })
      .then(response => {
        dispatch({
          type: 'GET_VEHICLE',
          selectedVehicle: response.data.vehicle
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new user
export const addVehicle = vehicle => {
  return (dispatch, getState) => {
    axios
      .post('/apps/users/add-user', vehicle)
      .then(response => {
        dispatch({
          type: 'ADD_VEHICLE',
          vehicle
        })
      })
      .then(() => {
        dispatch(getData(getState().vehicles.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}