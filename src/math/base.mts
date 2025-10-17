import { throwError } from "../error.mjs";
import { type Locator, length, iterator, value } from "../value/value.mjs";


export function checkShape(...locators: Locator[]) {
    if (locators.length === 0) {
        throwError()
    }
    const target = locators[0]
    let l = length(target)
    locators.forEach((ite) => {
        const len = length(ite)
        if (len !== l) {
            throwError()
        }
    })
}

export function column(columnIndex: number, ...args: Locator[]) {
    const result: number[] = []
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        result[i] = arg(columnIndex)
    }
    return result
}

export function calculate(cb: (...args: number[]) => number, target: Locator, ...args: Locator[]): Locator {
    checkShape(...args)
    const result: number[] = []
    iterator(target, (val, ind) => {
        const col = column(ind, target, ...args)
        const v = cb(...col)
        result[ind] = v
    })
    return value(result)
}

export function add(target: Locator, ...args: Locator[]): Locator {
    return calculate((...args: number[]) => {
        let sum = args[0]
        for (let i = 1; i < args.length; i++) {
            sum += args[i]
        }
        return sum
    }, target, ...args)
}

