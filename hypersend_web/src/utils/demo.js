import {readdirSync} from "node:fs";
import path from "node:path";

const a = 22;
const b = "hhosaje";


class TestClass {
    x = 5;
}


console.log(typeof TestClass, typeof b, typeof a);


const getChildDir = (dir) => {
    if (!dir) {
        dir = process.cwd();
        dir = path.dirname(dir);
    }
    const entrys = readdirSync(dir, {withFileTypes: true});
    return entrys.filter(entry => entry.isDirectory()).map(entry => entry.name);
};


console.log(getChildDir());