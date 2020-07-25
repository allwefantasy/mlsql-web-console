const uuidv4 = require("uuid/v4")
export default class Tools {
    static getTempTableName = () => {
        return (uuidv4() + "").replace(/-/g, "")
    }
    static getJobName = () => {
        return uuidv4() + ""
    }

    static unQuote = (str) => {
        if (str.startsWith("\"") && str.endsWith("\"")) {
            return str.slice(1, str.length - 1)
        }
        if (str.startsWith("'") && str.endsWith("'")) {
            return str.slice(1, str.length - 1)
        }
        if (str.startsWith("'''") && str.endsWith("'''")) {
            return str.slice(3, str.length - 3)
        }
        return str
    }

    static visitDown = (tree, visit) => {
        visit(tree)
        if (tree.children) {
            tree.children.map(item => {
                Tools.visitDown(item, visit)
            })
        }

    }
    static visitUp = (tree, visit) => {
        if (tree.children) {
            tree.children.map(item => {
                Tools.visitUp(item, visit)
            })
        }
        visit(tree)
    }

    static robotFetchParam = () => {
        return {
            queryType: "robot",
            fetchType: "take",
            includeSchema: true
        }
    }

    static robotFetchParamWithCollect = () => {
        return {
            queryType: "robot",
            includeSchema: true
        }
    }

    static getField = (v) => {
        if (v.startsWith("`") && v.endsWith("`")) return v
        return `\`${v}\``
    }

    static distinct = (arrays, field) => {
        const tempF = {}
        return arrays.filter(item => {
            if (item[field] in tempF) {
                return false
            } else {
                tempF[item[field]] = item[field]
                return true
            }
        })
    }
    static fastCompareObject = (x, y) => {
        return JSON.stringify(x) === JSON.stringify(y)
    }
    static deepCompareObject = (arg1, arg2) => {
        var i, l, leftChain, rightChain;

        function compare2Objects(x, y) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                return true;
            }

            // Compare primitives and functions.     
            // Check if both arguments link to the same object.
            // Especially useful on the step where we compare prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good as we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            if (x.prototype !== y.prototype) {
                return false;
            }

            // Check for infinitive linking loops
            if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                return false;
            }

            // Quick checking of one object being a subset of another.
            // todo: cache the structure of arguments[0] for performance
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }

        return compare2Objects(arg1, arg2)
    }
}