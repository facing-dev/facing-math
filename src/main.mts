export {
    type Value,
    type ValueArray,
    type ValueSingle,
    type ValueBatchLoose,
    type ValueBatch,
    isValueArray,
    isValueSingle,
    map,
    each,
    slice,
    length,
    lengthLoose
} from './value/value.mjs'

export {
    mul, multiply,
    div, divide,
    add,
    sub, subtract,
    pow, power,
    mean,
    sum
} from './math/base.mjs'

export * from './math/statistics.mjs'