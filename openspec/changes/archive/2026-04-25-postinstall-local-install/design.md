## Context

El script `scripts/postinstall.js` actual asume siempre instalación global: usa `os.homedir()` como base del destino. El resultado es que `npm install agile-sddf` (sin `-g`) copia skills a `~/.claude/` igual que la instalación global, sin ningún tipo de aislamiento por proyecto.

npm inyecta la variable de entorno `npm_config_global` en todos los scripts que ejecuta durante una instalación. Su valor es `'true'` en instalaciones globales y `undefined` (o ausente) en instalaciones locales. Esta variable es la forma canónica y portable de detectar el modo de instalación.

## Goals / Non-Goals

**Goals:**
- `npm install agile-sddf` copia skills a `./.claude/` del directorio de trabajo del usuario
- `npm install -g agile-sddf` mantiene el comportamiento actual: copia a `~/.claude/`
- Validación: si el destino `.claude` existe pero no es directorio, el script falla con un mensaje claro
- Los mensajes de consola indican el modo: `(local)` o `(global)`

**Non-Goals:**
- Soporte para `pnpm` o `yarn` (variables de entorno distintas, requiere investigación separada)
- Flag `--force` para sobrescritura de skills existentes
- Desinstalación o limpieza al hacer `npm uninstall`
- Instalación en `.github/` u otros destinos alternativos

## Decisions

### Detección por `process.env.npm_config_global`
**Decisión**: Usar la variable de entorno `npm_config_global` como única señal de modo.
**Alternativa**: Inferir el modo comparando `__dirname` con rutas globales conocidas (ej. si el path contiene la ruta global de node_modules).
**Rationale**: `npm_config_global` es la variable oficial que npm documenta y garantiza en todos los scripts de ciclo de vida. La alternativa de comparar rutas es frágil en Windows, con nvm, o con configuraciones custom de prefix. Una variable booleana explícita es más robusta.

### Destino local: `process.cwd()` + `.claude/`
**Decisión**: Usar `process.cwd()` para resolver el directorio del proyecto en instalación local.
**Alternativa**: Usar `path.resolve(__dirname, '..', '..', '..')` para subir desde `node_modules/agile-sddf/scripts/`.
**Rationale**: `process.cwd()` es el directorio desde donde el usuario ejecutó npm, que es exactamente el directorio raíz del proyecto. La alternativa de subir 3 niveles es frágil si la estructura de node_modules cambia (ej. workspaces de npm).

### Validación del destino antes de copiar
**Decisión**: Verificar con `fs.statSync` si el destino base (`.claude/` o `~/.claude/`) existe y es directorio antes de intentar crear subdirectorios.
**Rationale**: Evita que `fse.ensureDir` sobreescriba silenciosamente un archivo llamado `.claude`. El error debe ser explícito y con exit code 1 para que el usuario pueda identificar y resolver el conflicto.

### Refactor: función `resolveDestDir()` 
**Decisión**: Extraer la lógica de resolución de destino a una función `resolveDestDir()` que encapsula la detección del modo.
**Rationale**: Facilita testear la lógica de detección de forma aislada. La función retorna un objeto `{ destDir, mode }` donde `mode` es `'local'` o `'global'`.

## Risks / Trade-offs

- **[Riesgo] `process.cwd()` puede no ser el directorio del proyecto en entornos CI**: Si el script se ejecuta desde un directorio distinto al root del proyecto (ej. `npm install` desde un subdirectorio), el destino `.claude/` no estaría en el lugar esperado. Mitigación: documentar que `npm install agile-sddf` debe ejecutarse desde la raíz del proyecto.
- **[Trade-off] Un mismo paquete instala en dos destinos distintos según contexto**: Puede sorprender a usuarios que no leen el README. Mitigación: el mensaje de consola indica claramente el destino (`SDDF installed (local): ./.claude/`).
- **[Riesgo] `npm_config_global` no disponible en `yarn` o `pnpm`**: La detección fallará y el script asumirá modo local cuando debería ser global. Aceptado como fuera de scope; documentar en README.
