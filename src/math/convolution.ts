import { FFT } from "./FFT";

export default function convolution(a, b) {
    let A = FFT(a)
    let B = FFT(b)
    let AB = new Array(A.length)
    for (let i = 0; i < A.length; i++)
        AB[i] = A[i].complexProduct(B[i])
    return FFT(AB, true)
}