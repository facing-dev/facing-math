import { throwError } from "../../error.mjs"
import { iterator, length, map, Value, ValueArray } from "../../main.mjs"
import { sma, ema, wma } from '../base.mjs'

export function dmi(val: [ValueArray, ValueArray, ValueArray], n: number, w: number, adxMethod: 'ORIGINAL' | 'SMA') {
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
        uDM[i] = (uD > 0 && uD > lD) ? uD : 0
        lDM[i] = (lD > 0 && lD > uD) ? lD : 0
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