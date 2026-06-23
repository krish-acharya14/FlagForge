import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import CryptoJS from 'crypto-js'
import type { ToolDefinition } from '../types'

export const CRYPTOGRAPHY_TOOLS: ToolDefinition[] = [
    {
        id: 'aes-encrypt',
        name: 'AES Encrypt',
        description: 'Encrypt text using AES encryption',
        category: 'Cryptography',
        icon: faLock,
        options: [
            { key: 'key', label: 'Key', type: 'text', default: '' },
            { key: 'key_format', label: 'Key Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'iv', label: 'IV', type: 'text', default: '' },
            { key: 'iv_format', label: 'IV Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'mode', label: 'Mode', type: 'select', default: 'CBC', options: ['CBC', 'CFB', 'CTR', 'OFB'] },
            { key: 'padding', label: 'Padding', type: 'select', default: 'Pkcs7', options: ['Pkcs7', 'AnsiX923', 'Iso10126', 'ZeroPadding', 'NoPadding'] },
            { key: 'input_format', label: 'Input Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'output_format', label: 'Output Format', type: 'select', default: 'Base64', options: ['UTF-8', 'Hex', 'Base64'] }
        ],
        execute: (input, options) => {
            const key = (() => {
                switch(options.key_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8.parse(options.key)
                    case 'Hex': return CryptoJS.enc.Hex.parse(options.key)
                    case 'Base64': return CryptoJS.enc.Base64.parse(options.key)
                    default: throw new Error('Invalid key format')
                }
            })()

            const iv = (() => {
                switch(options.iv_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8.parse(options.iv)
                    case 'Hex': return CryptoJS.enc.Hex.parse(options.iv)
                    case 'Base64': return CryptoJS.enc.Base64.parse(options.iv)
                    default: throw new Error('Invalid IV format')
                }
            })()

            const mode = (() => {
                switch(options.mode) {
                    case 'CBC': return CryptoJS.mode.CBC
                    case 'CFB': return CryptoJS.mode.CFB
                    case 'CTR': return CryptoJS.mode.CTR
                    case 'OFB': return CryptoJS.mode.OFB
                    default: throw new Error('Invalid mode')
                }
            })()

            const padding = (() => {
                switch(options.padding) {
                    case 'Pkcs7': return CryptoJS.pad.Pkcs7
                    case 'AnsiX923': return CryptoJS.pad.AnsiX923
                    case 'Iso10126': return CryptoJS.pad.Iso10126
                    case 'ZeroPadding': return CryptoJS.pad.ZeroPadding
                    case 'NoPadding': return CryptoJS.pad.NoPadding
                    default: throw new Error('Invalid padding')
                }
            })()

            const inputFormat = (() => {
                switch(options.input_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8
                    case 'Hex': return CryptoJS.enc.Hex
                    case 'Base64': return CryptoJS.enc.Base64
                    default: throw new Error('Invalid input format')
                }
            })()

            const outputFormat = (() => {
                switch(options.output_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8
                    case 'Hex': return CryptoJS.enc.Hex
                    case 'Base64': return CryptoJS.enc.Base64
                    default: throw new Error('Invalid output format')
                }
            })()

            const encrypted = CryptoJS.AES.encrypt(inputFormat.parse(input), key, { iv, mode, padding })
            return encrypted.ciphertext.toString(outputFormat)
        }
    },
    {
        id: 'aes-decrypt',
        name: 'AES Decrypt',
        description: 'Decrypt text using AES decryption',
        category: 'Cryptography',
        icon: faLockOpen,
        options: [
            { key: 'key', label: 'Key', type: 'text', default: '' },
            { key: 'key_format', label: 'Key Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'iv', label: 'IV', type: 'text', default: '' },
            { key: 'iv_format', label: 'IV Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'mode', label: 'Mode', type: 'select', default: 'CBC', options: ['CBC', 'CFB', 'CTR', 'OFB'] },
            { key: 'padding', label: 'Padding', type: 'select', default: 'Pkcs7', options: ['Pkcs7', 'AnsiX923', 'Iso10126', 'ZeroPadding', 'NoPadding'] },
            { key: 'input_format', label: 'Input Format', type: 'select', default: 'UTF-8', options: ['UTF-8', 'Hex', 'Base64'] },
            { key: 'output_format', label: 'Output Format', type: 'select', default: 'Base64', options: ['UTF-8', 'Hex', 'Base64'] }
        ],
        execute: (input, options) => {
            const key = (() => {
                switch(options.key_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8.parse(options.key)
                    case 'Hex': return CryptoJS.enc.Hex.parse(options.key)
                    case 'Base64': return CryptoJS.enc.Base64.parse(options.key)
                    default: throw new Error('Invalid key format')
                }
            })()

            const iv = (() => {
                switch(options.iv_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8.parse(options.iv)
                    case 'Hex': return CryptoJS.enc.Hex.parse(options.iv)
                    case 'Base64': return CryptoJS.enc.Base64.parse(options.iv)
                    default: throw new Error('Invalid IV format')
                }
            })()

            const mode = (() => {
                switch(options.mode) {
                    case 'CBC': return CryptoJS.mode.CBC
                    case 'CFB': return CryptoJS.mode.CFB
                    case 'CTR': return CryptoJS.mode.CTR
                    case 'OFB': return CryptoJS.mode.OFB
                    default: throw new Error('Invalid mode')
                }
            })()

            const padding = (() => {
                switch(options.padding) {
                    case 'Pkcs7': return CryptoJS.pad.Pkcs7
                    case 'AnsiX923': return CryptoJS.pad.AnsiX923
                    case 'Iso10126': return CryptoJS.pad.Iso10126
                    case 'ZeroPadding': return CryptoJS.pad.ZeroPadding
                    case 'NoPadding': return CryptoJS.pad.NoPadding
                    default: throw new Error('Invalid padding')
                }
            })()

            const inputFormat = (() => {
                switch(options.input_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8
                    case 'Hex': return CryptoJS.enc.Hex
                    case 'Base64': return CryptoJS.enc.Base64
                    default: throw new Error('Invalid input format')
                }
            })()

            const outputFormat = (() => {
                switch(options.output_format) {
                    case 'UTF-8': return CryptoJS.enc.Utf8
                    case 'Hex': return CryptoJS.enc.Hex
                    case 'Base64': return CryptoJS.enc.Base64
                    default: throw new Error('Invalid output format')
                }
            })()

            const cipherText = inputFormat.parse(input)
            const decrypted = CryptoJS.AES.decrypt(cipherText.toString(CryptoJS.enc.Base64), key, { iv, mode, padding })
            return decrypted.toString(outputFormat)
        }
    }
] as const
