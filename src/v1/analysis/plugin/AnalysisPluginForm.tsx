import React,{useEffect,useState,useRef, MutableRefObject} from 'react'
import { Form } from 'antd'
import { FormattedMessage } from 'react-intl'
import {useAnalysisPlugin} from '../../../common/useAnalysisPlugin'
import { FormInstance } from 'antd/lib/form'
interface Props {  
    pluginName:string,
    form:MutableRefObject<any> 
    analysisUtils:MutableRefObject<any> 
}

const AnalysisPluginForm:React.FunctionComponent<Props> = (props:Props) => {       
    const {ui,form,analysisUtils} = useAnalysisPlugin(props.pluginName)
    props.form.current = form
    props.analysisUtils.current = analysisUtils.current
    useEffect(()=>{
        // const fetch = async()=>{          
        // }
        // fetch()
       },[])    
    return <>
       {ui()}
    </>
    
}

export { AnalysisPluginForm }