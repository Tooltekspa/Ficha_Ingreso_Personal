# Ficha de Ingreso de Personal — TOOLTEK

Formulario web (Hoja 1 — a completar por el postulante/trabajador nuevo).
La Hoja 2 (Gerencia/RRHH) se sigue completando manualmente y **no** forma
parte de este formulario digital.

## Contenido

```
index.html   → formulario (frontend, único archivo HTML/CSS/JS)
assets/      → logo TOOLTEK
Code.gs      → backend Google Apps Script (recibe el POST y escribe en Sheets)
```

## 1. Backend — Google Apps Script

1. Crea una Google Sheet nueva, por ejemplo **"Ficha Ingreso Personal — Respuestas"**.
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido de `Code.gs` que viene por defecto y pega el archivo
   `Code.gs` de esta carpeta.
4. En el editor, selecciona la función `setup` en el desplegable y pulsa
   **Ejecutar** una vez. Esto crea la hoja "Respuestas" con los encabezados
   y te pedirá autorizar permisos (usa tu cuenta institucional TOOLTEK).
5. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo** (tu cuenta)
   - Quién tiene acceso: **Cualquier usuario**
6. Copia la URL que termina en `/exec`.

## 2. Frontend — conectar el formulario

1. Abre `index.html`.
2. Busca la línea:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec";
   ```
3. Reemplázala por la URL copiada en el paso anterior.

## 3. Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio en la organización `Tooltekspa`
   (o el que uses para tus otras herramientas internas), por ejemplo
   `Tooltekspa/Ficha_Ingreso_Personal`.
2. En el repositorio: **Settings → Pages → Deploy from a branch**,
   rama `main`, carpeta `/ (root)`.
3. La URL pública quedará como
   `https://tooltekspa.github.io/Ficha_Ingreso_Personal/`.

## 4. Firma digital

El formulario incluye un recuadro de firma (canvas táctil, funciona con el
dedo en celular o con el mouse en computador). Al enviar la ficha:

- La firma se convierte a imagen PNG en el navegador.
- `Code.gs` la guarda como archivo en una carpeta de Drive llamada
  **"Firmas - Ficha Ingreso Personal"** (se crea automáticamente la primera
  vez) y agrega el link de esa imagen en la columna `firma` de la planilla.
- La cuenta que ejecuta el Apps Script (paso 1.4 "Ejecutar como: Yo") debe
  tener permiso para crear carpetas/archivos en Drive — usa la cuenta
  institucional de TOOLTEK.

## 5. Mantenimiento

- Si agregas o quitas campos en `index.html` (atributo `name` de cada
  input), agrega/quita el mismo nombre en el arreglo `FIELDS` de `Code.gs`
  para que la columna aparezca en la planilla.
- Cada vez que edites `Code.gs`, debes crear o actualizar la implementación
  (**Implementar → Gestionar implementaciones → Editar**) para que los
  cambios se reflejen en la URL ya publicada.
- La Hoja 2 (datos de RRHH/Gerencia: N° funcionario, centro de costo,
  contrato, sueldo, observaciones, firma) se sigue llenando manualmente
  desde la ficha en Word/PDF — no está incluida en este formulario web.
