declare module 'bacon-cipher' {
    export function encode(input: string, options?: { alphabet?: string }): string
    export function decode(input: string, options?: { alphabet?: string }): string
}

declare module 'cipherjs' {
    export const Substitution: {
        encrypt: (plaintext: string, key: string) => string
        decrypt: (ciphertext: string, key: string) => string
    }
}
