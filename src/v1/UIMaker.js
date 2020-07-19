import * as React from 'react';
import Cookies from 'universal-cookie';
import { AccessToken } from '../backend_service/backend/RestConst';
class UIMaker {

    static setupLogin(res) {  
        const user = {userName:res.content.name, role:res.content.role}
        const token = res.resp.headers.get(AccessToken.name)
        sessionStorage.setItem(AccessToken.name, token)
        sessionStorage.setItem("user",JSON.stringify(user))
        const cookies = new Cookies();
        cookies.set(AccessToken.name, token, { path: '/' })
    }

    static isAdmin(){
        const userStr = sessionStorage.getItem("user") 
        if(!userStr) return false
        const user = JSON.parse(userStr)
        if(user.role==="admin") return true
        return false
    }

    static logined(){
        if(sessionStorage.getItem(AccessToken.name)) {
            return true
        }
        return false
    }
    static formLayout2() {
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 4,
                },
                sm: {
                    span: 8,
                },
            },
            wrapperCol: {
                xs: {
                    span: 4,
                },
                sm: {
                    span: 8,
                },
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 8,
                span: 16,
            },
        };
        return { formItemLayout, tailLayout } 
    }
    static formLayout1() {
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 8,
                },
            },
            wrapperCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 16,
                },
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 8,
                span: 16,
            },
        };
        return { formItemLayout, tailLayout }
    }
}

export default UIMaker