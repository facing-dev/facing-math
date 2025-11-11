import { ValueArray, batch, length, map } from "../value/value.mjs";
import { pow, average, sub, sum, mul } from "./base.mjs";
type DDOF = number
export const covariance = function (val: [ValueArray, ValueArray], ddof: DDOF) {
    const [x, y] = val
    const AVG_X = average([x])
    const AVG_Y = average([y])
    const D_X = map(x, (v) => v - AVG_X)
    const D_Y = map(y, (v) => v - AVG_Y)

    return sum([batch(mul, [D_X, D_Y])]) / (length(x) - ddof)
}
export const cov = covariance

export const covariance_population = (val: [ValueArray, ValueArray]) => covariance(val, 0)
export const covp = covariance_population

export const covariance_sample = (val: [ValueArray, ValueArray]) => covariance(val, 1)
export const covs = covariance_sample

export const variance = (val: [ValueArray], ddof: DDOF) => cov([val[0], val[0]], ddof)
export const vari = variance

export const variance_population = (x: [ValueArray]) => vari(x, 0)
export const varip = variance_population

export const variance_sample = (x: [ValueArray]) => vari(x, 1)
export const varis = variance_sample

export const standard_deviation = (val: [ValueArray], ddof: DDOF) => pow([vari(val, ddof), .5])
export const stdev = standard_deviation

export const standard_deviation_population = (x: [ValueArray]) => standard_deviation(x, 0)
export const stdevp = standard_deviation_population

export const standard_deviation_sample = (x: [ValueArray]) => standard_deviation(x, 1)
export const stdevs = standard_deviation_sample

export function z_score(val: [ValueArray], windowSize: number) {
    const list = val[0]
    const len = length(list)
    let sum = 0
    let count = 0
    let M2 = 0
    const ret:number[]=[]
    // let mean = 0
    for (let i = 0; i < len; i++) {
        const v = list[i]
        let old_mean = count === 0 ? 0 : (sum / count)
        if (count === windowSize) {
            const old_v = list[i - windowSize]
            M2 -= (old_v - old_mean) ** 2
            count--
            sum -= old_v
        }

        sum += v
        count++
        const mean = sum / count
        M2 += (v - old_mean) * (v - mean)
        const stdev = Math.sqrt(M2 / count)
        ret[i]=(v-mean)/stdev
    }
    return ret


}
