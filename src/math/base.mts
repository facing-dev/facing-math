import { throwError } from "../error.mjs";
import {
    type ValueBatchLoose, type ValueSingle, type ValueArray, type Value,
    length, isValueSingle, isValueArray, each, map, lengthLoose,
    ValueBatch
} from "../value/value.mjs";

export function checkShape(batch: ValueBatch) {
    if (batch.length === 0) {
        throwError()
    }

    return batch.every(b => length(b) === length(batch[0]))

}

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

export function calculateLoose(cb: (array: ValueArray) => number, batch: ValueBatchLoose): ValueArray {
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
        return result
    }
    if (isValueSingle(target)) {
        return [cb(columnLoose(0, batch))]
    }
    throwError()
}

export const add = function (...args: ValueBatchLoose): ValueArray {
    return calculateLoose((array) => {
        let sum = array[0]
        for (let i = 1; i < length(array); i++) {
            sum += array[i]
        }
        return sum
    }, args)
}

export const subtract = function (...args: ValueBatchLoose): ValueArray {
    return calculateLoose((array) => {
        let sub = array[0]
        for (let i = 1; i < length(array); i++) {
            sub -= array[i]
        }
        return sub
    }, args)
}
export const sub = subtract

export const multiply = function (...args: ValueBatchLoose): ValueArray {
    return calculateLoose((array) => {
        let mul = array[0]
        for (let i = 1; i < length(array); i++) {
            mul *= array[i]
        }
        return mul
    }, args)
}
export const mul = multiply

export const divide = function (...args: ValueBatchLoose): ValueArray {
    return calculateLoose((array) => {
        let div = array[0]
        for (let i = 1; i < length(array); i++) {
            div /= array[i]
        }
        return div
    }, args)
}
export const div = divide

export const power = function (...args: ValueBatchLoose): ValueArray {
    return calculateLoose((array) => {
        let pow = array[0]
        for (let i = 1; i < length(array); i++) {
            pow **= array[i]
        }
        return pow
    }, args)
}
export const pow = power

export const sum = function (...args: Value[]): ValueArray {
    return map([...args], (b) => {
        if (isValueArray(b)) {
            return b.reduce((p, v) => p + v, 0)
        }
        if (isValueSingle(b)) {
            return b
        }
        throwError()
    })
}

export const mean = function (...args: Value[]): ValueArray {
    return div(sum(...args), map(args, lengthLoose))
}
