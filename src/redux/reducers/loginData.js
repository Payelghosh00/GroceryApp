const initialState = {
  arr: {}
};


const loginData = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return { ...state, arr: action.data };
    default:
      return state;
  }
};

export default loginData;
