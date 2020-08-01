import React, { useState, useCallback, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import AnalysisWorkshop from './workshop';
import OperateStation from './OperateStation';
import { FullscreenOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';

function OperateStationWrapper(props) {
    const handle = useFullScreenHandle();
    return (
        <div className="common-one-hundred-percent-width">
            <Collapse style={{marginBottom:"10px"}}>
                <Collapse.Panel header={<>
                    <Button icon={<FullscreenOutlined />} onClick={(evt)=>{
                evt.preventDefault()
                evt.stopPropagation()
                handle.enter(evt)
            }} />
                <Divider type="vertical"/>
                <FormattedMessage id="operate_panel"/></>}>                    
                    <FullScreen handle={handle}>
                        <OperateStation ref={(et) => AnalysisWorkshop.workshop.stationRef = et} />
                    </FullScreen>
                </Collapse.Panel>
            </Collapse>

        </div>
    )
}
export { OperateStationWrapper }