import axios from 'axios'

// ** Get all Data
export const getAllData = () => {
  return async dispatch => {
    await axios.get('http://localhost:8080/api/Pedido').then(response => {
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
    await axios.get('http://localhost:8080/api/Pedido', params).then(response => {
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
export const getOrder = id => {
  return async dispatch => {
    await axios
      .get('/api/orders/order', { id })
      .then(response => {
        dispatch({
          type: 'GET_ORDER',
          selectedOrder: response.data.order
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new user
export const addOrder = order => {
  return (dispatch, getState) => {
    axios
      .post('/apps/users/add-user', order)
      .then(response => {
        dispatch({
          type: 'ADD_ORDER',
          order
        })
      })
      .then(() => {
        dispatch(getData(getState().orders.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}