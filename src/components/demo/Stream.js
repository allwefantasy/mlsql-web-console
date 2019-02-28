import * as React from "react";
import BigDL from "./BigDL";

const ReactMarkdown = require('react-markdown')

export class NLP extends BigDL {
    generateSteps() {
        return [{
            title: 'Load Kafka/Mock data',
            content: this.generateView(0),
        }, {
            title: 'Parse the xml file',
            content: this.generateView(1),
        }, {
            title: 'Extract Label',
            content: this.generateView(2),
        }, {
            title: 'Run TFIDF',
            content: this.generateView(3),
        }, {
            title: 'Train/Register',
            content: this.generateView(4),
        }, {
            title: 'Predict',
            content: this.generateView(5),
        }];
    }
}