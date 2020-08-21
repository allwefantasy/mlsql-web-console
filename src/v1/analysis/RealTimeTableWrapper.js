import React, { useState, useCallback, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import AnalysisWorkshop from './workshop';
import RealTimeViewTable from './RealTimeViewTable';
import { Button, Card, Collapse, Divider } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

function RealTimeTableWrapper(props) {
    const handle = useFullScreenHandle();
    return (
        <Collapse defaultActiveKey={"1"} style={{ marginBottom: "30px",width: "100%" }}>
            <Collapse.Panel key="1" header={<>
            {AnalysisWorkshop.workshop.sessionId && <>            
            <Button icon={<FullscreenOutlined />} onClick={(evt)=>{
                evt.preventDefault()
                evt.stopPropagation()
                handle.enter(evt)
            }} />
            <Divider type="vertical"/>
            </>}            
            <FormattedMessage id="data_panel" /></>}>
                <FullScreen handle={handle}>                    
                    <RealTimeViewTable tableStyle={{ width: "90%" }} ref={(et) => AnalysisWorkshop.workshop.displayRef = et} />
                </FullScreen>
            </Collapse.Panel>
        </Collapse>
    )
}
export { RealTimeTableWrapper }