import { throwError } from "../error.mjs";
import { Metadata, getOwnMetadata } from "../metadata.mjs";
const BrandSymbol = Symbol()
// type Brand<T extends Function, B> = T & { readonly [BrandSymbol]?: B }

export type MetadataLocator = {
    type: 'LOCATOR'
    set(i: number, v: number): void
    raw: () => number[]
    readonly: boolean
}

export type Locator = {
    (i: number): number
    // toString: () => number[]
}
function getLocatorMetadata(l: Locator): MetadataLocator {
    const md = getOwnMetadata(l)
    if (!md || md.type !== 'LOCATOR') {
        throwError('Metadata is not locator')
    }
    return md
}

// export function isLocatorNumber(t: Locator): t is LocatorNumber {
//     const md = getLocatorMetadata(t)
//     return md.data.type === 'NUMBER'
// }


export function getRaw(locator: Locator) {
    const md = getLocatorMetadata(locator)
    return md.raw()
}
// const LocatorPrototype = {
//     toString() {
//         console.log('xx')
//         return getRaw(this as any as Locator)
//     }
// }
export function value(value: number[], readonly = true): Locator {
    const val = value
    const locator = (i: number) => {
        if (i === undefined) {
            throw ''
        }
        return val[i]
    }
    let md = Metadata.getOwn(value)
    if (!md) {
        md = {
            type: 'LOCATOR',
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
        Metadata.create(locator, md)
    }
    return locator

}

export function set(locator: Locator, value: number, index?: number): void {
    const md = getLocatorMetadata(locator)
    if (md.readonly === true) {
        throwError('Locator should not be readonly')
    }
    if (index === undefined) {
        throwError('a')
    }
    md.set(value, index)
}

export function length(locator: Locator) {
    const md = getLocatorMetadata(locator)
    return md.raw().length
}


export function iterator(locator: Locator, cb: (v: number, i: number) => void | boolean) {
    const len = length(locator)
    for (let i = 0; i < len; i++) {
        const r = cb(locator(i), i)
        if (r === false) {
            return
        }
    }
}

export function fit(v: number, locator: Locator) {
    return value(Array(length(locator)).fill(v))
}