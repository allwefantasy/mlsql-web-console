import ETBaseTool from "./ETBaseTool";
import * as React from "react";

export class ETDownloadFile extends ETBaseTool {

    constructor(props) {
        super(props)
    }

    makeMLSQL = () => {
        const url = `/api_v1/public/file/download?fileName=${encodeURIComponent(this.data.pathV)}`
        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank"
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return ""
    }

    componentDidMount() {
    }

    render() {
        return super._render()
    }
}