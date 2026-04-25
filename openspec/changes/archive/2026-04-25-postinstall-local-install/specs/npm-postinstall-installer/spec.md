## MODIFIED Requirements

### Requirement: Copia automática de skills y agentes tras instalación global
Tras ejecutar `npm install -g agile-sddf`, el script `postinstall.js` SHALL copiar automáticamente el contenido de `.claude/skills/` a `~/.claude/skills/` y `.claude/agents/` a `~/.claude/agents/` en el sistema del usuario. El script SHALL detectar que se trata de una instalación global mediante `process.env.npm_config_global === 'true'` antes de usar `~/.claude/` como destino.

#### Scenario: Instalación limpia en macOS/Linux
- **WHEN** el usuario ejecuta `npm install -g agile-sddf` en un sistema sin skills SDDF previos
- **THEN** el script postinstall se ejecuta automáticamente al finalizar la instalación
- **THEN** `process.env.npm_config_global` es `'true'`
- **THEN** todos los subdirectorios de `.claude/skills/` quedan copiados en `~/.claude/skills/`
- **THEN** todos los subdirectorios de `.claude/agents/` quedan copiados en `~/.claude/agents/`
- **THEN** el script imprime la lista de skills y agentes instalados

#### Scenario: Instalación en Windows
- **WHEN** el usuario ejecuta `npm install -g agile-sddf` en Windows
- **THEN** el script resuelve el destino como `%USERPROFILE%\.claude\skills\` y `%USERPROFILE%\.claude\agents\`
- **THEN** los archivos se copian correctamente sin requerir herramientas de shell nativas del SO

### Requirement: Mensajes de progreso en consola
El script SHALL imprimir mensajes por stdout para cada skill/agente instalado u omitido, y un resumen final que incluya el modo de instalación (`local` o `global`).

#### Scenario: Instalación con mezcla de nuevos y existentes
- **WHEN** el usuario tiene algunos skills ya instalados y otros no
- **THEN** el script imprime `Installed: <ruta-destino>/skills/<name>/` para cada skill nuevo
- **THEN** el script imprime `Skipped (already exists): <ruta-destino>/skills/<name>/` para cada skill omitido
- **THEN** al finalizar imprime un resumen: `SDDF installed (global): X skills, Y agents (Z skipped)`
