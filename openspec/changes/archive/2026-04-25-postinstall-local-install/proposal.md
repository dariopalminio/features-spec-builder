## Why

El script `postinstall.js` actual siempre copia skills y agentes a `~/.claude/` (global), sin importar si la instalación es global (`-g`) o local. Esto hace que `npm install agile-sddf` (sin `-g`) sea funcionalmente idéntico a la instalación global, impidiendo el aislamiento de skills por proyecto.

## What Changes

- Modificar `scripts/postinstall.js` para detectar el modo de instalación mediante `process.env.npm_config_global`
- Si instalación **local**: copiar skills y agentes a `./.claude/` del directorio de trabajo actual (`process.cwd()`)
- Si instalación **global**: mantener el comportamiento actual — copiar a `~/.claude/`
- Agregar validación: si `.claude` existe en el destino pero no es directorio, terminar con error (exit code 1)
- Actualizar los mensajes de consola para indicar el modo: `"SDDF installed (local): ..."` vs `"SDDF installed (global): ..."`

## Capabilities

### New Capabilities
- `npm-local-install`: Soporte para instalación local (`npm install agile-sddf`) con copia de skills y agentes al `.claude/` del proyecto. Incluye detección de modo, validación del destino y mensajes diferenciados.

### Modified Capabilities
- `npm-postinstall-installer`: El requisito de copia automática ahora es bifurcado por modo (global/local). El comportamiento global se mantiene; se añade el comportamiento local. El resumen final incluye indicación del modo.

## Impact

- **Archivo modificado**: `scripts/postinstall.js`
- **Sin cambios en `package.json`**: el campo `scripts.postinstall` y `files` no cambian
- **Sin nuevas dependencias**: `process.env.npm_config_global` y `process.cwd()` son parte del runtime de Node.js
- **Compatibilidad**: macOS, Linux y Windows — `process.cwd()` resuelve correctamente en todos los SO
