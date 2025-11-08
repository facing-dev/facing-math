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

export function simple_moving_average(val: ValueArray, windowSize: number): ValueArray {
    let size = 0
    let sma = 0
    let ret: Value[] = []
    for (let i = 0; i < val.length; i++) {
        const v = val[i]
        let t = sma * size + v
        size++
        if (size > windowSize) {
            size = windowSize
            t -= val[i - windowSize]
        }
        sma = t / size
        ret[i] = sma
    }
    return ret
}

export const sma = simple_moving_average

export function exponential_moving_average(val: ValueArray, weight: number): ValueArray {
    let size = 0
    let ema = 0
    let ret: Value[] = []
    for (let i = 0; i < val.length; i++) {
        const v = val[i]
        if (size === 0) {
            ema = v
        } else {
            ema = v * weight + ema * (1 - weight)
        }
        size++
        ret[i] = ema
    }
    return ret
}

export const ema = exponential_moving_average

export function moving_sum(val: ValueArray, windowSize: number): ValueArray {
    let sum = 0
    let ret: Value[] = []
    for (let i = 0; i < val.length; i++) {
        const v = val[i]
        sum += v
        if (i >= windowSize) {
            sum -= val[i - windowSize]
        }
        ret[i] = sum
    }
    return ret
}

export const msum = moving_sum

export function wilder_moving_average(val: ValueArray, windowSize: number): ValueArray {
    let wma: Value[] = []
    for (let i = 0; i < val.length; i++) {
        const v = val[i]
        if (i === 0) {
            wma[0] = v
        } else {
            const size = Math.min(i + 1, windowSize)
            wma[i] = v/*DO NOT divide by ind */ + wma[i - 1] - wma[i - 1] / size
        }
    }
    return wma
}

export const wma = wilder_moving_average