const initialState = {
    arr: {},
};

const productDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PRODUCTS_DETAIL":
            return { ...state, arr: action.data };
        default:
            return state;
    }
};

export default productDetailReducer;