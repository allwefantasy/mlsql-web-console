import React,{useEffect,useState} from 'react'
interface Props {   
}

const Doc = (props:Props) => {

    return (
        <>
            <iframe
                sandbox="allow-scripts"
                style={{width: '100%', height: "600px"}}
                src={"http://docs.mlsql.tech/mlsql-console/"}
                frameBorder="0"
                scrolling="yes"
            />
        </>
    )
    
}

export { Doc }