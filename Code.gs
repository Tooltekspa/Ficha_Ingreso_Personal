/**
 * TOOLTEK — Ficha de Ingreso de Personal (Hoja 1)
 * Backend Google Apps Script: recibe el POST del formulario HTML
 * y agrega una fila a la hoja "Respuestas" de la planilla vinculada.
 *
 * INSTALACIÓN:
 * 1. Crea una Google Sheet nueva (ej: "Ficha Ingreso Personal - Respuestas").
 * 2. Extensiones > Apps Script.
 * 3. Pega este archivo completo (reemplaza el contenido de Code.gs).
 * 4. Ejecuta una vez la función `setup` desde el editor (menú Ejecutar) para
 *    crear la hoja "Respuestas" con encabezados. Acepta los permisos solicitados.
 * 5. Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo (tu cuenta institucional TOOLTEK)
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Copia la URL de la Web App resultante y pégala en index.html,
 *    reemplazando SCRIPT_URL = "https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec".
 * 7. Cada vez que modifiques este código, debes crear una NUEVA implementación
 *    (o gestionar implementaciones > editar) para que los cambios tomen efecto
 *    en la URL ya publicada.
 */

const SHEET_NAME = 'Respuestas';

// Orden de columnas en la planilla — debe coincidir con los "name" de los inputs del HTML.
const FIELDS = [
  'fecha_envio',
  'nombres', 'apellidos', 'rut', 'fecha_nacimiento', 'nacionalidad', 'estado_civil',
  'domicilio', 'comuna', 'ciudad', 'telefono', 'celular', 'correo', 'area_trabajo',
  'tiene_hijos', 'hijos_detalle',
  'afp', 'fecha_afiliacion_afp', 'sistema_salud', 'isapre_plan', 'valor_plan_salud',
  'enfermedad_base', 'alergia_medicamento', 'medicamento_diario',
  'contacto_emergencia', 'telefono_emergencia',
  'banco', 'sucursal', 'tipo_cuenta', 'numero_cuenta',
  'form_titulo_nombre', 'form_titulo_inst', 'form_titulo_anio',
  'form_grado_nombre', 'form_grado_inst', 'form_grado_anio',
  'form_posttitulo_nombre', 'form_posttitulo_inst', 'form_posttitulo_anio',
  'form_diplomado_nombre', 'form_diplomado_inst', 'form_diplomado_anio',
  'declaracion', 'firma'
];

const FIRMAS_FOLDER_NAME = 'Firmas - Ficha Ingreso Personal';

function getFirmasFolder() {
  const folders = DriveApp.getFoldersByName(FIRMAS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FIRMAS_FOLDER_NAME);
}

function saveSignature(base64Image, nombre, rut) {
  if (!base64Image) return '';
  const match = base64Image.match(/^data:image\/(png|jpeg);base64,(.*)$/);
  if (!match) return '';
  const ext = match[1] === 'jpeg' ? 'jpg' : 'png';
  const bytes = Utilities.base64Decode(match[2]);
  const blob = Utilities.newBlob(bytes, 'image/' + match[1], 'firma.' + ext);
  const folder = getFirmasFolder();
  const safeName = (nombre || 'sin_nombre') + '_' + (rut || Date.now());
  const file = folder.createFile(blob).setName('Firma_' + safeName.replace(/[^a-zA-Z0-9_-]/g, '_') + '.' + ext);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  sheet.clear();
  sheet.getRange(1, 1, 1, FIELDS.length).setValues([FIELDS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold').setBackground('#25638F').setFontColor('#FFFFFF');
  sheet.autoResizeColumns(1, FIELDS.length);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    data.firma = saveSignature(data.firma_base64, data.nombres, data.rut);

    const row = FIELDS.map(field => data[field] !== undefined ? data[field] : '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Ficha de Ingreso de Personal — endpoint activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
