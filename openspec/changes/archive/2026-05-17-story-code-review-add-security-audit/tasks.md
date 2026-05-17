## 1. Actualizar metadatos del skill

- [x] 1.1 En `story-code-review/SKILL.md`, añadir `security-audit` a la sección `## Dependencias` bajo `Skills:`
- [x] 1.2 En `story-code-review/SKILL.md`, añadir `.tmp/security-audit/audit-report.md` a la sección `## Salida` como artefacto temporal condicional
- [x] 1.3 Actualizar la `description` del frontmatter de `story-code-review/SKILL.md` para mencionar que lanza cuatro agentes (incluyendo security-audit)

## 2. Añadir lanzamiento paralelo de security-audit (Paso 3b)

- [x] 2.1 En el Paso 3b de `story-code-review/SKILL.md`, añadir el cuarto bloque de invocación paralela: `security-audit --repo $SDDF_ROOT --story $STORY_DIR`
- [x] 2.2 Añadir la línea `🔒 Security-Audit → analizando archivos modificados` al bloque de progreso del Paso 3b
- [x] 2.3 Actualizar el comentario de espera al final del Paso 3 para indicar que se espera a los cuatro participantes

## 3. Incorporar resultado al consolidador (Paso 4)

- [x] 3.1 En el Paso 4a, añadir lectura de `.tmp/security-audit/audit-report.md` junto con los tres reportes existentes
- [x] 3.2 Añadir lógica de skip: si `audit-report.md` no existe o contiene `source_files_found: false`, registrar `$SECURITY_STATUS = skipped` y no añadir severidad
- [x] 3.3 En el Paso 4b, añadir el resultado de security-audit al cálculo de `$MAX_SEVERITY`: `FAIL` → HIGH, `PASS` → ninguna severidad adicional
- [x] 3.4 Actualizar el Paso 4c (derivación de `review-status`) para que la descripción mencione que incluye los cuatro participantes
- [x] 3.5 En el Paso 4f (generación de `fix-directives.md`), añadir los hallazgos FAIL del security audit a la tabla de instrucciones de corrección (con `Dimensión: security-audit`, `Archivo:Línea` donde esté disponible, o referencia a `audit-report.md` cuando no)

## 4. Añadir sección Security Audit al reporte (Paso 5)

- [x] 4.1 En el Paso 5b de `story-code-review/SKILL.md`, añadir lógica para inyectar la sección `## Security Audit` en `code-review-report.md` después de las secciones de los tres revisores existentes
- [x] 4.2 Definir contenido de la sección cuando el audit ejecutó: status (`PASS`/`FAIL`), resumen (evaluated/pass/fail/na) y listado de FAIL items
- [x] 4.3 Definir contenido de la sección cuando el audit fue skipped: `⏭️ Security Audit: omitido — no se detectaron archivos fuente modificados`

## 5. Actualizar resumen final (Paso 7)

- [x] 5.1 En el Paso 7 de `story-code-review/SKILL.md`, añadir la fila `🔒 Security Audit │ <status> │ <N> hallazgos` a la tabla de dimensiones del resumen final (tanto en el bloque `approved` como en el bloque `needs-changes`)
- [x] 5.2 Verificar que la tabla del Paso 7 renderiza correctamente con cuatro filas en ambos casos (approved y needs-changes)
