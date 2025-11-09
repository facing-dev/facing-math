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
