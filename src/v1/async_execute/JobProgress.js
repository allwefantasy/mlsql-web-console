import * as React from "react";
import Timer from "react-compound-timer"
import {Collapse,Table, Button} from 'antd';
import EngineService from "../service/EngineService";

export default class JobProgress extends React.Component {
    constructor(props) {
        super(props)
        this.queryPanel = props.parent
        this.state = {loading: false, jobs: {}, dataSource: [], currentSQL: {}, totalTime: "0s", currentJobGroup: ""}
        this.columns = [
            {
                title: "Job Id(Job Group)",
                dataIndex: "title",
                key: "title"

            },
            {
                title: "Duration",
                dataIndex: "duration",
                key: "duration"
            }
            ,
            {
                title: "Tasks(for all stages)： Succeeded/Total",
                dataIndex: "tasks",
                key: "tasks",
                render: (text, record, index) => {
                    const percent = 2 * record.progress
                    return <div>
                        {text}
                        <div style={{width: "200px", height: "30px", backgroundColor: "yellow"}}>
                            <div style={{width: percent + "px", height: "100%", backgroundColor: "green"}}>
                            </div>
                        </div>
                    </div>
                }
            }
        ]
    }

    enter = (params) => {
        this.setState({loading: true, jobs: {}, dataSource: [], currentSQL: {}, totalTime: "0s", currentJobGroup: ""})
        this.intervalTimer = setInterval(async () => {
            const jobName = this.queryPanel.executor.jobName
            const currentSQL = await EngineService.currentSQL(this.state.currentJobGroup || jobName)
            const jobs = await EngineService.jobProgress2(this.state.currentJobGroup || jobName)
            if (jobs.activeJobs && jobs.activeJobs.length !== 0) {
                if (!this.state.currentJobGroup) {
                    this.setState({currentJobGroup: jobs.groupId})
                }
                this.makeProgress(jobs, currentSQL)
            }
        }, 1000)
    }

    exit = () => {
        if (this.intervalTimer) {
            setTimeout(() => {
                clearInterval(this.intervalTimer)
                this.intervalTimer = null
            }, 3000)
            this.finalTime = this.state.totalTime
            this.setState({loading: false})
        }
    }

    makeProgress = (temp, currentSQL) => {
        if (temp.activeJobs) {
            const jobs = temp.activeJobs
            const dataSource = jobs.map(job => {
                return {
                    jobId: job.jobId,
                    duration: job.duration,
                    total: job.numTasks - job.numSkippedTasks,
                    numKilledTasks: job.numKilledTasks,
                    skipped: job.numSkippedTasks,
                    failed: job.numFailedTasks,
                    completed: job.numCompletedIndices,
                    started: job.numActiveTasks

                }
            }).map(item => {
                    const percent = parseInt((item.completed / item.total * 100) + "")
                    let runningStr = ""
                    if (item.failed === 0 && item.skipped === 0 && item.started > 0) {
                        runningStr += `(${item.started} running)`
                    }
                    if (item.failed > 0) {
                        runningStr += `(${item.failed} failed)`
                    }
                    if (item.skipped > 0) {
                        runningStr += `(${item.skipped} skipped)`
                    }
                    if (item.numKilledTasks > 0) {
                        runningStr += `(${item.numKilledTasks} killed)`
                    }

                    let duration = item.duration + " ms"
                    if (item.duration > 1000) {
                        duration = parseInt((item.duration / 1000) + "") + " s"
                    }

                    return {
                        title: `${item.jobId}(${temp.groupId})`,
                        duration: duration,
                        tasks: `${item.completed}/${item.total}${runningStr}`,
                        progress: percent
                    }
                }
            )
            let _cur = currentSQL
            if (currentSQL.isFinish) {
                _cur = this.state.currentSQL
                _cur["currentJobIndex"] = _cur["totalJobs"]
            }
            if (this.timer) {
                const totalTime = (this.timer.getTime() / 1000).toFixed(2) + "s"
                this.setState({dataSource, currentSQL: _cur, totalTime})
                return
            }
            this.setState({dataSource, currentSQL: _cur})
        }
    }

    showSQL = () => {
        return this.state.currentSQL.currentJobIndex && <h3>
            sql:
            [{this.state.currentSQL.currentJobIndex}/{this.state.currentSQL.totalJobs}: {this.state.currentSQL.script}]
        </h3>
    }

    render() {
        if (!this.state.loading) {
            if (this.finalTime) {
                return <div>
                    <Button type="primary" style={{margin: "0px 0px 20px 0px"}}>
                        Time Cost: {this.finalTime}
                    </Button>
                    <div>
                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel header={this.showSQL()} key="1">
                                <Table dataSource={this.state.dataSource} columns={this.columns}/>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                </div>
            } else {
                return <div></div>
            }
        }
        return <div>
            <Button type="primary" style={{margin: "0px 0px 20px 0px"}}>
                Time Cost:<Timer ref={(et) => this.timer = et}>
                <Timer.Minutes formatValue={value => `${value} m. `}/>
                <Timer.Seconds formatValue={value => `${value} s. `}/>
            </Timer></Button>
            <div>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header={this.showSQL()} key="1">
                        <Table dataSource={this.state.dataSource} columns={this.columns}/>
                    </Collapse.Panel>
                </Collapse>
            </div>
        </div>
    }
}