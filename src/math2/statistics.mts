import { length, map, ValueArray } from "../main.mjs";
import { checkShape, pow, mean_r, sub, sum_r, mul } from "./base.mjs";

export const covariance = function (x: ValueArray, y: ValueArray, ddof = 0) {
    checkShape([x, y])
    const MEAN = mean_r(x, y)
    return sum_r(mul(...map([x, y], (d, i) => sub(d, MEAN[i])))) / (length(x) - ddof)
}
export const cov = covariance

export const covariance_population = (x: ValueArray, y: ValueArray) => covariance(x, y, 0)
export const covp = covariance_population

export const covariance_sample = (x: ValueArray, y: ValueArray) => covariance(x, y, 1)
export const covs = covariance_sample

export const variance = (x: ValueArray, ddof = 0) => cov(x, x, ddof)
export const vari = variance

export const variance_population = (x: ValueArray) => vari(x, 0)
export const varip = variance_population

export const variance_sample = (x: ValueArray) => vari(x, 1)
export const varis = variance_sample

export const standard_deviation = (x: ValueArray, ddof = 0) => pow(vari(x, ddof), .5)
export const stdev = standard_deviation

export const standard_deviation_population = (x: ValueArray) => standard_deviation(x, 0)
export const stdevp = standard_deviation_population

export const standard_deviation_sample = (x: ValueArray) => standard_deviation(x, 1)
export const stdevs = standard_deviation_sample
