import { throwError } from "../error.mjs";
import { Metadata, getOwnMetadata } from "../metadata.mjs";
const BrandSymbol = Symbol()
type Brand<T extends Function, B> = T & { readonly [BrandSymbol]?: B }

export type MetadataLocator = {
    type: 'LOCATOR'
    data: ({
        type: 'NUMBER_ARRAY'
        set(i: number, v: number): void
        raw: () => number[]
    } | {
        type: 'NUMBER'
        set(v: number): void
        raw: () => number
    }) & {
        readonly: boolean
    }

}

export type LocatorNumber = Brand<{
    (): number
}, 'LocatorNumber'>
export type LocatorNumberArray = Brand<{
    (i: number): number
}, 'LocatorNumberArray'>
export type Locator = LocatorNumber | LocatorNumberArray
function getLocatorMetadata(l: Locator): MetadataLocator {
    const md = getOwnMetadata(l)
    if (!md || md.type !== 'LOCATOR') {
        throwError('Metadata is not locator')
    }
    return md
}

export function isLocatorNumber(t: Locator): t is LocatorNumber {
    const md = getLocatorMetadata(t)
    return md.data.type === 'NUMBER'
}
export function isLocatorNumberArray(t: Locator): t is LocatorNumberArray {
    const md = getLocatorMetadata(t)
    return md.data.type === 'NUMBER_ARRAY'
}

export function getRaw(locator: LocatorNumber): number
export function getRaw(locator: LocatorNumberArray): number[]
export function getRaw(locator: Locator): number | number[]
export function getRaw(locator: Locator) {
    const md = getLocatorMetadata(locator)
    return md.data.raw()
}

export function value(value: number, readonly?: boolean): LocatorNumber
export function value(value: number[], readonly?: boolean): LocatorNumberArray
export function value(value: number[] | number, readonly = true): Locator {
    if (Array.isArray(value)) {
        const val = value
        const locator = (i?: number) => {
            if (i === undefined) {
                throw ''
            }
            return val[i]
        }
        let md = Metadata.getOwn(value)
        if (!md) {
            md = {
                type: 'LOCATOR',
                data: {
                    type: 'NUMBER_ARRAY',

                    set(i: number, v: number) {
                        if (readonly) {
                            throw ''
                        }
                        if (i <= val.length) {
                            val[i] = v
                            return
                        }
                        throwError()
                    },
                    raw: () => val,
                    readonly
                }
            }
            Metadata.create(locator, md)
        }
        return locator
    } else {
        let val = value
        const locator = () => val
        let md = Metadata.getOwn(value)
        if (!md) {
            md = {
                type: 'LOCATOR',
                data: {
                    type: 'NUMBER',
                    set(v: number) {
                        if (readonly) {
                            throw ''
                        }
                        val = v
                    },
                    raw: () => val,
                    readonly
                },

            }
            Metadata.create(locator, md)
        }
        return locator
    }
}

export function set(locator: LocatorNumber, value: number): void
export function set(locator: LocatorNumberArray, value: number, index: number,): void
export function set(locator: Locator, value: number, index?: number): void {
    const md = getLocatorMetadata(locator)
    if (md.data.readonly === true) {
        throwError('Locator should not be readonly')
    }
    if (md.data.type === 'NUMBER') {
        md.data.set(value)
        return
    }
    if (md.data.type === 'NUMBER_ARRAY') {
        if (index === undefined) {
            throwError('a')
        }
        md.data.set(value, index)
        return
    }
    throwError('b')
}

export function length(locator: LocatorNumberArray) {
    const md = getLocatorMetadata(locator)
    if (md.data.type !== 'NUMBER_ARRAY') {
        throwError()
    }
    return md.data.raw().length
}

export function iterator(locator: LocatorNumberArray, cb: (value: number, index: number) => void | boolean): void {
    if (!isLocatorNumberArray(locator)) {
        throwError()
    }
    const len = length(locator)
    for (let i = 0; i < len; i++) {
        const r = cb(locator(i), i)
        if (r === false) {
            return
        }
    }
}