import { copyFile } from "node:fs/promises"
import { join } from "node:path"

const [ _node, _cloneSampleJs, count ] = process.argv

const copies = count ? parseInt(count) : 100000

console.warn("This command will create " + copies + " copies of ./sample-files/x.astro, which will write a lot of data to disk.\n\nPress Enter to continue.")

await new Promise(resolve => process.stdin.once('data', () => resolve()))

console.info("Cloning x.astro...")

for (let i = 0; i < copies; i++) {
    copyFile('./sample-files/x.astro', './sample-files/' + crypto.randomUUID() + '.astro')
}

process.exit()
