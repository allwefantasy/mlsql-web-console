import * as React from "react";
import MainPage from './MainPage'

export class ClusterApp extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>
                <MainPage/>
            </div>
        )
    }
}