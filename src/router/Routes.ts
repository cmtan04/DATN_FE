const ROUTER ="";

export const ROUTER_NAME ={
    SIGNIN: 'signin',
    SIGNUP: 'signup',
    HOME: 'home',
    LOCATIONS: 'locations',
    LOCATION_DETAIL: 'locations/:code',
    MAP: 'map',
    PROFILE: 'profile',
    CHAT: 'chat',
    MY_LOCATIONS: 'profile/locations',
    PACKAGE: "profile/package",  
}

export const ROUTER_PATH = {
    SIGNIN: `${ROUTER}/${ROUTER_NAME.SIGNIN}`,
    SIGNUP: `${ROUTER}/${ROUTER_NAME.SIGNUP}`,
    HOME: `${ROUTER}/${ROUTER_NAME.HOME}`,
    LOCATIONS: `${ROUTER}/${ROUTER_NAME.LOCATIONS}`,
    LOCATION_DETAIL: `${ROUTER}/${ROUTER_NAME.LOCATION_DETAIL}`,
    MAP: `${ROUTER}/${ROUTER_NAME.MAP}`,
    PROFILE: `${ROUTER}/${ROUTER_NAME.PROFILE}`,
    CHAT: `${ROUTER}/${ROUTER_NAME.CHAT}`,
    MY_LOCATIONS: `${ROUTER}/${ROUTER_NAME.MY_LOCATIONS}`,
    PACKAGE: `${ROUTER}/${ROUTER_NAME.PACKAGE}`,
}