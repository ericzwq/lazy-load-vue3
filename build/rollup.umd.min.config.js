import {terser} from 'rollup-plugin-terser'
import config from './rollup.umd.config'
import {file} from './rollup.config'

config.output.file = file("min")
config.plugins.push(terser())
export default config
