export function throwError(msg?:string):never{
    throw new Error(`facing-math:${msg}`)
}