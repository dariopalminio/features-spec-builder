## 1. Refactorizar lógica de detección de modo

- [x] 1.1 Leer el archivo `scripts/postinstall.js` actual para entender la estructura existente
- [x] 1.2 Extraer función `resolveDestDir()` que retorna `{ destDir, mode }` basándose en `process.env.npm_config_global`
- [x] 1.3 Implementar: si `npm_config_global === 'true'` → `{ destDir: path.join(os.homedir(), '.claude'), mode: 'global' }`
- [x] 1.4 Implementar: caso contrario → `{ destDir: path.join(process.cwd(), '.claude'), mode: 'local' }`

## 2. Agregar validación del destino

- [x] 2.1 Antes de copiar, verificar con `fs.existsSync` + `fs.statSync` si el destino base existe
- [x] 2.2 Si existe pero no es directorio: imprimir `SDDF error: .claude exists but is not a directory` y `process.exit(1)`

## 3. Actualizar función principal de copia

- [x] 3.1 Reemplazar el uso de `path.join(os.homedir(), '.claude')` hardcoded por el resultado de `resolveDestDir()`
- [x] 3.2 Pasar el `destDir` resuelto a la función `copyDir()` existente (sin cambiar su firma interna)

## 4. Actualizar mensajes de consola

- [x] 4.1 Actualizar el mensaje inicial: `SDDF postinstall: copying skills and agents to <destDir>\n`
- [x] 4.2 Actualizar el resumen final: `SDDF installed (${mode}): ${si} skills, ${ai} agents (${ss + as_} skipped)`

## 5. Verificar comportamiento

- [x] 5.1 Simular instalación local: ejecutar `node scripts/postinstall.js` sin `npm_config_global` y verificar que el destino es `./.claude/` del directorio actual
- [x] 5.2 Simular instalación global: ejecutar `npm_config_global=true node scripts/postinstall.js` y verificar que el destino es `~/.claude/`
- [x] 5.3 Verificar caso de error: crear un archivo `.claude` en el directorio de prueba y confirmar que el script termina con exit code 1
- [x] npm publish --access public
- [x] Local:  SDDF postinstall → C:\Users\code\<MyProject>\.claude   → (local)
- [x] Global: SDDF postinstall → C:\Users\<User>\.claude         → (global)
- [x] Error:  SDDF error: .claude exists but is not a directory → exit 1

## 6. Actualizar README

- [x] 6.1 Agregar sección de instalación local en `README.md` que explique `npm install agile-sddf` con destino `.claude/` del proyecto
- [x] 6.2 Diferenciar visualmente cuándo usar instalación local vs global
