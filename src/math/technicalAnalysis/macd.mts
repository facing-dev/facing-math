import { batch, iterator, length, looseValue, ValueArray } from "../../value/value.mjs";
import { divide, sub, ema } from '../base.mjs'

export function macd(val: [ValueArray], short: number, long: number, dea: number) {
    const list = val[0]
    const ret: {
        emaLong: number,
        emaShort: number,
        dif: number,
        difRate: number,
        dea: number,
        deaRate: number,
        histogram: number,
        histogramRate: number
    }[] = []
    const weight = 2
    const emaShort = ema(val, weight / (short + weight - 1))
    const emaLong = ema(val, weight / (long + weight - 1))
    const dif = batch(sub, [emaShort, emaLong])
    const difRate = batch(sub, [batch(divide, [emaShort, emaLong]), looseValue(1)])
    const _dea = ema([dif], weight / (dea + weight - 1))
    const deaRate = ema([difRate], weight / (dea + weight - 1))
    const histogram = batch(sub, [dif, _dea])
    const histogramRate = batch(sub, [difRate, deaRate])
    iterator(length(list), (i) => {
        ret[i] = {
            emaShort: emaShort[i],
            emaLong: emaLong[i],
            dif: dif[i],
            difRate: difRate[i],
            dea: _dea[i],
            deaRate: deaRate[i],
            histogram: histogram[i],
            histogramRate: histogramRate[i]
        }
    })
    return ret
}