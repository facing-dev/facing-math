import { throwError } from "../error.mjs";
import { type Locator, length, iterator, value, isLocatorNumber, isLocatorNumberArray, LocatorNumberArray, getRaw, LocatorNumber } from "../value/value.mjs";

export function checkShape(...locators: Locator[]) {
    if (locators.length === 0) {
        throwError()
    }
    const target = locators[0]
    let l: number | null = null
    if (isLocatorNumber(target)) {
        l = null
    } else if (isLocatorNumberArray(target)) {
        l = length(target)
    } else {
        throwError()
    }
    locators.forEach((ite) => {
        if (isLocatorNumber(ite)) {
            return
        }
        if (isLocatorNumberArray(ite)) {
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

export function column(columnIndex: number, ...args: Locator[]) {
    const result: number[] = []
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (isLocatorNumber(arg)) {
            result[i] = arg()
            continue
        }
        if (isLocatorNumberArray(arg)) {
            result[i] = arg(columnIndex)
            continue
        }
        throwError()

    }
    return result
}

export function calculate<T extends Locator>(cb: (...args: number[]) => number, target: T, ...args: Locator[]): T {
    checkShape(target, ...args)
    if (isLocatorNumberArray(target)) {
        const result: number[] = []
        iterator(target, (val, ind) => {
            const col = column(ind, target, ...args)
            const v = cb(...col)
            result[ind] = v
        })
        return value(result) as T
    }
    if (isLocatorNumber(target)) {
        return value(cb(...[target, ...args].map(ite => ite(0)))) as T
    }
    throwError()

}

export function add<T extends Locator>(target: T, ...args: Locator[]): T {
    return calculate((...args: number[]) => {
        let sum = args[0]
        for (let i = 1; i < args.length; i++) {
            sum += args[i]
        }
        return sum
    }, target, ...args)// as T
}

export function subtract<T extends Locator>(target: T, ...args: Locator[]): Locator {
    return calculate((...args: number[]) => {
        let sub = args[0]
        for (let i = 1; i < args.length; i++) {
            sub -= args[i]
        }
        return sub
    }, target, ...args)
}

export const sub = subtract

export function multiply<T extends Locator>(target: T, ...args: Locator[]): Locator {
    return calculate((...args: number[]) => {
        let mul = args[0]
        for (let i = 1; i < args.length; i++) {
            mul *= args[i]
        }
        return mul
    }, target, ...args)
}

export const mul = multiply

export function divide<T extends Locator>(target: T, ...args: Locator[]): Locator {
    return calculate((...args: number[]) => {
        let div = args[0]
        for (let i = 1; i < args.length; i++) {
            div /= args[i]
        }
        return div
    }, target, ...args)
}

export const div = divide

export function power<T extends Locator>(target: T, n: LocatorNumber): Locator {
    return calculate((...args: number[]) => {
        let pow = args[0]
        for (let i = 1; i < args.length; i++) {
            pow **= args[i]
        }
        return pow
    }, target, n)
}

export const pow = power

export function sum(target: LocatorNumberArray) {
    let sum = 0
    iterator(target, (v, i) => {
        sum += v
    })
    return value(sum)
}

export function mean(target: LocatorNumberArray) {
    const len = length(target)
    if (len === 0) {
        throwError()
    }
    return div(sum(target),value(len))
}
