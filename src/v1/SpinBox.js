import React, { useState, useCallback, useEffect } from 'react';

import styled from 'styled-components'
import { Spin } from 'antd';

const SpinBoxW = styled.div`
  width: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 30px;
`
function SpinBox(){
    return <SpinBoxW>
        <Spin tip="Loading...."/>
    </SpinBoxW>
}

export default SpinBox