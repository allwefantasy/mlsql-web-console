import * as React from "react";
import BigDL from "./BigDL";

const ReactMarkdown = require('react-markdown')

export class NLP extends BigDL {

    constructor(props) {
        super(props)
    }

    generateSteps() {
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

    generateTechData() {
        return [
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Tools/Download uploaded file to Editor",
                "Step 3: An dialog will be opened, fill field [from] with 'public/SogouCS.reduced.tar' and field [to] with '/tmp/nlp/sogo'",
                "Step 4: Click Ok in dialog",
                "Step 5: Click button Run(it will take a while.)"
            ],
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Load/Save Data/Load data",
                <ReactMarkdown source={`
                |
                |Step 3: An dialog will be opened,
                |fill field [path] with '/tmp/nlp/sogo' and field [Output table] with 'xmlData',
                |specify rowTag to doc and charset to GBK
                |"
                |
                `.stripMargin()}/>,
                "Step 4: Click Ok in dialog",
                "Step 5: Use SQL to filter _corrupt_record",
                "Step 6: Click button Run(it will take a while.)"
            ],
            [
                <ReactMarkdown source={`
                | Step 0: We will treat url as label source, we use SQL to extract label from url:
                |
                |
                |\`\`\`
                |-- http://sports.sohu.com/20070422/n249599819.shtml extract sports from url
                |select temp.* from (select split(split(url,"/")[2],"\\\\.")[0] as labelStr,content from xmlData) as temp
                |where temp.labelStr is not null
                |as rawData;
                |\`\`\`
                |
                |For now , the label is string, we should convert them to number

                `.stripMargin()}/>,

                <ReactMarkdown source={`
                |Step 1:  Drag Tools/Convert String to number, a dialog will open,
                |
                |\`\`\`
                |     1. set Input table as rawData,
                |     2. Set save path as /tmp/nlp/label_mapping
                |     3. Set inputCol as labelStr
                |     4. Set outputCol as label
                |     5. set Output table as rawDataWithLabel
                |     6. set functionName table as rawDataWithLabel
                |\`\`\`
                |We can use the functionName in SQL to convert String to number or number to String.
                `.stripMargin()}/>
            ],
            [
                <ReactMarkdown source={`
                |Step 0:  Drag Algorithms/TfIdf, a dialog will open,
                |
                |\`\`\`
                |         1. set Input table as rawDataWithLabel,
                |         2. Set save path as /tmp/nlp/tfidf
                |         3. Set inputCol as content
                |         4. Set nGrams as 2
                |         5. set Output table as trainData
                |\`\`\`
                |Click Ok in dialog
                `.stripMargin()}/>,
                <ReactMarkdown source={`
                |Step 1:  Drag [Register model as Function]/[Register Model As Function], a dialog will open,
                |
                |\`\`\`
                |         1. set Function name  as tfidf_predict,
                |         2. Set Model saved path as /tmp/nlp/tfidf
                |         3. Set et as TfIdfInPlace
                |\`\`\`
                |Click Ok in dialog
                `.stripMargin()}/>,

                "Step 2: Click button Run(it will take a while.)"

            ],
            [
                <ReactMarkdown source={`
                |Step 0:  Drag Algorithms/RandomForest, a dialog will open,
                |
                |\`\`\`
                |         1. set tableName as trainData,
                |         2. Set Model save path as /tmp/nlp/rf
                |\`\`\`
                |Click Ok in dialog
                `.stripMargin()}/>,
                <ReactMarkdown source={`
                |Step 1:  Drag [Register model as Function]/[Register Model As Function], a dialog will open,
                |
                |\`\`\`
                |         1. set Function name  as rf_predict,
                |         2. Set Model saved path as /tmp/nlp/rf
                |         3. Set et as RandomForest
                |\`\`\`
                |Click Ok in dialog
                `.stripMargin()}/>,

                "Step 2: Click button Run(it will take a while.)"

            ],
            [
                <ReactMarkdown source={`
                |Paste:
                |
                |\`\`\`sql
                |select rf_predict(tfidf_predict("china is cool")) as predicted as output;
                |\`\`\`
                `.stripMargin()}/>,
                "Step 2: Click button Run(it will take a while.)"

            ]

        ]

    }

    generateCommandData() {
        return [
            `run command as DownloadExt.\`\` where 
             |from="public/SogouCS.reduced.tar" and
             |to="/tmp/nlp/sogo";`.stripMargin(),

            `load xml.\`/tmp/nlp/sogo\` where rowTag="doc" and charset="GBK" as xmlData;
            |select * from xmlData where _corrupt_record is null as xmlData; 
            `.stripMargin(),

            `-- http://sports.sohu.com/20070422/n249599819.shtml extract sports from url
            |select temp.* from (select split(split(url,"/")[2],"\\\\.")[0] as labelStr,content from xmlData) as temp 
            |where temp.labelStr is not null 
            |as rawData;
            |-- select distinct(split(split(url,"/")[2],"\\\\.")[0]) as labelStr from rawData as output;
            |-- select split(split(url,"/")[2],"\\\\.")[0] as labelStr,url from rawData as output;
            |
            |run rawData as StringIndex.\`/tmp/nlp/label_mapping\` where inputCol="labelStr"and
            |outputCol="label" ;
            |predict rawData as StringIndex.\`/tmp/nlp/label_mapping\` as rawDataWithLabel;
            |register StringIndex.\`/tmp/nlp/label_mapping\` as convert_label; `.stripMargin(),


            `train rawDataWithLabel as TfIdfInPlace.\`/tmp/nlp/tfidf\` where inputCol="content"
            |and nGrams="2" as trainData;
            |
            |register TfIdfInPlace.\`/tmp/nlp/tfidf\` as tfidf_predict;`.stripMargin(),

            `train trainData as RandomForest.\`/tmp/nlp/rf\` where 
            |keepVersion="true";
            |
            |register RandomForest.\`/tmp/nlp/rf\` as rf_predict;`.stripMargin(),

            `select rf_predict(tfidf_predict("china is cool")) as predicted as output;`.stripMargin()
        ]
    }

}