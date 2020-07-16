import React, { useState, useReducer, useEffect } from 'react';
import {AppSetupReducer,AppSetupReducerHandlers} from './actions/app/AppSetupReducer';
import { Steps, Divider, PageHeader, Alert, Form, Card, Button } from 'antd';
import styled from "styled-components"
import StepUserPassword from './StepUserPassword';
import { useReducerAsync } from "use-reducer-async"
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
    current: 0
}
const AppSetupContext = React.createContext()

function AppSetup() {

    const [state, dispacher] = useReducerAsync(AppSetupReducer, initState, AppSetupReducerHandlers)

    const { error, current } = state

    return (
        <AppSetupContext.Provider value={{ dispacher }}>
            <AppSetupContainer>
                <AppSetupHeader>
                    <PageHeader title="Setup MLSQL Console in 4 Steps"></PageHeader>
                </AppSetupHeader>
                <Divider></Divider>
                <AppSetupBody>
                    <Steps current={current}>
                        <Step title="User/Password" description="This is a description." />                        
                        <Step title="Engine/Configure" description="This is a description." />
                        <Step title="Done" description="This is a description." />
                    </Steps>
                    <Divider></Divider>
                    {error ? <Alert
                        message="Message"
                        description={error}
                        type="error"
                        closable
                    /> : <div></div>}
                    {
                        current === 0 ? <Card>
                            <StepUserPassword></StepUserPassword>
                        </Card> : <div></div>
                    }
                    {
                        current === 1 ? <Card>
                            wowow1
                        </Card> : <div></div>
                    }
                    {
                        current === 2 ? <Card>
                            woww2
                        </Card> : <div></div>
                    }
                </AppSetupBody>

            </AppSetupContainer>
        </AppSetupContext.Provider>
    )
}
export default AppSetup
export {
    AppSetupContext
}