import React, { useState, useContext, useEffect } from 'react';
import { Alert, Button, Form, Divider } from 'antd';
import UIMaker from '../../UIMaker';
import { AppContext } from '../../../App';
import { AppActionNames } from '../../app/actions/AppReducer';


function Done() {

    const { dispacher } = useContext(AppContext)    
    const {formItemLayout,tailLayout} = UIMaker.formLayout1()
    return <>
        <Alert
            message="Congratuation!"
            description="You have finished the setup of MLSQL Console."
            type="success"
        />
        <Divider></Divider>
        <Form {...formItemLayout}>
            <Form.Item {...tailLayout}>
                <Button type="primary" onClick={
                    ()=>{                        
                        dispacher({
                            type: AppActionNames.GO_ADMIN,
                            data: {}
                        })
                    }
                }>Go to Admin Page</Button>
                <Divider type="vertical" />
                <Button onClick={
                    ()=>{
                        dispacher({
                            type: AppActionNames.GO_CONSOLE,
                            data: {}
                        })
                    }
                }>Go to Console Page</Button>
            </Form.Item>

        </Form>
    </>
}

export default Done