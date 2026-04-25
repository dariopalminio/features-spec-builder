## ADDED Requirements

### Requirement: Instalación local copia skills al directorio del proyecto
Cuando `agile-sddf` se instala localmente con `npm install agile-sddf`, el script `postinstall.js` SHALL copiar `.claude/skills/` y `.claude/agents/` al subdirectorio `.claude/` del directorio de trabajo actual (`process.cwd()`), sin afectar `~/.claude/`.

#### Scenario: Instalación local en proyecto sin skills previos
- **WHEN** el usuario ejecuta `npm install agile-sddf` desde la raíz de un proyecto
- **THEN** `process.env.npm_config_global` no es `'true'`
- **THEN** el script copia los skills a `./.claude/skills/` del proyecto
- **THEN** el script copia los agentes a `./.claude/agents/` del proyecto
- **THEN** `~/.claude/` no es modificado
- **THEN** el script muestra el resumen: `SDDF installed (local): X skills, Y agents (Z skipped)`

#### Scenario: Instalación local con skills ya existentes en el proyecto
- **WHEN** el directorio `./.claude/skills/story-creation/` ya existe en el proyecto
- **WHEN** el usuario ejecuta `npm install agile-sddf` sin flag de fuerza
- **THEN** el script omite ese directorio
- **THEN** imprime `Skipped (already exists): ./.claude/skills/story-creation/`
- **THEN** continúa instalando los demás skills sin interrumpir el proceso

### Requirement: Detección del modo de instalación por variable de entorno npm
El script SHALL usar `process.env.npm_config_global === 'true'` para determinar si la instalación es global. Cualquier otro valor (incluyendo `undefined`) SHALL ser tratado como instalación local.

#### Scenario: Variable indica instalación global
- **WHEN** `process.env.npm_config_global` tiene el valor `'true'`
- **THEN** el script usa `~/.claude/` como directorio destino

#### Scenario: Variable indica instalación local
- **WHEN** `process.env.npm_config_global` es `undefined` o cualquier valor distinto de `'true'`
- **THEN** el script usa `process.cwd() + '/.claude/'` como directorio destino

### Requirement: Validación del destino antes de copiar
Si el destino base (`.claude/` en modo local, `~/.claude/` en modo global) existe pero no es un directorio, el script SHALL terminar con exit code 1 y mostrar un mensaje de error sin modificar ningún archivo.

#### Scenario: Destino es un archivo, no un directorio
- **WHEN** existe un archivo llamado `.claude` (no directorio) en el directorio destino
- **WHEN** el script intenta iniciar la copia
- **THEN** muestra el error: `SDDF error: .claude exists but is not a directory`
- **THEN** termina con exit code 1
- **THEN** no modifica el archivo existente ni ningún otro archivo

### Requirement: Mensajes diferenciados por modo de instalación
El resumen final SHALL indicar explícitamente el modo (`local` o `global`) y la ruta de destino.

#### Scenario: Resumen de instalación local
- **WHEN** el script completa una instalación local
- **THEN** imprime: `SDDF installed (local): X skills, Y agents (Z skipped)`

#### Scenario: Resumen de instalación global
- **WHEN** el script completa una instalación global
- **THEN** imprime: `SDDF installed (global): X skills, Y agents (Z skipped)`
