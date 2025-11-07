import {
    type Value, type ValueArray,
    length
} from "../value/value.mjs";

function _add(a: Value, b: Value): Value {
    return a + b
}

export function add(val: ValueArray): Value {
    return _add(val[0], val[1])
}


export function subtract(val: ValueArray): Value {
    return val[0] - val[1]
}
export const sub = subtract

export function multiply(val: ValueArray): Value {
    return val[0] * val[1]
}
export const mul = multiply

export function divide(val: ValueArray): Value {
    return val[0] / val[1]
}
export const div = divide

export function power(val: ValueArray): Value {
    return val[0] ** val[1]
}
export const pow = power

export function max(val: ValueArray): Value {
    let max = Number.NEGATIVE_INFINITY
    for (let i = 1; i < length(val); i++) {
        if (val[i] > max) {
            max = val[i]
        }
    }
    return max
}

export function min(val: ValueArray): Value {
    let min = Number.POSITIVE_INFINITY
    for (let i = 1; i < length(val); i++) {
        if (val[i] < min) {
            min = val[i]
        }
    }
    return min
}

export function sum(val: ValueArray): Value {
    let res = 0
    for (let i = 0; i < length(val); i++) {
        res += val[i]
    }
    return res
}

export function average(val: ValueArray): Value {
    return sum(val) / length(val)
}

export function map(val: ValueArray, func: (p: Value) => Value): ValueArray {
    return val.map(func)
}