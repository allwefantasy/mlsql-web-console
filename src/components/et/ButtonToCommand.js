export class ButtonToCommand {
    makeSQL = (name) => {
        if (name === "JobList") {
            return `load _mlsql_.\`jobs\` as output;`
        }
        if (name === "ConnectMySQL") {
            return `connect jdbc where
 url="jdbc:mysql://127.0.0.1:3306/wow?characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&tinyInt1isBit=false"
 and driver="com.mysql.jdbc.Driver"
 and user=""
 and password=""
 as db_1;`
        }
        return ""
    }
}