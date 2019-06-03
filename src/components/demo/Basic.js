import * as React from "react";
import BigDL from "./BigDL";

const ReactMarkdown = require('react-markdown')

export class Basic extends BigDL {

    generateSteps() {
        return [{
            title: 'Variable in MLSQL',
            content: this.generateView(0),
        }, {
            title: 'Process excel',
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
                <ReactMarkdown source={`
                |
                |
                |
                `.stripMargin()}/>
            ],
            [],
            [],
            [],
            [],
            []

        ]

    }

    generateCommandData() {
        return [
            `|-- set string
             |set email="allwefantasy@gmail.com";
             |select "\${email}" as email  as table1;
             |             
             |-- nested variable reference
             |set email="allwefantasy@gmail.com";
             |set hello="hello \${email}";
             |
             |-- build-in variable: HOME OWNER date
             |set day_id ='''\${date.toString("yyyy-MM-dd")}''';
             |select "\${day_id}" as a as test111;
             |
             |-- conf/spark.sql("set spark.sql.shuffle.partitions=200")
             |set spark.sql.shuffle.partitions=200 where type="conf";
             |
             |-- shell
             |set date=\`date\` where type="shell";
             |select "\${date}" as dt as output;
             |                
             `.stripMargin(),

            `load xml.\`...xml..file...path\` where rowTag="doc" and charset="GBK" as xmlData;
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