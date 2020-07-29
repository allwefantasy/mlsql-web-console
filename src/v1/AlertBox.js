import React, { useState, useCallback, useEffect } from 'react';

import styled from 'styled-components'
import { Alert } from 'antd';

const AlertBoxW = styled.div`
  width: 100%;    
  margin: 0px 10px 10px 0px;
`
function AlertBox(props){
    return <AlertBoxW>
        <Alert {...props} closable type={props.type||"error"} message={props.title || "Message"} description={props.message}></Alert>
    </AlertBoxW>
}

export default AlertBox