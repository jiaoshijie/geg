import { render } from './markdownit.ts';
import { parse } from 'https://deno.land/std@0.159.0/flags/mod.ts';

// -i(input_file) -o(output_file)
const __args = parse(Deno.args)

const input_path = __args['i']
if (input_path === undefined) {
  console.log("ERROR: input file must be specified")
  Deno.exit(1)
}

try {
  const input_info = await Deno.stat(input_path)
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.log("ERROR: input file doesn't exist.")
    Deno.exit(1)
  } else {
    throw error
  }
}

let output_path = __args['o']

if (output_path === undefined) {
  output_path = await Deno.makeTempFile({prefix: "geg_", suffix: ".html"})
}

let res_dir = Deno.env.get("HOME") + "/Downloads/Code/my/geg/resources/"

let index_before = await Deno.readTextFile(res_dir + "index_before.html")
let content = render(await Deno.readTextFile(input_path))
let index_after = await Deno.readTextFile(res_dir + "index_after.html")

let new_html = index_before + content + index_after

try {
  await Deno.writeTextFile(output_path, new_html)
  console.log(output_path)
} catch (error) {
  throw error
}
