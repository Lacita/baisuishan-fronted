import Cookies from 'js-cookie'

const TokenKey = "BSS-TOKEN";

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(type,token) {
    let now = new Date();
    let exp = now.setHours(now.getHours() + 167);
    return Cookies.set(TokenKey, `BssAuth${type}${token}`, {
        expires: new Date(exp)
    })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
