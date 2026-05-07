---
alwaysApply: false
type: definition-of-done
slug: definition-of-done
title: "Definition of Done"
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Definition of Done (DoD)

> Una historia de usuario se considera **DONE** cuando cumple todos los criterios marcados en este documento. Ninguna historia puede cerrar sprint ni desplegarse a producción sin satisfacer estos criterios.

---

## ✅ Criterios de Aceptación

<!-- Criterios funcionales que toda historia debe cumplir. -->

- [ ] Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente
- [ ] Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados
- [ ] El comportamiento coincide con lo especificado en `design.md`
- [ ] No hay regresiones en las funcionalidades previamente trabajadas

---

## 💻 Criterios de Código

<!-- Estándares de calidad del código producido. -->

- [ ] El código sigue las convenciones definidas en `constitution.md` (estilo, nombres, organización)
- [ ] No hay código comentado ni `TODO` sin issue asociado
- [ ] No hay variables, imports ni funciones sin usar
- [ ] El código pasa el linter y el formateador sin errores ni warnings
- [ ] No se introducen dependencias nuevas sin aprobación del equipo

---

## 🧪 Criterios de Tests

<!-- Cobertura y calidad de las pruebas. -->

- [ ] Existe al menos un test por escenario principal de `story.md`
- [ ] Todos los tests existentes pasan (sin tests saltados sin justificación)
- [ ] La cobertura de tests no disminuye respecto al baseline del proyecto
- [ ] Los tests son deterministas (no flaky)
- [ ] Los tests de integración cubren los flujos críticos de la historia

---

## 📝 Criterios de Documentación

<!-- Actualización de documentación relevante. -->

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados
- [ ] Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md`
- [ ] El CHANGELOG o historial de releases se actualiza si aplica

---

## 🚀 Criterios de Despliegue

<!-- Condiciones necesarias para desplegar a producción. -->

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] La historia fue revisada y aprobada (code review o self-review según `constitution.md`)
- [ ] No hay secrets ni credenciales expuestos en el código
- [ ] Las variables de entorno necesarias están documentadas
- [ ] El despliegue puede revertirse sin pérdida de datos si algo falla

---

## 📎 Notas adicionales

<!-- Criterios específicos del proyecto que no encajan en las categorías anteriores. -->

[Por completar]
