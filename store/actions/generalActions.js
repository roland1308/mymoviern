import { SET_LANGUAGE, TOGGLE_BACK, IS_BACK_VISIBLE, IS_WORLD_VISIBLE, SET_HOME_BAR, SET_OTHER_BAR, SET_MESSAGE, SET_IS_LOGGED, SET_DETAIL_BAR } from '../constants';

export function setLanguage(lang) {
    return {
        type: SET_LANGUAGE,
        payload: lang
    }
}

export function toggleBack() {
    return {
        type: TOGGLE_BACK,
    }
}

export function isBackVisible(status) {
    return {
        type: IS_BACK_VISIBLE,
        payload: status
    }
}

export function isWorldVisible(status) {
    return {
        type: IS_WORLD_VISIBLE,
        payload: status
    }
}

export function setHomeBar() {
    return {
        type: SET_HOME_BAR,
    }
}

export function setOtherBar() {
    return {
        type: SET_OTHER_BAR,
    }
}

export function setDetailBar() {
    return {
        type: SET_DETAIL_BAR,
    }
}

export const setMessage = (msg) => ({
    type: SET_MESSAGE,
    payload: msg
});

export const setIsLogged = (status) => ({
    type: SET_IS_LOGGED,
    payload: status
});