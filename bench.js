import { Bench } from 'tinybench'
import { hash as blake3wasm } from "@timsuchanek/blake3-wasm"
import { blake3 as noble } from '@noble/hashes/blake3'
import { createReadStream, readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { instantiate } from './deno_std_wasm_crypto.generated.mjs'

const deno = instantiate()

const directory = readdirSync('./sample-files')
const bench = new Bench({ warmupIterations: 100, iterations: 1000 })

bench.add('just reading from disk', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await Function.prototype(fileContents)
})

bench.add('node:crypto checksum', async function () {
	const path = './sample-files/' + pickRandomlyFrom(directory)
	await new Promise((resolve, reject) => {
		const hash = createHash('sha1')
		const rs = createReadStream(path)
		rs.on('error', reject)
		rs.on('data', chunk => hash.update(chunk))
		rs.on('end', () => resolve(hash.digest('hex')))
	})
})

bench.add('web crypto SHA-1', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-1', fileContents)
})

bench.add('web crypto SHA-256', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-256', fileContents)
})

bench.add('web crypto SHA-384', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-384', fileContents)
})

bench.add('web crypto SHA-512', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-512', fileContents)
})

bench.add('deno-std BLAKE3', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	const x = deno.digest('BLAKE3', fileContents)
})

bench.add('blake3-wasm', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	blake3wasm(fileContents)
})

bench.add('@noble/hashes BLAKE3', async function() {
	const fileContents = readFileSync('./sample-files/' + pickRandomlyFrom(directory))
	noble(fileContents)
})


await bench.run()

console.table(bench.table())


/***** UTILITY FUNCTIONS *****/

function pickRandomlyFrom(array) {
  if (array.length < 1) throw new Error
  return array[Math.floor(Math.random() * array.length)]
}