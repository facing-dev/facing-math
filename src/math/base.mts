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

export function calculateLoose<T extends ValueBatchLoose>(cb: (array: ValueArray) => number, batch: T): T[0] {
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
        return cb(columnLoose(0, batch))
    }
    throwError()
}

export function operationColumn(p: (b: ValueArray) => number) {
    return function <T extends ValueBatchLoose>(...args: T): T[0] extends ValueSingle ? ValueSingle : ValueArray {
        return calculateLoose(p, args) as any
    }
}

export const add = operationColumn((array) => {
    let sum = array[0]
    for (let i = 1; i < length(array); i++) {
        sum += array[i]
    }
    return sum
})

export const subtract = operationColumn((array) => {
    let sub = array[0]
    for (let i = 1; i < length(array); i++) {
        sub -= array[i]
    }
    return sub
})
export const sub = subtract

export const multiply = operationColumn((array) => {
    let mul = array[0]
    for (let i = 1; i < length(array); i++) {
        mul *= array[i]
    }
    return mul
})
export const mul = multiply

export const divide = operationColumn((array) => {
    let div = array[0]
    for (let i = 1; i < length(array); i++) {
        div /= array[i]
    }
    return div
})
export const div = divide

export const power = operationColumn((array) => {
    let pow = array[0]
    for (let i = 1; i < length(array); i++) {
        pow **= array[i]
    }
    return pow
})
export const pow = power

export function operationRow(p: (b: Value) => number) {
    return function <T extends ValueBatchLoose>(...args: T): T extends [ValueArray] ? number : T extends [ValueSingle] ? number : ValueArray {
        if (args.length === 1) {
            return p(args[0]) as any
        }
        return map([...args], (b) => {
            return p(b)
        }) as any
    }
}

export const sum = operationRow((b: Value) => {
    if (isValueArray(b)) {
        return b.reduce((p, v) => p + v, 0)
    }
    if (isValueSingle(b)) {
        return b
    }
    throwError()
})

export const mean = operationRow((b: Value) => {
    if (isValueArray(b)) {
        return sum(b) / b.length
    }
    if (isValueSingle(b)) {
        return b
    }
    throwError()
})

mean(1, 2, 3)