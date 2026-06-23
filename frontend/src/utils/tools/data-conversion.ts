import { fa1, fa8, faArrowDown19, faArrowUp91, faHashtag, faLink, faLock, faLockOpen, faN, faSquareBinary } from '@fortawesome/free-solid-svg-icons'
import type { ToolDefinition } from '../types'

export const DATA_CONVERSION_TOOLS: ToolDefinition[] = [
    {
        id: 'to-base64',
        name: 'Convert to Base 64',
        description: 'Convert text to Base64 format',
        category: 'Data Conversion',
        icon: faLock,
        execute: input => btoa(String.fromCharCode(...new TextEncoder().encode(input)))
    },
    {
        id: 'from-base64',
        name: 'Convert from Base 64',
        description: 'Convert Base64 data to text',
        category: 'Data Conversion',
        icon: faLockOpen,
        execute: input => {
            const bytes = Uint8Array.from(atob(input), c => c.charCodeAt(0))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-hex',
        name: 'Convert to Hex',
        description: 'Convert text to its hexadecimal representation',
        category: 'Data Conversion',
        icon: faHashtag,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(16).padStart(2, '0')).join('')
    },
    {
        id: 'from-hex',
        name: 'Convert from Hex',
        description: 'Convert hexadecimal data to text',
        category: 'Data Conversion',
        icon: faHashtag,
        execute: input => {
            const bytes = new Uint8Array(input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-decimal',
        name: 'Convert to Decimal',
        description: 'Convert text to its decimal representation',
        category: 'Data Conversion',
        icon: fa1,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(10)).join(' ')
    },
    {
        id: 'from-decimal',
        name: 'Convert from Decimal',
        description: 'Convert decimal data to text',
        category: 'Data Conversion',
        icon: fa1,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 10)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-binary',
        name: 'Convert to Binary',
        description: 'Convert text to its binary representation',
        category: 'Data Conversion',
        icon: faSquareBinary,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(2).padStart(8, '0')).join(' ')
    },
    {
        id: 'from-binary',
        name: 'Convert from Binary',
        description: 'Convert binary data to text',
        category: 'Data Conversion',
        icon: faSquareBinary,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 2)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-octal',
        name: 'Convert to Octal',
        description: 'Convert text to its octal representation',
        category: 'Data Conversion',
        icon: fa8,
        execute: input => Array.from(new TextEncoder().encode(input)).map(byte => byte.toString(8)).join(' ')
    },
    {
        id: 'from-octal',
        name: 'Convert from Octal',
        description: 'Convert octal data to text',
        category: 'Data Conversion',
        icon: fa8,
        execute: input => {
            const bytes = new Uint8Array(input.split(' ').map(num => parseInt(num, 8)))
            return new TextDecoder().decode(bytes)
        }
    },
    {
        id: 'to-base-n',
        name: 'Convert to Base N',
        description: 'Convert a decimal number to a custom Base N representation',
        category: 'Data Conversion',
        icon: faN,
        options: [
            { key: 'base', label: 'Base', type: 'number', default: 16 }
        ],
        execute: (input, options) => {
            if(!input.trim()) return ''
            const base = options.base ?? 16
            if(typeof base !== 'number' || base < 2 || base > 36) throw new Error('Base must be a number between 2 and 36')
            if(isNaN(base)) throw new Error('Base must be a valid number')
            if(isNaN(Number(input))) throw new Error('Input must be a valid number')
            return parseInt(input, 10).toString(base)
        }
    },
    {
        id: 'from-base-n',
        name: 'Convert from Base N',
        description: 'Convert a custom Base N representation to a decimal number',
        category: 'Data Conversion',
        icon: faN,
        options: [
            { key: 'base', label: 'Base', type: 'number', default: 16 }
        ],
        execute: (input, options) => {
            if(!input.trim()) return ''
            const base = options.base ?? 16
            if(typeof base !== 'number' || base < 2 || base > 36) throw new Error('Base must be a number between 2 and 36')
            if(isNaN(base)) throw new Error('Base must be a valid number')
            if(Number.isNaN(parseInt(input, base))) throw new Error(`Input contains characters that are not valid for base ${base}`)
            if(isNaN(parseInt(input, base))) throw new Error(`Input must be a valid number in base ${base}`)
            return parseInt(input, base).toString(10)
        }
    },
    {
        id: 'to-bcd',
        name: 'Convert to BCD',
        description: 'Convert text to its Binary-Coded Decimal representation',
        category: 'Data Conversion',
        icon: faArrowDown19,
        execute: input => {
            if(!input.trim()) return ''
            if(input.split('').some(char => isNaN(parseInt(char, 10)))) throw new Error('Input must be a valid decimal number')
            return input.split('').map(digit => parseInt(digit, 10).toString(2).padStart(4, '0')).join(' ')
        }
    },
    {
        id: 'from-bcd',
        name: 'Convert from BCD',
        description: 'Convert Binary-Coded Decimal data to text',
        category: 'Data Conversion',
        icon: faArrowUp91,
        execute: input => {
            if(!input.trim()) return ''
            const bytes = input.split(' ').map(num => parseInt(num, 2))
            if(bytes.some(byte => byte < 0 || byte > 9)) throw new Error('Input must be a valid BCD representation')
            return bytes.map(byte => byte.toString(10)).join('')
        }
    },
    {
        id: 'url-encode',
        name: 'URL Encode',
        description: 'Encode text for use in a URL',
        category: 'Data Conversion',
        icon: faLink,
        execute: input => encodeURIComponent(input)
    },
    {
        id: 'url-decode',
        name: 'URL Decode',
        description: 'Decode URL-encoded text',
        category: 'Data Conversion',
        icon: faLink,
        execute: input => decodeURIComponent(input)
    }
]
