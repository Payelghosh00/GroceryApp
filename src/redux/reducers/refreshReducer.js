const initialState = {
    arr: 0,
  };
  
  
  const refreshData = (state = initialState, action) => {
    switch (action.type) {
      case "SET_REFRESH":
        return { ...state, arr: action.data };
        default:
            return state;
    }
  };
  
  export default refreshData;