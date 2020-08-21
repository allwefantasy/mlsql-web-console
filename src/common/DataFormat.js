const _dateFormat = require('dateformat');

class DataFormat {
    static formatStartTime(items) {
        for (let item of items) {
            item.startTime = _dateFormat(new Date(item.startTime), "yyyy:mm:dd HH:MM:ss")
        }
    }

    static groupBy(list, key) {
        return list.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x)
            return rv
        }, {})
    }

}

export default DataFormat
