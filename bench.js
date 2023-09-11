import { Bench } from 'tinybench'
import fs from 'fs/promises'
import { hash as blake3wasm } from "@timsuchanek/blake3-wasm"
import { blake3 as noble } from '@noble/hashes/blake3'

const directory = await fs.readdir('./sample-files')
const bench = new Bench({ warmupIterations: 100, iterations: 1000 })

bench.add('just reading from disk', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await Function.prototype(fileContents)
})

bench.add('web crypto SHA-1', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-1', fileContents)
})

bench.add('web crypto SHA-256', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-256', fileContents)
})

bench.add('web crypto SHA-384', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-384', fileContents)
})

bench.add('web crypto SHA-512', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	await crypto.subtle.digest('SHA-512', fileContents)
})

bench.add('blake3-wasm', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	blake3wasm(fileContents)
})

bench.add('@noble/hashes BLAKE3', async function() {
	const fileContents = await fs.readFile('./sample-files/' + pickRandomlyFrom(directory))
	noble(fileContents)
})


await bench.run()

console.table(bench.table())


/***** UTILITY FUNCTIONS *****/

function pickRandomlyFrom(array) {
  if (array.length < 1) throw new Error
  return array[Math.floor(Math.random() * array.length)]
}