export type Value = Readonly<number>
export type ValueArray = ReadonlyArray<Value>

export function batch<T extends (p: any) => any>(func: T, val: ReadonlyArray<Parameters<T>[0]>): ReadonlyArray<ReturnType<T>> {
    const res: ReturnType<T>[] = []
    for (let i = 0; i < val[0].length; i++) {
        res[i] = func(val.map(ite=>ite[i]))
    }
    return res
}

export function length(val: ReadonlyArray<any>) {
    return val.length
}

export function fill<T>(value: T, length: number): T[] {
    return Array(length).fill(value)
}
