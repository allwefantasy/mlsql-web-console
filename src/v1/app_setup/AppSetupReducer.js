function AppSetupReducer(state, action) {
    switch(action.type) {
        case AppSetupEventConst.REGISTER_ADMIN:
            console.log(action)
            return {
                ...state,
                error: "Sorry fail"
            }            
        default: 
            return state;
    }    
}

class AppSetupEventConst {
    static REGISTER_ADMIN = "registerAdmin"    
}

export default AppSetupReducer
export {
    AppSetupEventConst
}
