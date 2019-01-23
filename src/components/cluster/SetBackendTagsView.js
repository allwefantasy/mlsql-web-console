import * as React from "react";
import {Input, Button, Card} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {CLUSTER_MANAGER, USER_TAGS_UPDATE} from "../../service/BackendConfig";
import {MLSQLAuth} from "../../user/MLSQLAuth";

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

export default class SetBackendTagsView extends React.Component {

    constructor(props) {
        super(props)
        this.mainPage = props.parent
        this.state = {"tags": ""}

        const self = this
        const auth = new MLSQLAuth()
        auth.user((jsonRes) => {
            const {userName, backendTags} = jsonRes
            self.setState({tags: backendTags})
        })
    }


    tags = () => {
        const self = this
        const auth = new MLSQLAuth()
        auth.user((jsonRes) => {
            const {userName, backendTags} = jsonRes
            self.setState({tags: backendTags})
        })
    }

    renderTags = () => {
        const tagsArray = []
        this.state.tags.split(",").forEach((item) => {
            tagsArray.push(<Card title={item}/>)
        })
        return tagsArray
    }

    setTag = (e) => {
        this.setState({updateTag: e.target.value})
    }

    setDefaultBackend = () => {
        const self = this
        const api = new MLSQLAPI(USER_TAGS_UPDATE)
        const tag = this.state.updateTag
        if (tag) {
            api.request2({
                backendTags: tag
            }, (json) => {
                self.mainPage.switchToSetBackendTags()
            }, (str) => {

            })
        }

    }

    render() {
        return (
            <div>
                New Tag:<Input
                placeholder="input tags"
                style={{width: 200, margin: "10px 10px"}}
                onChange={this.setTag}
            />
                <Button type="primary" onClick={() => {
                    this.setDefaultBackend()
                }}>Update</Button>

                <div style={{display: "flex"}}>{this.renderTags()}</div>
            </div>
        );
    }
}