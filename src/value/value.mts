import { throwError } from "../error.mjs";
// import { Metadata as _Metadata } from "facing-metadata";


// export const Metadata = new _Metadata<{
//     transposed: boolean
// }>(Symbol('facing-math_value_batch-locator'))

// export function getOwnMetadata(target: any) {
//     return Metadata.getOwn(target)
// }
// import { Metadata, getOwnMetadata } from "../metadata.mjs";
// const BrandSymbol = Symbol()
// type Brand<T extends Function, B> = T & { readonly [BrandSymbol]?: B }

// export type MetadataLocator = {
//     type: 'LOCATOR'
//     // data: (
//     // {
//     // type: 'NUMBER_ARRAY'
//     // set(i: number, v: number): void
//     raw: () => number[]
//     // } 
//     // | {
//     //     type: 'NUMBER'
//     //     // set(v: number): void
//     //     raw: () => number
//     // }) 
//     // & {
//     //     readonly: boolean
//     // }

// }

// // export type LocatorNumber = {
// //     (): number
// // }//, 'LocatorNumber'>
// export type Locator = {
//     (i: number): number
// }//, 'LocatorNumberArray'>
// // export type Locator = LocatorNumber | LocatorNumberArray
// function getLocatorMetadata(l: Locator): MetadataLocator {
//     const md = getOwnMetadata(l)
//     if (!md || md.type !== 'LOCATOR') {
//         throwError('Metadata is not locator')
//     }
//     return md
// }

// // export function isLocatorNumber(t: Locator): t is LocatorNumber {
// //     const md = getLocatorMetadata(t)
// //     return md.data.type === 'NUMBER'
// // }
// // export function isLocatorNumberArray(t: Locator): t is LocatorNumberArray {
// //     const md = getLocatorMetadata(t)
// //     return md.data.type === 'NUMBER_ARRAY'
// // }

// // export function getRaw(locator: LocatorNumber): number
// // export function getRaw(locator: LocatorNumberArray): number[]
// export function getRaw(locator: Locator): number[]
// export function getRaw(locator: Locator) {
//     const md = getLocatorMetadata(locator)
//     return md.raw()
// }

// // export function value(value: number): LocatorNumber
// export function locator(value: number[]): LocatorNumberArray
// export function value(_value: number[] | number): Locator {
//     if (Array.isArray(_value)) {
//         const val = _value.map(val => value(val))
//         const locator = (i?: number) => {
//             if (i === undefined) {
//                 throw ''
//             }
//             return val[i]
//         }
//         let md = Metadata.getOwn(_value)
//         if (!md) {
//             md = {
//                 type: 'LOCATOR',
//                 data: {
//                     type: 'NUMBER_ARRAY',

//                     // set(i: number, v: number) {
//                     //     if (readonly) {
//                     //         throw ''
//                     //     }
//                     //     if (i <= val.length) {
//                     //         val[i] = v
//                     //         return
//                     //     }
//                     //     throwError()
//                     // },
//                     raw: () => _value,
//                     // readonly
//                 }
//             }
//             Metadata.create(locator, md)
//         }
//         return locator
//     } else {
//         let val = _value
//         const locator = () => val
//         let md = Metadata.getOwn(value)
//         if (!md) {
//             md = {
//                 type: 'LOCATOR',
//                 data: {
//                     type: 'NUMBER',
//                     // set(v: number) {
//                     //     if (readonly) {
//                     //         throw ''
//                     //     }
//                     //     val = v
//                     // },
//                     raw: () => val,
//                     // readonly
//                 },

//             }
//             Metadata.create(locator, md)
//         }
//         return locator
//     }
// }

// export function set(locator: LocatorNumber, value: number): void
// export function set(locator: LocatorNumberArray, value: number, index: number,): void
// export function set(locator: Locator, value: number, index?: number): void {
//     const md = getLocatorMetadata(locator)
//     if (md.data.readonly === true) {
//         throwError('Locator should not be readonly')
//     }
//     if (md.data.type === 'NUMBER') {
//         md.data.set(value)
//         return
//     }
//     if (md.data.type === 'NUMBER_ARRAY') {
//         if (index === undefined) {
//             throwError('a')
//         }
//         md.data.set(value, index)
//         return
//     }
//     throwError('b')
// }

export type ValueSingle = number
export type ValueArray = ReadonlyArray<ValueSingle>
export type Value = ValueSingle | ValueArray
export type ValueBatchLoose = ReadonlyArray<Value>
export type ValueBatch = ReadonlyArray<ValueArray>
// export type DataBatchLocator = (column: number, row: number) => number

// export function locator(batch: DataBatch): DataBatchLocator {
//     const func: DataBatchLocator = (column: number, row: number) => {
//         const md = Metadata.getOwn(func)
//         if (!md) {
//             throwError()
//         }
//         const transposed = md.transposed
//         const _column = transposed ? row : column
//         const _row = transposed ? column : row
//         const t = batch[_column]
//         if (isDataNumber(t)) {
//             return t
//         }
//         if (isDataNumberArray(t)) {
//             return t[_row]
//         }
//         throwError()
//     }
//     Metadata.create(func, {
//         transposed: false
//     })
//     return func
// }

// export function transpose(locator: DataBatchLocator): DataBatchLocator {
//     const md = Metadata.getOwn(locator)
//     if (!md) {
//         throwError()
//     }
//     md.transposed != md.transposed
//     return locator
// }



export function isValueSingle(d: Value): d is ValueSingle {
    return typeof d === 'number'
}

export function isValueArray(d: Value): d is ValueArray {
    return Array.isArray(d)
}
// export type Data = number|number[]|number[][]


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