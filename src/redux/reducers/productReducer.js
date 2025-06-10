const initialState = {
    arr: [],
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PRODUCTS_LIST":
            return { ...state, arr: action.data };
        default:
            return state;
    }
};

export default productReducer;