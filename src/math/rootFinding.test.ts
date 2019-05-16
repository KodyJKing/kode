import test from "ava"
import { finiteDifference, newtonRaphson } from "./rootFinding";

test( "0", t => {
    let f = x => x * x + x
    let df = x => 2 * x + 1
    let root = finiteDifference(f, 25)
    console.log(root)
    root = newtonRaphson(f, df, 25)
    console.log( root )    
    t.pass()
} )