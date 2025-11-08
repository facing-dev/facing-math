export type Value = Readonly<number>
export type ValueArray = ReadonlyArray<Value>
export type LooseValue<T = any> = () => T
export function batch<V extends Array<any>, R extends any, A extends any[]>(func: (v: V, ...a: A) => R, val: { [I in keyof V]: I extends number | `${number}` ? ReadonlyArray<V[I]> | LooseValue<V[I]> : any } & ReadonlyArray<any>, ...a: A): ReadonlyArray<R> {
    const res: R[] = []
    for (let i = 0; i < val[0].length; i++) {
        res[i] = func(val.map(ite => {
            if (Array.isArray(ite)) {
                return ite[i]
            }
            if(typeof ite==='function'){
                return ite()
            }
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

