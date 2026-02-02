import { batch, ValueArray } from "../../value/value.mjs";
import { divide, msum, mul } from '../base.mjs'

export function vwap(val: [ValueArray, ValueArray], windowSize: number) {
    const [turnover, volume] = val
    const x = msum([batch(mul, [turnover, volume])], windowSize)
    const vmsum = msum([volume], windowSize)
    return batch(divide, [x, vmsum])
}