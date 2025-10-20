export type ValueSingle = number
export type ValueArray = ReadonlyArray<ValueSingle>
export type Value = ValueSingle | ValueArray
export type ValueBatchLoose = ReadonlyArray<Value>
export type ValueBatch = ReadonlyArray<ValueArray>

export function isValueSingle(d: Value): d is ValueSingle {
    return typeof d === 'number'
}

export function isValueArray(d: Value): d is ValueArray {
    return Array.isArray(d)
}

export function length(data: ReadonlyArray<any>) {
    return data.length
}

export function lengthLoose(data: ReadonlyArray<any> | number) {
    if (Array.isArray(data)) {
        return length(data)
    }
    return 1
}

export function each<D>(data: ReadonlyArray<D>, cb: (value: D, index: number) => void | boolean): void {
    const len = length(data)
    for (let i = 0; i < len; i++) {
        const r = cb(data[i], i)
        if (r === false) {
            return
        }
    }
}

export function map<D, T>(data: ReadonlyArray<D>, cb: (value: D, index: number) => T): T[] {
    const arr: T[] = []
    each(data, (val, ind) => {
        arr[ind] = cb(val, ind)
    })
    return arr
}

export function slice<D>(data: ReadonlyArray<D>, start: number, end: number): D[] {
    return data.slice(start, end)
}