import { batch, iterator, looseValue, ValueArray } from "../../value/value.mjs";
import { sub, sma } from '../base.mjs'
import { stdevs } from "../statistics.mjs";

export function boll(val: [ValueArray], n: number, k: number) {
    const list = val[0]
    const ret: {
        UPPER: number,
        MID: number,
        LOWER: number
    }[] = []
    const _sma = sma([list], n)
    iterator(_sma, (v, i) => {
        if (i === 0) {
            ret[i] = {
                MID: v,
                UPPER: v,
                LOWER: v
            }
        }
        const piece = list.slice(Math.max(0, i - n + 1), i + 1)
        const stdev = stdevs([batch(sub, [piece, looseValue(v)])])
        ret[i] = {
            MID: v,
            UPPER: v + k * stdev,
            LOWER: v - k * stdev
        }
    })
    return ret
}