import test from "ava"
import { merge } from "./merge";

test("evens+odds", t => {
    let evens = [0, 2, 4, 6]
    let odds = [1, 3, 5, 7]
    let expected = [0, 1, 2, 3, 4, 5, 6, 7]
    let compare = (a, b) => a - b
    t.deepEqual(merge(evens, odds, compare), expected)
    t.deepEqual(merge(odds, evens, compare), expected)
})