import { iterator, length, ValueArray } from "../../value/value.mjs";
import { sma } from "../base.mjs";
export function atr(val: [ValueArray, ValueArray, ValueArray], n: number) {
    const [close, high, low] = val
    const getD = (i: number): number => {
        const h = Math.max(high[i], close[i - 1]), l = Math.min(low[i], close[i - 1])
        return h - l
    }
    const D: number[] = []
    iterator(length(close), (i) => {
        if (i === 0) {
            D[i] = high[i] - low[i]
        } else {
            D[i] = getD(i)
        }
    })
    return sma([D],n)
}