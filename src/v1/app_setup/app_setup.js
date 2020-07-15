import React, { useState, useReducer } from 'react';
import AppSetupReducer from './AppSetupReducer';
import { Steps, Divider, PageHeader, Alert, Form, Card, Button } from 'antd';
import styled from "styled-components"
import StepUserPassword from './StepUserPassword';
const { Step } = Steps;

const AppSetupContainer = styled.div`
display: flex;
flex-direction: column;
width:100%;
justify-content:center;
 align-items:  center;
`
const AppSetupHeader = styled.div`
  width:100%;
  margin-top:6px;
`

const AppSetupBody = styled.div`
 width:100%;
 display:flex;
 max-width: 800px;
 flex-direction: column;
`
const initState = {
    error: undefined,
    goNext: false,
    current: 0
}
const AppSetupContext = React.createContext()

function AppSetup() {
    const [state, dispacher] = useReducer(AppSetupReducer, initState)
    const {error}= state
    return (
        <AppSetupContext.Provider value={{ dispacher }}>
            <AppSetupContainer>
                <AppSetupHeader>
                    <PageHeader title="Setup MLSQL Console in 4 Steps"></PageHeader>
                </AppSetupHeader>
                <Divider></Divider>
                <AppSetupBody>
                    <Steps current={0}>
                        <Step title="User/Password" description="This is a description." />
                        <Step title="Login/Register" description="This is a description." />
                        <Step title="Engine/Configure" description="This is a description." />
                        <Step title="Done" description="This is a description." />
                    </Steps>
                    <Divider></Divider>
                    {error ? <Alert
                        message="Error Text"
                        description={error}
                        type="error"
                        closable                        
                    /> : <div></div>}
                    <Card>
                        <StepUserPassword></StepUserPassword>
                    </Card>
                </AppSetupBody>

            </AppSetupContainer>
        </AppSetupContext.Provider>
    )
}
export default AppSetup
export {
    AppSetupContext
}