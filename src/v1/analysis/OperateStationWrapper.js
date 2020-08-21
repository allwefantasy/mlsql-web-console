import React, { useState, useCallback, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import AnalysisWorkshop from './workshop';
import OperateStation from './OperateStation';
import { FullscreenOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components'

function OperateStationWrapper(props) {
    const ButtonGroup = styled.div`
      display:flex;
      align-items:right;    
    ` 
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
                <FormattedMessage id="operate_panel"/>                
                {/* <span style={{marginLeft:"50px",border:"2px dash"}}>
                 <Button type="primary">Apply</Button> 
                 <Divider type="vertical"/> <Button type="primary">Save As</Button> 
                 <Divider type="vertical"/> <Button>Rollback</Button> 
                </span> */}
                
                </>}>                    
                    <FullScreen handle={handle}>
                        <OperateStation ref={(et) => AnalysisWorkshop.workshop.stationRef = et} />
                    </FullScreen>
                </Collapse.Panel>
            </Collapse>

        </div>
    )
}
export { OperateStationWrapper }