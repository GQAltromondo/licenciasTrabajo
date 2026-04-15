# Documento de Version - Licencias de Trabajo TR-TB

**Branch:** NewMain ( 1.0.30 )
**Fecha:** 2026-04-15
**Aplicacion:** Transener Operaciones - Licencias de Trabajo

---

## Resumen General

Esta version incorpora cambios significativos en la gestion de licencias de trabajo, incluyendo la implementacion completa del flujo de Colocacion/Retiro e Inhibicion/Habilitacion, mejoras en el diagrama Gantt, mejoras en reportes.

---

## Cambios por Modulo

### 1. Colocacion, Retiro, Inhibicion y Habilitacion (DOC8)

**Archivos afectados:**
- `webapp/utils/LicenceHelper.js`
- `webapp/services/LicenseService.js`
- `webapp/views/Main/License/License.controller.js`
- `webapp/views/Main/License/License.view.js`
- `webapp/conf/permisosPorEstado.json`

**Descripcion de cambios:**
- Se implemento la funcion `generateInhibicionHabilitacion()` en `LicenceHelper.js`, reemplazando la anterior `generatePlacementRemoval()`. La nueva logica genera pares de Inhibicion/Habilitacion y Colocacion/Retiro con emparejamiento por clave natural.
- Se agrego `formatUTCDatesHab()` para el manejo correcto de fechas UTC en habilitaciones, convirtiendo `Datehab` y generando `Datelicencia` de forma consistente.
- Se modifico `HabilitacionLicence()` en `LicenseService.js` para recibir un parametro `oMeta` adicional que permite rastrear el registro original por `RefId` o `__lid` (ID local).
- Se actualizo `successPOSTHabilitacion()` para preservar la fecha ingresada por el usuario (`Datehab`) tras la respuesta del backend, evitando que se sobrescriba.
- Se agregaron permisos para las acciones `colocacion`, `retiro`, `inhibicion` y `habilitacion` en `permisosPorEstado.json`, habilitando los roles: `Jefe_Turno_COT`, `Jefe_Turno_COTDT`, `Operador_COTDT` y `Operador_COT`.

### 2. Diagrama Gantt

**Archivos afectados:**
- `webapp/utils/Gantt/GanttHelper.js`
- `webapp/utils/Gantt/GanttHelper-dbg.js` (eliminado)
- `webapp/views/Main/Gantt/Gantt.controller.js`
- `webapp/views/Main/Gantt/Gantt.view.xml`

**Descripcion de cambios:**
- Se reescribio completamente `GanttHelper.js` para mejorar legibilidad y mantenibilidad, reemplazando variables de una letra por nombres descriptivos.
- Se elimino el archivo debug `GanttHelper-dbg.js` (redundante con la version desminificada).
- Se modifico la logica de `getBooleanDiffInicioYFin()` para retornar `true` cuando existen inicio y fin, independientemente de la diferencia de tiempo.
- Se actualizaron el controlador y la vista del Gantt con mejoras en la presentacion y manejo de datos.

### 3. Reportes

**Archivos afectados:**
- `webapp/services/ReportesService.js`
- `webapp/utils/ReportesHelper.js`
- `webapp/utils/ExportLicenseHelper.js`

**Descripcion de cambios:**
- Se agrego la obtencion asincrona de horarios por licencia en el reporte de Programacion Semanal (`getReporteProgramacionSemanal`), enriqueciendo cada item con datos de `HorariosPorLicencia_nav`.
- Se reindento y reorganizo la funcion `getDiasAnulados()` para mejor legibilidad.
- Se rehabilitaron las secciones de Colocaciones, Retiros, Habilitaciones e Inhibiciones en la exportacion a PDF (`createNormalPDFBody`), que anteriormente estaban comentadas.
- Se ampliaron las funciones de generacion de contenido PDF para incluir las nuevas tablas de Colocacion/Retiro e Inhibicion/Habilitacion.

### 4. Tooltips y UI

**Archivos afectados:**
- `webapp/views/Main/License/License.controller.js`
- `webapp/utils/FormatterHelper.js`

**Descripcion de cambios:**
- Se agregaron funciones de tooltip `formatTplnrTooltip()` y `formatTecetTooltip()` en el controlador de License, usando `FormatterHelper` para mostrar labels descriptivos de estaciones (`getEstacionLabel`) y personal habilitado (`getPersonalHabilitadoLabel`).


