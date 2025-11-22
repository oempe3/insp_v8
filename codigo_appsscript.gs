/************************************************************
 * CONFIGURAÇÕES – AJUSTE OS IDs AQUI
 ************************************************************/

// ⚠️ ATUALIZE ESTES IDs com os IDs reais do seu projeto
const SHEET_ID_EXTERNA    = '1Lu0e3pDrWqFfhWGAAXCSzjq329hoh_WIiTX9kLfgY_A';         // ID da Planilha
const SHEET_NAME_EXTERNA  = 'Externa';

const DOC_TEMPLATE_EXTERNA_ID = '1u8o2xNHrRG13AxTPxBS1erJz-WNAsK6JBNKHexiDLRE';  // ID do Modelo do Google Docs

const PASTA_IMAGENS_EXTERNA_ID    = '13xxxZzAMB-MRgDVUIocRDy6Zw7JL9jib'; // ID da Pasta para Imagens
const PASTA_RELATORIOS_EXTERNA_ID = '1B4zO__XdkMxCJ_MEm2t2v-5BT1Dtp3E-'; // ID da Pasta para Relatórios

/************************************************************
 * FUNÇÕES AUXILIARES (BASE64 E DRIVE)
 ************************************************************/

/**
 * Converte uma string Base64 (data:image/...) em um Blob e salva no Google Drive.
 * @param {string} base64Data String Base64 completa (ex: data:image/png;base64,...)
 * @param {string} fieldName Nome do campo (para nomear o arquivo)
 * @param {GoogleAppsScript.Drive.Folder} folder Pasta de destino no Drive
 * @returns {string|null} ID do arquivo salvo ou null em caso de erro/string inválida.
 */
function saveBase64Image(base64Data, fieldName, folder) {
  if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:image')) {
    return null;
  }

  try {
    // 1. Extrair o tipo MIME e os dados Base64
    const parts = base64Data.split(';base64,');
    if (parts.length !== 2) {
      Logger.log('Erro: Formato Base64 inválido para ' + fieldName);
      return null;
    }
    const mimeType = parts[0].split(':')[1];
    const base64Content = parts[1];

    // 2. Converter Base64 para Blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Content),
      mimeType,
      `${fieldName}_${new Date().getTime()}.${mimeType.split('/')[1]}`
    );

    // 3. Salvar o Blob no Drive
    const file = folder ? folder.createFile(blob) : DriveApp.createFile(blob);
    
    Logger.log(`Arquivo ${fieldName} salvo no Drive. ID: ${file.getId()}`);
    return file.getId();

  } catch (e) {
    Logger.log(`Erro ao salvar Base64 para ${fieldName}: ${e.message}`);
    return null;
  }
}

/**
 * Verifica se o campo é um campo de imagem (assinatura ou imagem_X).
 * @param {string} fieldName Nome do campo.
 * @returns {boolean}
 */
function isImageField(fieldName) {
  if (!fieldName) return false;
  const f = String(fieldName).toLowerCase();
  if (f === 'assinatura') return true;
  // Assumindo que os campos de imagem de anomalia seguem o padrão 'imagem_1', 'imagem_2', etc.
  if (/^imagem_\d+$/i.test(f)) return true;
  return false;
}

/************************************************************
 * FUNÇÕES COMUNS (DO PROJETO ORIGINAL)
 ************************************************************/

function formatFieldForDoc(key, value) {
  if (value == null || value === '') return '';

  // Date nativo
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    const tz = Session.getScriptTimeZone() || 'America/Recife';
    const k  = key.toLowerCase();
    if (k.indexOf('data') !== -1) return Utilities.formatDate(value, tz, 'dd/MM/yyyy');
    if (k.indexOf('hora') !== -1) return Utilities.formatDate(value, tz, 'HH:mm');
    return Utilities.formatDate(value, tz, 'dd/MM/yyyy HH:mm');
  }

  // String que parece data/hora
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!isNaN(d)) {
      const tz = Session.getScriptTimeZone() || 'America/Recife';
      const k  = key.toLowerCase();
      if (k.indexOf('data') !== -1) return Utilities.formatDate(d, tz, 'dd/MM/yyyy');
      if (k.indexOf('hora') !== -1) return Utilities.formatDate(d, tz, 'HH:mm');
      return Utilities.formatDate(d, tz, 'dd/MM/yyyy HH:mm');
    }
  }

  return String(value);
}

