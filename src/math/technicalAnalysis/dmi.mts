import { throwError } from "../../error.mjs"
import { batch, iterator, length, looseValue, ValueArray } from "../../value/value.mjs"
import { sma, ema, wma, moving_normalize, add, mul, wilder_moving_average } from '../base.mjs'
import { atr } from "./atr.mjs"

export function dmi(val: [ValueArray, ValueArray, ValueArray], n: number, w: number, adxMethod: 'ORIGINAL' | 'SMA', weights?: ReadonlyArray<number>) {
    const [close, high, low] = val
    const ret: {
        plusDI: number,
        minusDI: number,
        ADX: number,
        ADXR: number,
        dDI: number
    }[] = []
    const TR: number[] = []
    const uDM: number[] = []
    const lDM: number[] = []
    iterator(length(close), (i) => {

        if (i === 0) {
            TR[i] = high[i] - low[i]
            uDM[i] = 0
            lDM[i] = 0
            return
        }
        // const p = list[i - 1]
        TR[i] = Math.max(Math.abs(high[i] - low[i]), Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]))
        const uD = high[i] - high[i - 1]
        const lD = -(low[i] - low[i - 1])
        uDM[i] = ((uD > 0 && uD > lD) ? uD : 0) * (weights?.[i] ?? 1)
        lDM[i] = ((lD > 0 && lD > uD) ? lD : 0) * (weights?.[i] ?? 1)
    })
    const wmaTR = wma([TR], n),
        wmaUDM = wma([uDM], n),
        wmaLDM = wma([lDM], n)
    const uDI: number[] = [], lDI: number[] = [], DX: number[] = []
    iterator(length(close), (i) => {
        const tr = wmaTR[i]
        uDI[i] = tr === 0 ? 0 : wmaUDM[i] / tr * 100
        lDI[i] = tr === 0 ? 0 : wmaLDM[i] / tr * 100
        const l = Math.abs(uDI[i] + lDI[i])
        DX[i] = (l === 0 ? 0 : (Math.abs(uDI[i] - lDI[i]) / l)) * 100
    })
    let ADX: ValueArray = []
    if (adxMethod === 'ORIGINAL') {
        ADX = ema([DX], 1 / n)// original Wilder average
    } else if (adxMethod === 'SMA') {
        ADX = sma([DX], n)
    }
    else {
        throwError('DMI ADX Method')
    }
    iterator(length(close), (i) => {
        const ind = Math.max(0, i - w)
        ret[i] = {
            plusDI: uDI[i],
            minusDI: lDI[i],
            ADX: ADX[i],
            ADXR: (ADX[i] + ADX[ind]) / 2,
            dDI: uDI[i] - lDI[i],
        }
    })
    return ret
}



export function dmi_dynamic_weight(val: [ValueArray, ValueArray, ValueArray, ValueArray], n: number, w: number, weightWindowSize: number, weightBase: number, adxMethod: 'ORIGINAL' | 'SMA') {
    const [close, high, low] = val
    const ATR = atr([close, high, low], weightWindowSize)
    const weight = batch(
        add, [
        looseValue(weightBase),
        batch(mul, [
            looseValue(1 - weightBase),
            moving_normalize([ATR], weightWindowSize)
        ])
    ])


    function calcWeight(nor: number) {
        return weightBase + (1 - weightBase) * nor
    }
    const ret: {
        plusDI: number,
        minusDI: number,
        ADX: number,
        ADXR: number,
        dDI: number
    }[] = []
    const TR: number[] = []
    const uDM: number[] = []
    const lDM: number[] = []
    iterator(length(close), (i) => {
        if (i === 0) {
            TR[i] = high[i] - low[i]
            uDM[i] = 0
            lDM[i] = 0
            return
        }
        // const w = calcWeight(mnormTurnover[i])
        TR[i] = Math.max(Math.abs(high[i] - low[i]), Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1])) * weight[i]
        const uD = (high[i] - high[i - 1])
        const lD = (-(low[i] - low[i - 1]))
        uDM[i] = ((uD > 0 && uD > lD) ? uD : 0) * weight[i]
        lDM[i] = ((lD > 0 && lD > uD) ? lD : 0) * weight[i]
    })
    const wmaTR = wilder_moving_average([TR], n),
        wmaUDM = wilder_moving_average([uDM], n),
        wmaLDM = wilder_moving_average([lDM], n)
    const uDI: number[] = [], lDI: number[] = [], DX: number[] = []
    iterator(length(close), (i) => {
        // const w = calcWeight(mnormTurnover[i])
        const tr = wmaTR[i]
        uDI[i] = tr === 0 ? 0 : wmaUDM[i] / tr * 100 //* w
        lDI[i] = tr === 0 ? 0 : wmaLDM[i] / tr * 100 //* w
        const l = Math.abs(uDI[i] + lDI[i])
        DX[i] = (l === 0 ? 0 : (Math.abs(uDI[i] - lDI[i]) / l)) * 100

    })
    let ADX: ValueArray = []
    if (adxMethod === 'ORIGINAL') {
        ADX = ema([DX], 1 / n)// original Wilder average
    } else if (adxMethod === 'SMA') {
        ADX = sma([DX], n)
    }
    else {
        throwError('DMI ADX Method')
    }
    // ADX = ADX.map((v,i)=>v*calcWeight(i))

    iterator(length(close), (i) => {
        const ind = Math.max(0, i - w)
        ret[i] = {
            plusDI: uDI[i],
            minusDI: lDI[i],
            ADX: ADX[i],
            ADXR: (ADX[i] + ADX[ind]) / 2,
            dDI: uDI[i] - lDI[i],
        }
    })
    return ret
}