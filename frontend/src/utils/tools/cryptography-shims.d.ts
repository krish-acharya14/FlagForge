const MORSE_CODE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
}

const MORSE_CODE_REVERSE: Record<string, string> = Object.fromEntries(
    Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key])
)

const morse = {
    encode(input: string) {
        return input
            .toUpperCase()
            .split(' ')
            .map(word => word
                .split('')
                .map(char => MORSE_CODE_MAP[char] ?? '')
                .filter(Boolean)
                .join(' ')
            )
            .join(' / ')
    },
    decode(input: string) {
        return input
            .trim()
            .split(/\s*\/\s*/)
            .map(word => word
                .split(/\s+/)
                .map(symbol => MORSE_CODE_REVERSE[symbol] ?? '')
                .join('')
            )
            .join(' ')
    }
}


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