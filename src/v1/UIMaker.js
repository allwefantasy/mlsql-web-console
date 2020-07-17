import * as React from 'react';
import Cookies from 'universal-cookie';
import { AccessToken } from '../backend_service/backend/RestConst';
class UIMaker {

    static setupLogin(res) {        
        const token = res.resp.headers.get(AccessToken.name)
        sessionStorage.setItem(AccessToken.name, token)
        const cookies = new Cookies();
        cookies.set(AccessToken.name, token, { path: '/' })
    }

    static logined(){
        return sessionStorage.getItem(AccessToken.name)
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