import { batch, ema, iterator, length, looseValue, max, min, mmax, mmin, mul, sub, ValueArray } from "../../main.mjs";

export function kdj(val: [ValueArray, ValueArray, ValueArray], n: number, m1: number, m2: number) {
    const [close, high, low] = val
    const ret: {
        K: number
        D: number
        J: number
    }[] = []
    const max = mmax([high], n)
    const min = mmin([low], n)
    const rsv: number[] = []
    iterator(length(close), (i) => {
        if (i === 0) {
            rsv[i] = 50
        } else {
            rsv[i] = (close[i] - min[i]) / (max[i] - min[i]) * 100
        }
    })
    const K = ema([rsv], 1 / m1)
    const D = ema([K], 1 / m2)
    const J = batch(sub,[
        batch(mul,[K,looseValue(3)]),
        batch(mul,[D,looseValue(2)])
    ])
    iterator(length(close),(i)=>{
        ret[i]={
            K:K[i],
            D:D[i],
            J:J[i]
        }
    })
    return ret
}