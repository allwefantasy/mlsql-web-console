import React, { useState, useReducer, useEffect } from 'react';
import { AppSetupReducer, AppSetupReducerHandlers } from './actions/app/AppSetupReducer';
import { Steps, Divider, PageHeader, Alert, Form, Card, Button } from 'antd';
import styled from "styled-components"
import StepUserPassword from './pages/StepUserPassword';
import AddEngines from './pages/AddEngines'
import { useReducerAsync } from "use-reducer-async"
import Done from './pages/Done';
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
    current: 1
}
const AppSetupContext = React.createContext()

function AppSetup() {

    const [state, dispacher] = useReducerAsync(AppSetupReducer, initState, AppSetupReducerHandlers)

    const { error, current } = state

    return (
        <AppSetupContext.Provider value={{ dispacher }}>
            <AppSetupContainer>
                <AppSetupHeader>
                    <PageHeader title="Setup MLSQL Console in 2 Steps"></PageHeader>
                </AppSetupHeader>
                <Divider></Divider>
                <AppSetupBody>
                    <Steps current={current}>
                        <Step title="Admin User/Password" description="Setup Admin accout" />
                        <Step title="Add Engines" description="Add default MLSQL Engine" />
                        <Step title="Done" description="Congratuation" />
                    </Steps>
                    <Divider></Divider>
                    {error && <Alert
                        message="Message"
                        description={error}
                        type="error"
                        closable
                    />}
                    {
                        current === 0 && <Card>
                            <StepUserPassword></StepUserPassword>
                        </Card>
                    }
                    {
                        current === 1 && <Card>
                            <AddEngines></AddEngines>
                        </Card>
                    }
                    {
                        current === 2 && <Card>
                            <Done></Done>
                        </Card>
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