import React from 'react'
import Dropzone from 'react-dropzone'
import {fromEvent} from 'file-selector';
import request from "superagent";
import {FILE_UPLOAD} from '../../service/BackendConfig'
import * as HTTP from "../../service/HTTPMethod";

const baseStyle = {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5
};
const activeStyle = {
    borderStyle: 'solid',
    borderColor: '#6c6',
    backgroundColor: '#eee'
};
const rejectStyle = {
    borderStyle: 'solid',
    borderColor: '#c66',
    backgroundColor: '#eee'
};

const fileListStyle = {
    display: 'flex'
}


export class UploadDropzone extends React.Component {

    constructor() {
        super()
        this.state = {
            files: []
        }

    }

    onDrop = (files) => {
        this.setState({files})
        const req = request.post(FILE_UPLOAD);
        req.set('Access-Token', sessionStorage.getItem(HTTP.AccessToken.name) || '')
        files.forEach(file => {
            req.attach(file.path, file);
        });

        req.end((err, res) => {
            this.setState({files: []})
            if (!err) {
                if (res.ok) {
                    this.setState({msg: "total files:" + files.length + " are uploaded. \n You can check the files with command: !hdfs -ls /tmp/upload; "})
                }
            } else {
                console.log(err)
                this.setState({msg: err.toString() + "\n Sometimes this caused by your upload space is not enough or backend fails"})
            }
        })
    }


    render() {

        const files = this.state.files.map(f => (
            <li key={f.name}>
                {f.path} - {f.size} bytes
            </li>
        ))

        return (
            <section style={fileListStyle}>
                <div>
                    <Dropzone onDrop={this.onDrop}
                              getDataTransferItems={evt => fromEvent(evt)}
                    >
                        {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles}) => {
                            let styles = {...baseStyle}
                            styles = isDragActive ? {...styles, ...activeStyle} : styles
                            styles = isDragReject ? {...styles, ...rejectStyle} : styles

                            return (
                                <div
                                    {...getRootProps()}
                                    style={styles}
                                >
                                    <input {...getInputProps()} />
                                    <div>
                                        {isDragAccept ? 'Drop' : 'Drag'} files here...
                                    </div>
                                    {isDragReject && <div>Unsupported file type...</div>}
                                </div>
                            )
                        }}
                    </Dropzone>
                </div>
                <aside>
                    <h4>{files.length === 0 ? "" : "Files"}</h4>
                    <ul>{files}</ul>
                </aside>
                <div>{this.state.msg ? this.state.msg : ""}</div>
            </section>
        );
    }
}