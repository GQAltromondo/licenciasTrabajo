# Altromondo S.A
**Dev:** Guillermo Quattrocchi

---

# Guia de Usuario - Colocacion / Retiro e Inhibicion / Habilitacion

**Aplicacion:** Transener Operaciones - Licencias de Trabajo
**Version:** 1.0.30

---

## Conceptos Generales

El sistema gestiona dos pares de operaciones complementarias sobre Estaciones (ET):

| Operacion | Complemento | Descripcion |
|-----------|-------------|-------------|
| **Colocacion** | Retiro | Colocar/retirar un PAT o PAT/A en una estacion |
| **Inhibicion** | Habilitacion | Inhibir/habilitar una estacion |

Cada operacion funciona en **pares obligatorios**: no se puede realizar un Retiro sin una Colocacion previa, ni una Habilitacion sin una Inhibicion previa.

---

## Roles Autorizados

Solo los siguientes roles pueden ejecutar estas operaciones:

| Rol | Descripcion |
|-----|-------------|
| `Jefe_Turno_COT` | Jefe de Turno COT |
| `Jefe_Turno_COTDT` | Jefe de Turno COT/DT |
| `Operador_COT` | Operador COT |
| `Operador_COTDT` | Operador COT/DT |

Usuarios con otros roles no veran habilitados los botones de estas acciones.

---

## Estados (Status) Habilitados

Las operaciones de Colocacion/Retiro e Inhibicion/Habilitacion **solo estan disponibles** cuando la licencia se encuentra en uno de estos dos estados:

| Codigo | Estado | Descripcion |
|--------|--------|-------------|
| **01** | Autorizada | La licencia fue autorizada |
| **28** | Normalizada | La licencia fue normalizada |

En cualquier otro estado (Generada, En tramite, Coordinada, Observada, Suspendida, etc.) estas acciones no estaran disponibles.

---

## Flujo de Trabajo

### Colocacion y Retiro

```
1. Usuario abre licencia en estado Autorizada (01) o Normalizada (28)
2. En la seccion Colocacion, completa una fila nueva:
   - Fecha (obligatoria)
   - Hora (obligatoria)
   - Estacion / ET (obligatoria)
   - TECET (obligatorio)
   - PAT o PAT/A (obligatorio)
   - Comentarios (opcional)
3. Presiona "Enviar" en la fila
4. Si la validacion es exitosa, se guarda en backend
5. La fila de Colocacion queda en solo lectura
6. Automaticamente se genera una fila espejo en la tabla de Retiro
   (con la misma ET, habilitada para editar fecha, hora, TECET y comentarios)
7. El usuario completa los datos del Retiro y lo envia
8. El par Colocacion/Retiro queda cerrado
```

### Inhibicion y Habilitacion

```
1. Usuario abre licencia en estado Autorizada (01) o Normalizada (28)
2. En la seccion Inhibicion, completa una fila nueva:
   - Fecha (obligatoria)
   - Hora (obligatoria)
   - Estacion / ET (obligatoria)
   - TECET (obligatorio)
   - Comentarios (opcional)
3. Presiona "Enviar" en la fila
4. Si la validacion es exitosa, se guarda en backend
5. La fila de Inhibicion queda en solo lectura
6. Automaticamente se genera una fila espejo en la tabla de Habilitacion
   (con la misma ET, habilitada para editar fecha, hora, TECET y comentarios)
7. El usuario completa los datos de la Habilitacion y la envia
8. El par Inhibicion/Habilitacion queda cerrado
```

---

## Validaciones y Restricciones

### Validaciones Comunes (aplican a las 4 operaciones)

| Campo | Validacion | Mensaje de Error |
|-------|-----------|-----------------|
| Fecha | Obligatoria | "La fecha es obligatoria" |
| Hora | Obligatoria | "La hora es requerida" |
| Estacion (ET) | Obligatoria | "Debe de agregar una Estacion para poder realizar la operacion" |
| TECET | Obligatorio (Colocacion, Retiro, Habilitacion) | "Debe completar el campo TECET." |

### Validaciones Especificas por Operacion

#### Colocacion
| Validacion | Descripcion | Mensaje de Error |
|-----------|-------------|-----------------|
| ET activa duplicada | No se puede colocar en una ET que ya tiene una colocacion activa (sin retiro) | "Ya existe una colocacion activa para la ET {ET}. Debe realizar el retiro antes de colocar nuevamente." |
| PAT requerido | Debe seleccionar PAT o PAT/A | "Debe seleccionar PAT o PAT/A para realizar la colocacion." |

#### Inhibicion
| Validacion | Descripcion | Mensaje de Error |
|-----------|-------------|-----------------|
| ET activa duplicada | No se puede inhibir una ET que ya tiene una inhibicion activa (sin habilitacion) | "Ya existe una inhibicion activa para la ET {ET}. Debe realizar la habilitacion antes de inhibir nuevamente." |
| Unicidad en filas nuevas | No se puede agregar la misma ET dos veces en filas nuevas sin guardar | "Ya existe una inhibicion activa para la ET {ET}. Debe completarse el proceso correspondiente antes de crear una nueva." |

#### Retiro
- Solo se habilita cuando existe una Colocacion previa guardada en backend.
- La fila de Retiro se genera automaticamente como espejo de la Colocacion.

#### Habilitacion
- Solo se habilita cuando existe una Inhibicion previa guardada en backend.
- La fila de Habilitacion se genera automaticamente como espejo de la Inhibicion.

---

## Comportamiento de la Interfaz

### Filas Nuevas vs Guardadas

| Estado de la fila | Editable | Boton Enviar | Visual |
|-------------------|----------|-------------|--------|
| Nueva (sin guardar) | Si | Habilitado | Campos editables |
| Guardada en backend | No | Deshabilitado | Solo lectura, muestra valores previos |
| Espejo (pendiente de completar) | Si (fecha, hora, TECET, comentarios) | Habilitado | Generada automaticamente del par |


### Comentarios Expandibles

Cada fila cuenta con un boton de icono (lupa) con tooltip "Ver comentario completo" que abre un dialogo ampliado para ver o editar el comentario. El dialogo es redimensionable y arrastrable, con un area de texto de 10 filas expandible hasta 20.

---

## Resumen de Reglas de Negocio

1. **Pares obligatorios**: Colocacion requiere Retiro posterior. Inhibicion requiere Habilitacion posterior.
2. **Sin duplicados activos**: No se puede tener dos colocaciones o dos inhibiciones activas sobre la misma ET simultaneamente.
3. **Orden secuencial**: Primero se envia la operacion inicial (Colocacion o Inhibicion), luego se habilita su complemento (Retiro o Habilitacion).
4. **Roles especificos**: Solo roles de COT y COTDT (Jefe de Turno y Operador).
5. **Estados limitados**: Solo en licencias Autorizadas (01) o Normalizadas (28).
6. **Inmutabilidad post-envio**: Una vez enviada, la operacion queda en solo lectura y no puede modificarse.
7. **Generacion automatica del espejo**: Al guardar exitosamente una Colocacion/Inhibicion, el sistema crea automaticamente la fila espejo de Retiro/Habilitacion para que el usuario la complete.
