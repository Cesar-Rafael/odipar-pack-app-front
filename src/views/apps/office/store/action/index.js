import axios from 'axios'

// ** Get all Data
export const getAllData = () => {
  return async dispatch => {
    await axios.get('http://localhost:8080/api/Oficina').then(response => {
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
    await axios.get('http://localhost:8080/api/Oficina', params).then(response => {
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
export const getOffice = id => {
  return async dispatch => {
    await axios
      .get('/api/offices/office', { id })
      .then(response => {
        dispatch({
          type: 'GET_OFFICE',
          selectedOffice: response.data.office
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new user
export const addOffice = office => {
  return (dispatch, getState) => {
    axios
      .post('/apps/users/add-user', office)
      .then(response => {
        dispatch({
          type: 'ADD_OFFICE',
          office
        })
      })
      .then(() => {
        dispatch(getData(getState().offices.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}