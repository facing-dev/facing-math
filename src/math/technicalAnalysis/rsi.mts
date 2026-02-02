import { iterator, length, ValueArray } from "../../value/value.mjs";
import { ema } from '../base.mjs'
export function rsi(val: [ValueArray], n: number): ValueArray {
    const list = val[0]
    const ret: number[] = []
    const abs_up: number[] = []
    const abs_down: number[] = []
    iterator(list, (v, i) => {
        if (i === 0) {
            abs_up[i] = 0
            abs_down[i] = 0
        }
        else {
            const pv = list[i - 1]
            abs_up[i] = v > pv ? v - pv : 0
            abs_down[i] = v < pv ? Math.abs(v - pv) : 0
        }
    })

    const avg_up = ema([abs_up], 1 / n)
    const avg_down = ema([abs_down], 1 / n)
    iterator(length(avg_up), (i) => {
        if (i === 0) {
            ret[i] = 50
        }
        else {
            ret[i] = 100 * avg_up[i] / (avg_up[i] + avg_down[i])
        }
    })
    return ret
}