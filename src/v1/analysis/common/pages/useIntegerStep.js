import React, { useState, useCallback, useEffect } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';



function useIntegerStep(props) {
    const [value,setValue] = useState(props.initialValue || 10)
    const ui =  ()=>(
        <Row>
        <Col span={12}>
          <Slider
            min={10}
            max={300}
            onChange={(value)=>{setValue(value)}}
            value={value}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={10}
            max={300}
            style={{ margin: '0 16px' }}
            value={value}
            onChange={(value)=>{setValue(value)}}
          />
        </Col>
      </Row> 
    )
    return {ui,value}
}
export {useIntegerStep}