import React, { useState, useCallback, useEffect } from 'react';
import ActionMaker from "../../../ActionMaker"
import { AddJsonField } from "../AddJsonField"
import { JsonFieldsContext } from "../JsonFields"
import Tools from '../../../../common/Tools';

export const {handler:AddFieldActionHandler,action:AddFieldAction} = ActionMaker.buildHandler(async (action)=>{
    const {subFields,keyPaths,forms} = action.__state
    subFields.push(<AddJsonField key={Tools.getJobName()} context={JsonFieldsContext} keyPaths={keyPaths} forms={forms} />)    
    return {        
        data: {
            subFields
        }
    }
})