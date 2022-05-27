// ** Initial State
const initialState = {
    allData: [],
    data: [],
    total: 1,
    params: {},
    selectedOffice: null
  }
  
  const offices = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_ALL_DATA':
        return { ...state, allData: action.data }
      case 'GET_DATA':
        return {
          ...state,
          data: action.data,
          total: action.totalPages,
          params: action.params
        }
      case 'GET_OFFICE':
        return { ...state, selectedOffice: action.selectedOffice }
      case 'ADD_OFFICE':
        return { ...state }
      default:
        return { ...state }
    }
  }
  export default offices