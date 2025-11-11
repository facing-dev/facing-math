import { throwError } from "../error.mjs"

export type Value = Readonly<number>
export type ValueArray = ReadonlyArray<Value>
export type LooseValue<T = any> = () => T
export function batch<V, R extends any, A extends any[]>(func: (v: V, ...a: A) => R, val: { [I in keyof V]: I extends number | `${number}` ? ReadonlyArray<V[I]> | LooseValue<V[I]> : never } & ReadonlyArray<ReadonlyArray<any> | LooseValue<any>>, ...a: A): ReadonlyArray<R> {
    const res: R[] = []
    const arr = val.find(ite => Array.isArray(ite))
    if (!arr) {
        throwError('batch all looseValue')
    }
    for (let i = 0; i < arr.length; i++) {
        res[i] = func(val.map(ite => {
            if (Array.isArray(ite)) {
                return ite[i]
            }
            if (typeof ite === 'function') {
                return ite()
            }
            throwError('batch')
        }) as V, ...a)
    }
    return res
}

export function looseValue<T>(v: T): LooseValue<T> {
    return () => v
}

export function length(val: ReadonlyArray<any>) {
    return val.length
}

export function fill<T>(value: T, length: number): T[] {
    return Array(length).fill(value)
}

export function map(val: ValueArray, func: (p: Value, i: number) => Value): ValueArray {
    return val.map(func)
}
export function iterator(val: number, cb: {
    (index: number): boolean | void
}): void
export function iterator<T>(val: ReadonlyArray<T>, cb: {
    (val: T, index: number): boolean | void
}): void
export function iterator<T>(val: ReadonlyArray<T> | number, cb: Function) {
    const len = Array.isArray(val) ? length(val) : val as number
    for (let i = 0; i < len; i++) {
        const ret = Array.isArray(val) ? cb(val[i], i) : cb(i)
        if (ret === false) {
            break
        }
    }
}