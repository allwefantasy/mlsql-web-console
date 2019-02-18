import * as React from "react";
import {Input, Button, Card, Select} from 'antd';
import {MLSQLAPI} from "../../service/MLSQLAPI";
import {USERS_URL, CLUSTER_MANAGER, USER_TAGS_UPDATE} from "../../service/BackendConfig";
import {MLSQLAuth} from "../../user/MLSQLAuth";

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

const Option = Select.Option;

export default class SetBackendTagsView extends React.Component {

    constructor(props) {
        super(props)
        this.mainPage = props.parent
        this.state = {tags: [], renderTags: [], renderUsers: []}
        this.tagSelectRef = React.createRef()
        this.userSelectRef = React.createRef()


        const self = this
        const auth = new MLSQLAuth()
        auth.user((jsonRes) => {
            const {userName, backendTags} = jsonRes
            if (backendTags) {
                console.log(backendTags.split(","))
                self.setState({tags: backendTags.split(",")})
            }
            self.renderTags()
            self.renderUsers()
        })
    }

    /**
     * This function is written in Prague O(∩_∩)O~
     * I'am happy and maybe this will reduce the bugs in
     * this code snippet.
     */
    renderTags = () => {
        const self = this
        const api = new MLSQLAPI(CLUSTER_MANAGER)
        api.request2({
            action: "/backend/list"
        }, (json) => {
            json.forEach((item) => {
                item["tag"].split(",").forEach((tag) => {
                    self.state.renderTags.push(<Option key={tag}>{tag}</Option>)
                })

            })
        }, (failStr) => {
            self.setState({msg: failStr})
        })
    }

    renderUsers = () => {
        const self = this
        const api = new MLSQLAPI(USERS_URL)
        api.request2({}, (json) => {
            json.forEach((name) => {
                self.state.renderUsers.push(<Option key={name}>{name}</Option>)

            })
        }, (failStr) => {
            self.setState({msg: failStr})
        })

    }


    setTag = (value) => {
        this.setState({updateTag: value})
    }

    setUser = (value) => {
        this.setState({updateUser: value})
    }

    setDefaultBackend = () => {
        const self = this
        const api = new MLSQLAPI(USER_TAGS_UPDATE)
        const tag = (this.state.updateTag || []).join(",")
        const users = (this.state.updateUser || []).join(",")
        if (tag) {
            api.request2({
                backendTags: tag,
                users: users
            }, (json) => {
                self.mainPage.switchToBackendList()
            }, (failStr) => {
                self.setState({msg: failStr})
            })
        }

    }

    render() {
        return (
            <div>
                Backend Tag:

                <div style={{"margin": "10px 0px"}}><Select
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder="Please select"
                    onChange={this.setTag}
                    ref={this.tagSelectRef}
                >
                    {this.state.renderTags}
                </Select>
                </div>
                For Users:
                <div style={{"margin": "10px 0px"}}><Select
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder="Please select"
                    onChange={this.setUser}
                    ref={this.userSelectRef}
                >
                    {this.state.renderUsers}
                </Select>
                </div>

                <Button type="primary" onClick={() => {
                    this.setDefaultBackend()
                }}>Update</Button>
                <div>

                </div>
                {this.state.msg && <div className="mlsql-backend-messagebox">{this.state.msg}</div>}

            </div>
        );
    }
}