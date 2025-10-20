import { throwError } from "../error.mjs";
import {
    type ValueBatchLoose, type ValueSingle, type ValueArray, type Value,
    length, isValueSingle, isValueArray, each, map, lengthLoose
} from "../value/value.mjs";

export function checkShapeLoose(batch: ValueBatchLoose) {
    if (batch.length === 0) {
        throwError()
    }
    const target = batch[0]
    let l: number | null = null
    if (isValueSingle(target)) {
        l = null
    } else if (isValueArray(target)) {
        l = length(target)
    } else {
        throwError()
    }
    batch.forEach((ite) => {
        if (isValueSingle(ite)) {
            return
        }
        if (isValueArray(ite)) {
            const len = length(ite)
            if (l === null) {
                if (len >= 1) {
                    return
                }
                throwError()
            }
            if (len !== l) {
                throwError()
            }
            return
        }
        throwError()
    })
}

export function columnLoose(columnIndex: number, batch: ValueBatchLoose): ValueArray {
    const result: ValueSingle[] = []
    for (let i = 0; i < batch.length; i++) {
        const ite = batch[i]
        if (isValueSingle(ite)) {
            result[i] = ite
            continue
        }
        if (isValueArray(ite)) {
            result[i] = ite[columnIndex]
            continue
        }
        throwError()
    }
    return result
}

export function calculateLoose<T extends Value>(cb: (array: ValueArray) => number, batch: [T, ...Value[]]): T {
    if (length(batch) <= 1) {
        throwError()
    }
    checkShapeLoose(batch)
    const target = batch[0]
    if (isValueArray(target)) {
        const result: ValueSingle[] = []
        each(target, (val, ind) => {
            const col = columnLoose(ind, batch)
            const v = cb(col)
            result[ind] = v
        })
        return result as unknown as T
    }
    if (isValueSingle(target)) {
        return cb(columnLoose(0, batch)) as T
    }
    throwError()
}

export function add<T extends Value>(batch: [T, Value, ...Value[]]): T {
    return calculateLoose((array) => {
        let sum = array[0]
        for (let i = 1; i < length(array); i++) {
            sum += array[i]
        }
        return sum
    }, batch)
}

export function subtract<T extends Value>(batch: [T, Value, ...Value[]]): T {
    return calculateLoose((array) => {
        let sub = array[0]
        for (let i = 1; i < length(array); i++) {
            sub -= array[i]
        }
        return sub
    }, batch)
}
export const sub = subtract

export function multiply<T extends Value>(batch: [T, Value, ...Value[]]): T {
    return calculateLoose((array) => {
        let mul = array[0]
        for (let i = 1; i < length(array); i++) {
            mul *= array[i]
        }
        return mul
    }, batch)
}
export const mul = multiply

export function divide<T extends Value>(batch: [T, Value, ...Value[]]): T {
    return calculateLoose((array) => {
        let div = array[0]
        for (let i = 1; i < length(array); i++) {
            div /= array[i]
        }
        return div
    }, batch)
}
export const div = divide

export function power<T extends Value>(batch: [T, Value, ...Value[]]): T {
    return calculateLoose((array) => {
        let pow = array[0]
        for (let i = 1; i < length(array); i++) {
            pow **= array[i]
        }
        return pow
    }, batch)
}
export const pow = power

export function sum(batch: ValueBatchLoose): ValueArray {
    return map(batch, (b) => {
        if (isValueArray(b)) {
            return b.reduce((p, v) => p + v, 0)
        }
        if (isValueSingle(b)) {
            return b
        }
        throwError()
    })
}

export function mean(batch: ValueBatchLoose): ValueArray {
    return div([sum(batch), map(batch, lengthLoose)])
}
