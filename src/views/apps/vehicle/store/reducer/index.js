// ** Initial State
const initialState = {
    allData: [],
    data: [],
    total: 1,
    params: {},
    selectedVehicle: null
  }
  
  const vehicles = (state = initialState, action) => {
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
      case 'GET_VEHICLE':
        return { ...state, selectedVehicle: action.selectedVehicle }
      case 'ADD_VEHICLE':
        return { ...state }
      default:
        return { ...state }
    }
  }
  export default vehicles