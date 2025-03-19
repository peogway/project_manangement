import { createSlice } from "@reduxjs/toolkit";
import categoryService from "../services/category";
import { getToken, isTokenExpired } from "../services/login";
import { rmUserFn } from "./userReducer";

const initialState = [];

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        createCategory(state, action) {
            state.push(action.payload);
        },
        setCategories(state, action) {
            return action.payload;
        },
        dltCategory(state, action) {
            return state.filter((category) => category.id !== action.payload);
        },
        editCategory(state, action) {
            const id = action.payload.id;
            return state.map((category) =>
                category.id !== id
                    ? category
                    : { ...category, ...action.payload }
            );
        },
    },
});

export const { createCategory, setCategories, dltCategory, editCategory } =
    categorySlice.actions;

export const createNewCategory = (category) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        const newCategory = await categoryService.addCategory(category);
        dispatch(createCategory(newCategory));
    };
};

export const setAllCategories = () => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        const categories = await categoryService.getAll();
        dispatch(setCategories(categories));
    };
};

export const updateCategory = (category) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        await categoryService.editCategory(category);
        dispatch(editCategory(category));
    };
};

export const deleteCategory = (cateId) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        await categoryService.deleteCategory(cateId);
        dispatch(dltCategory(cateId));
    };
};

export default categorySlice.reducer;