// 🔴 MNT / 🟡 ST-BY / 🟢 OPE  (se vazio → "-")
function statusToIcon(status) {
  const raw = String(status || '').trim();
  if (!raw) return '-';

  const s = raw.toUpperCase();
  switch (s) {
    case 'OPE':
      return '🟢 OPE';
    case 'ST-BY':
    case 'STBY':
    case 'ST BY':
      return '🟡 ST-BY';
    case 'MNT':
    case 'MANU':
    case 'MANUT':
    case 'MANUTENÇÃO':
      return '🔴 MNT';
    default:
      return raw;
  }
}

// Inserir imagem em placeholder do Docs
function insertImage(body, placeholder, fileId, width) {
  try {
    if (!fileId) return;

    const range = body.findText(placeholder);
    if (!range) return;

    const imgFile = DriveApp.getFileById(String(fileId));
    const blob    = imgFile.getBlob();

    const element = range.getElement();
    const text    = element.asText();
    const start   = range.getStartOffset();
    const end     = range.getEndOffsetInclusive();
    text.deleteText(start, end);

    const parent    = element.getParent();
    const idx       = parent.getChildIndex(element);
    const inlineImg = parent.insertInlineImage(idx + 1, blob);

    if (width) {
      const w = inlineImg.getWidth();
      const h = inlineImg.getHeight();
      inlineImg.setWidth(width);
      inlineImg.setHeight(Math.round(h * (width / w)));
    }
  } catch (err) {
    Logger.log('Erro insertImage ' + placeholder + ': ' + err);
  }
}

// Versão local de getFolderSafe
function getFolderSafe(folderId) {
  if (!folderId) return null;
  try {
    return DriveApp.getFolderById(folderId);
  } catch (e) {
    Logger.log('Erro ao acessar pasta ' + folderId + ': ' + e);
    return null;
  }
}


/************************************************************
 * doPost – FORMULÁRIO EXTERNO (CORRIGIDO)
 ************************************************************/

