import BigDL from "./BigDL";

export class NLP extends BigDL {
    generateSteps = () => {
        return [{
            title: 'Download Dataset SogouCS.WWW08',
            content: this.generateView(0),
        }, {
            title: 'Parse the xml file',
            content: this.generateView(1),
        }, {
            title: 'Extract Label',
            content: this.generateView(2),
        }, {
            title: 'Train',
            content: this.generateView(3),
        }, {
            title: 'Predict',
            content: this.generateView(4),
        }];
    }
    generateTechData = () => {

    }
    generateCommandData = () => {
    }
}