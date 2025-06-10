const initialState = {
    arr: [],
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ORDERS":
            return { ...state, arr: action.data };
        default:
            return state;
    }
};

export default orderReducer;