function doPost(e) {
  try {
    // 1. CRÍTICO: Receber o JSON do Frontend
    if (!e || !e.postData || e.postData.type !== 'application/json') {
      throw new Error('Nenhum dado JSON válido recebido. Verifique o Content-Type do fetch.');
    }
    
    // O Frontend envia um objeto com as janelas (ex: { 'dados-iniciais': { ... }, 'anomalias': { ... } })
    const rawData = JSON.parse(e.postData.contents);
    
    // Consolidar todos os campos em um único objeto (flat map)
    const params = {};
    for (const windowId in rawData) {
        if (windowId !== 'previous') {
            Object.assign(params, rawData[windowId]);
        }
    }

    if (Object.keys(params).length === 0) {
        throw new Error('Nenhum parâmetro de formulário encontrado no JSON.');
    }

    const ss     = SpreadsheetApp.openById(SHEET_ID_EXTERNA);
    const sheet  = ss.getSheetByName(SHEET_NAME_EXTERNA);
    if (!sheet) throw new Error('Aba "Externa" não encontrada.');

    const pastaImagens = getFolderSafe(PASTA_IMAGENS_EXTERNA_ID);
    const fileIds = {};

    // 2. CRÍTICO: Processar Base64 e salvar no Drive
    Object.keys(params).forEach(fieldName => {
      const value = params[fieldName];
      
      if (isImageField(fieldName) && typeof value === 'string' && value.startsWith('data:image')) {
        // Se for um campo de imagem e o valor for uma string Base64, salva no Drive
        const fileId = saveBase64Image(value, fieldName, pastaImagens);
        if (fileId) {
          fileIds[fieldName] = fileId;
        } else {
          // Se falhar, registra a falha na planilha (opcional, mas útil para debug)
          fileIds[fieldName] = 'ERRO_UPLOAD_BASE64';
        }
      } else {
        // Para campos normais (texto, número, etc.), o valor é o próprio parâmetro
        fileIds[fieldName] = value;
      }
    });

    // 3. Salvar na Planilha
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Mapeia os cabeçalhos da planilha para os valores recebidos (priorizando IDs de arquivo)
    const row = headers.map(h => fileIds[h] || '');
    sheet.appendRow(row);

    const lastRow = sheet.getLastRow();
    generateAndSendExternal(lastRow, ss);

    return ContentService.createTextOutput('ok')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    Logger.log('doPost (externa) erro: ' + err);
    return ContentService.createTextOutput('Erro: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}


/************************************************************
 * GERAÇÃO RELATÓRIO EXTERNO (DO PROJETO ORIGINAL)
 ************************************************************/

function generateAndSendExternal(rowIndex, ss) {
  try {
    const sheet = ss.getSheetByName(SHEET_NAME_EXTERNA);
    if (!sheet) throw new Error('Aba "Externa" não encontrada.');

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const values  = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];

    const rowData = {};
    headers.forEach((h, i) => rowData[h] = values[i]);

    const data       = rowData['data']       || '';
    const operador   = rowData['operador']   || '';
    const supervisor = rowData['supervisor'] || '';
    const turma      = rowData['turma']      || '';
    if (!data || !operador) throw new Error('Campos "data" e "operador" obrigatórios (externa).');

    /*************** ÍCONES E ALIAS ****************/

    // Ícones automáticos para *_status (bomba1_status, pbb901_1_status, pac901_1_status, etc.)
    Object.keys(rowData).forEach(k => {
      if (k.toLowerCase().endsWith('_status')) {
        const iconKey = k + '_icon';
        if (!(iconKey in rowData)) {
          rowData[iconKey] = statusToIcon(rowData[k]);
        }
      }
    });

    // Anomalias: planilha usa descricao_1/local_1/imagem_1...
    // modelo pode usar descricao_anomalia1 / local_anomalia1
    for (let i = 1; i <= 6; i++) {
      const desc = rowData['descricao_' + i] || '';
      const loc  = rowData['local_' + i]     || '';
      rowData['descricao_anomalia' + i] = desc;
      rowData['local_anomalia'    + i] = loc;
    }

    /*************** MONTA DOC ****************/

    const modelFile = DriveApp.getFileById(DOC_TEMPLATE_EXTERNA_ID);
    const nomeDoc   = `Inspeção Externa - ${data} - ${operador}`;
    const copia     = modelFile.makeCopy(nomeDoc);
    const doc       = DocumentApp.openById(copia.getId());
    const body      = doc.getBody();

    // Substituição de texto
    Object.keys(rowData).forEach(k => {
      if (isImageField(k)) return; // Usa a nova função isImageField
      const placeholder = '{{' + k + '}}';
      const textValue   = formatFieldForDoc(k, rowData[k]);
      body.replaceText(placeholder, textValue);
    });

    // Assinatura
    insertImage(body, '{{assinatura}}', rowData['assinatura'], 200);

    // Fotos de anomalia – cobrimos 2 padrões:
    // {{imagem_i}} e {{foto_anomaliai}}
    for (let i = 1; i <= 6; i++) {
      const fileId = rowData['imagem_' + i];
      insertImage(body, '{{imagem_' + i + '}}',       fileId, 350);
      insertImage(body, '{{foto_anomalia' + i + '}}', fileId, 350);
    }

    doc.saveAndClose();

    // PDF
    const pdfBlob = copia.getAs('application/pdf').setName(nomeDoc + '.pdf');
    const pastaRel = getFolderSafe(PASTA_RELATORIOS_EXTERNA_ID);
    if (pastaRel) pastaRel.createFile(pdfBlob); else DriveApp.createFile(pdfBlob);

    // Destinatários (aba Destinatario)
    let emails = [];
    const destSheet = ss.getSheetByName('Destinatario');
    if (destSheet) {
      emails = destSheet.getRange(1, 1, destSheet.getLastRow(), 1).getValues()
        .map(r => r[0])
        .filter(v => v && String(v).indexOf('@') > -1);
    }

    const to = 'oem.pe3@gmail.com';
    const cc = emails.join(',');

    const subject = `[INSP-UTPT] – Inspeção externa – ${turma ? 'Turma ' + turma + ' – ' : ''}Operador ${operador}`;
    const corpo   = 'Prezados,\n\n' +
      'Segue em anexo o relatório de inspeção EXTERNA do dia ' + formatFieldForDoc('data', data) + '.\n\n' +
      'Operador: ' + operador +
      (supervisor ? '\nSupervisor: ' + supervisor : '') +
      (turma ? '\nTurma: ' + turma : '') +
      '\n\nAtenciosamente,\nO&M – UTE Pernambuco III';

    GmailApp.sendEmail(to, subject, corpo, {
      cc: cc || undefined,
      attachments: [pdfBlob],
      name: 'UTE Pernambuco III'
    });

    copia.setTrashed(true);

  } catch (err) {
    Logger.log('generateAndSendExternal erro: ' + err);
  }
}

// Função para deploy (opcional, mas útil para o Apps Script)
function doGet() {
  return HtmlService.createHtmlOutput('OK. O WebApp está ativo e aguardando requisições POST.');
}
