import {
    type Value, type ValueArray,
    batch,
    iterator,
    length
} from "../value/value.mjs";

function _add(a: Value, b: Value): Value {
    return a + b
}

export function add(val: [Value, Value]): Value {
    return _add(val[0], val[1])
}


export function subtract(val: [Value, Value]): Value {
    return val[0] - val[1]
}
export const sub = subtract

export function multiply(val: [Value, Value]): Value {
    return val[0] * val[1]
}
export const mul = multiply

export function divide(val: [Value, Value]): Value {
    return val[0] / val[1]
}
export const div = divide

export function power(val: [Value, Value]): Value {
    return val[0] ** val[1]
}
export const pow = power

export function max(val: [ValueArray]): Value {
    const list = val[0]
    let max = Number.NEGATIVE_INFINITY
    for (let i = 1; i < length(list); i++) {
        if (list[i] > max) {
            max = list[i]
        }
    }
    return max
}

export function min(val: [ValueArray]): Value {
    const list = val[0]
    let min = Number.POSITIVE_INFINITY
    for (let i = 1; i < length(list); i++) {
        if (list[i] < min) {
            min = list[i]
        }
    }
    return min
}

export function sum(val: [ValueArray]): Value {
    const list = val[0]
    let res = 0
    for (let i = 0; i < length(list); i++) {
        res += list[i]
    }
    return res
}

export function average(val: [ValueArray]): Value {
    return sum(val) / length(val[0])
}



export function simple_moving_average(val: [ValueArray], windowSize: number): ValueArray {
    const list = val[0]
    let size = 0
    let sma = 0
    let ret: Value[] = []
    for (let i = 0; i < list.length; i++) {
        const v = list[i]
        let t = sma * size + v
        size++
        if (size > windowSize) {
            size = windowSize
            t -= list[i - windowSize]
        }
        sma = t / size
        ret[i] = sma
    }
    return ret
}

export const sma = simple_moving_average

export function exponential_moving_average(val: [ValueArray], weight: number): ValueArray {
    const list = val[0]
    let size = 0
    let ema = 0
    let ret: Value[] = []
    for (let i = 0; i < list.length; i++) {
        const v = list[i]
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

export function moving_sum(val: [ValueArray], windowSize: number): ValueArray {
    const list = val[0]
    let sum = 0
    let ret: Value[] = []
    for (let i = 0; i < list.length; i++) {
        const v = list[i]
        sum += v
        if (i >= windowSize) {
            sum -= list[i - windowSize]
        }
        ret[i] = sum
    }
    return ret
}

export const msum = moving_sum

export function wilder_moving_average(val: [ValueArray], windowSize: number): ValueArray {
    const list = val[0]
    let wma: Value[] = []
    for (let i = 0; i < list.length; i++) {
        const v = list[i]
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

export function moving_max(val: [ValueArray], windowSize: number): ValueArray {
    const list = val[0]
    const t: number[] = []
    let ret: number[] = []
    iterator(list, (v, i) => {
        if (t.length > 0 && t[0] < i - windowSize + 1) {
            t.shift()
        }
        while (t.length > 0 && list[t[t.length - 1]] < v) {
            t.pop()
        }

        t.push(i)
        ret[i] = list[t[0]]
    })
    return ret
}

export const mmax = moving_max

export function moving_min(val: [ValueArray], windowSize: number): ValueArray {
    const list = val[0]
    const t: number[] = []
    let ret: number[] = []
    iterator(list, (v, i) => {
        if (t.length > 0 && t[0] < i - windowSize + 1) {
            t.shift()
        }
        while (t.length > 0 && list[t[t.length - 1]] > v) {
            t.pop()
        }
        t.push(i)
        ret[i] = list[t[0]]
    })
    return ret
}

export const mmin = moving_min