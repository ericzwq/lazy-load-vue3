import basicConfig, {file} from "./rollup.config";
import {name} from '../package.json'

export default {
  ...basicConfig,
  output: {
    name,
    file: file("esm"),
    format: "es"
  }
}
