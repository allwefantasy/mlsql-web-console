import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { WindowStationReducer, WindowStationHandlers } from './actions/WindowStationReducer';
import "../join/JoinStation.scss"
import { Form, Select, Steps } from 'antd';
import styled from 'styled-components'
import { BuildGroup } from './pages/BuildGroup';
import { SetupGroupRowOrder } from './pages/SetupGroupRowOrder';
import { BuildWindowOnGroup } from './pages/BuildWindowOnGroup';
import { ApplyFunction } from './pages/ApplyFunction';
const { Step } = Steps;

const StepContent = styled.div`
border: 1px dashed #e9e9e9;
border-radius: 6px;
background-color: #fafafa;
min-height: 200px;
padding: 30px 30px;
width: 100%;
display:flex;
align-items:center;
justify-content:center;
flex-direction: column;
`


const WindowStationContext = React.createContext()

function WindowStation(props) {
    const workshop = props.parent.workshop
    const initState = {
        steps: [<BuildGroup workshop={workshop}/>,
        <SetupGroupRowOrder workshop={workshop}/>,
        <BuildWindowOnGroup workshop={workshop}/>,
        <ApplyFunction workshop={workshop}/>
    ],
        current: 0,
        result:{
            groupFields: [],
            orderFields: [],
            rowWindows: []            
        }
    }
    const [state, dispacher] = useReducerAsync(WindowStationReducer, initState, WindowStationHandlers)
    const { steps, current } = state
    return (
        <WindowStationContext.Provider value={{ dispacher }}>
            <div className="join-app">               
                <div style={{marginTop:"30px"}}>
                    <Steps current={current}>
                        <Step key={0} title="Build Group" description="Choose fields to group data" />
                        <Step key={1} title="Setup Group Row Order" description="Choose fields to order the data in group" />
                        <Step key={2} title="Build Window" description="Build window on every row of every group" />
                        <Step key={3} title="Apply Function" description="Apply functions to all windows we have created" />
                    </Steps>
                </div>
                <div className="join-app-form"> 
                    <StepContent>{steps[current]} </StepContent> 
                </div>
            </div>
        </WindowStationContext.Provider>
    )
}
export { WindowStation, WindowStationContext }