import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "rollup-plugin-typescript2";
import {getBabelOutputPlugin} from "@rollup/plugin-babel";
import {name} from "../package.json";

const file = type => `lib/${name}.${type}.js`

export {file}
export default {
  input: "src/index.ts",
  output: {
    name,
    file: file("esm"),
    format: "es",
  },
  plugins: [
    resolve(),
    commonjs({transformMixedEsModules: true}),
    typescript({
      tsconfigOverride: {
        compilerOptions: {declaration: true, declarationDir: 'types'},
        exclude: ["tests/**/*.ts", "tests/**/*.tsx"],
      },
      useTsconfigDeclarationDir: true
    }),
    getBabelOutputPlugin({
      allowAllFormats: true,
      presets: [['@babel/preset-env']]
    })
  ],
  external: ["vue"],
};
