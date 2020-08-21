import React, { useState, useEffect } from 'react'
import { useReducerAsync } from 'use-reducer-async'
import { PivotStationReducer, PivotStationHandlers, PivotStationActionNames } from './actions/PivotStationReducer'
import { FormattedMessage } from 'react-intl'
import { List, Form, Input, Checkbox, Divider } from 'antd'
import AnalysisWorkshop from '../workshop'
import { Schema } from '../../../beans/dst'
import './PivotStation.scss'
import { useDrop, useDrag } from 'ahooks';
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback'
import { CommonActionNames } from '../common/CommonActionNames'
import AlertBox from '../../AlertBox'
import { PivotApplyValues } from './actions/PivotApplyAction'
import {useAggCheck} from './useAggCheck'

interface Props {
}

const initState = {
  columnLeft: null,
  columnHeader: null,
  columnSum: null,
  applySaveRollbackDispacher: undefined,
  error: undefined,  
}

const PivotStationContext = React.createContext<{ state: any, dispacher: React.Dispatch<any> } | null>(null)

const PivotStation: React.FunctionComponent<Props> = (props) => {
  const workshop = AnalysisWorkshop.workshop
  const schema = workshop.currentTable.schema as Schema
  const schemaForList = schema.fields.map(field => (field.name))
  const [state, dispacher] = useReducerAsync(PivotStationReducer, initState, PivotStationHandlers)

  const { columnLeft, columnHeader, columnSum, applySaveRollbackDispacher, error } = state

  

  const [dragging, setDragging] = useState<string | null>(null);

  const getDragProps = useDrag({
    onDragStart: (data) => {
      setDragging(data);
    },
    onDragEnd: () => {
      setDragging(null);
    },
  });

  const [dropPropHeader, { isHovering: isHoveringHeader }] = useDrop({
    onDom: (content: string, e) => {
      dispacher({
        type: CommonActionNames.setState,
        data: {
          columnHeader: content
        }
      })
    },
  });

  const [dropPropsLeftHeader, { isHovering: isHoveringLeftHeader }] = useDrop({
    onDom: (content: string, e) => {
      dispacher({
        type: CommonActionNames.setState,
        data: {
          columnLeft: content
        }
      })
    },
  });

  const [dropPropsSum, { isHovering: isHoveringSum }] = useDrop({
    onDom: (content: string, e) => {
      dispacher({
        type: CommonActionNames.setState,
        data: {
          columnSum: content
        }
      })
    },
  });

  const tips = (isHover: boolean, columnName: string | null) => {
    return isHover ? <FormattedMessage id="drop_column" /> : (columnName ? columnName : <FormattedMessage id="drag_column" />)
  }

  useEffect(() => {
    if (applySaveRollbackDispacher) {
      
      dispacher({
        type:CommonActionNames.setState,
        data: {error:undefined}
      })

      const {aggs} = aggForm.getFieldsValue()
      const values: PivotApplyValues = { columnHeader, columnSum, columnLeft, sunFunc:aggs }
      dispacher({
        type: PivotStationActionNames.PivotApply,
        data: {
          workshop,
          values
        }
      })
    }
  }, [applySaveRollbackDispacher])

  const {ui:aggUI,form:aggForm} = useAggCheck()

  return (
    <PivotStationContext.Provider value={{ state, dispacher }}>
      {
        error && <AlertBox message={error}></AlertBox>
      }
      <div className="pivot-station-commands"><ApplySaveRollback context={PivotStationContext} workshop={workshop} /></div>
      <div className="pivot-station-app">
        <div className="pivot-station-fields">
          <List
            className="pivot-station-fields-list"
            header={<><Input placeholder="search" /></>}
            bordered
            dataSource={schemaForList}
            renderItem={item => (
              <List.Item >
                <div {...getDragProps(item)}>{item}</div>
              </List.Item>
            )}
          />
        </div>
        <div className="pivot-station-bigbox">
          <div className="pivot-station-left" {...dropPropsLeftHeader}>
            <span className="pivot-common-font"><FormattedMessage id="column_left" /> </span><br /> {tips(isHoveringLeftHeader, columnLeft)}</div>
          <div className="pivot-station-body">
            <div className="pivot-station-header" {...dropPropHeader}>
              <span className="pivot-common-font"><FormattedMessage id="column_header" /></span> <br />{tips(isHoveringHeader, columnHeader)}
            </div>
            <div className="pivot-station-content" {...dropPropsSum}>
              <span className="pivot-common-font"><FormattedMessage id="column_sum" /></span> <br /> {tips(isHoveringSum, columnSum)}              
              <Divider/> 
              {aggUI()}             
            </div>
          </div>
        </div>
      </div>
    </PivotStationContext.Provider>
  )
}

export { PivotStation, PivotStationContext }