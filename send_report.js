/**
 * @fileoverview Funções críticas para conversão de Base64 e envio de dados ao Apps Script.
 * Este arquivo substitui a lógica de envio no script.js original.
 */

// URLs dos WebApps do Google Apps Script para envio dos relatórios.
// ⚠️ ATUALIZE ESTAS DUAS URLs após o novo deploy do seu Apps Script.
const SCRIPT_URL_INTERNA = 'SUA_URL_WEBAPP_INTERNA';
const SCRIPT_URL_EXTERNA = 'SUA_URL_WEBAPP_EXTERNA';

/**
 * Converte um objeto File ou Blob para uma string Base64.
 * @param {File|Blob} file Objeto File ou Blob.
 * @returns {Promise<string>} Promessa que resolve para a string Base64 (data:image/...).
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * 🚀 CORREÇÃO CRÍTICA AQUI: Envia o objeto de dados da inspeção para o script Apps Script correspondente.
 * Converte TODOS os campos de imagem (assinatura e uploads) para Base64 antes de enviar.
 * O Apps Script receberá um objeto JSON no corpo da requisição (e.postData.contents).
 * 
 * @param {string} formType Tipo de formulário ('interno' ou 'externo')
 * @param {Object} data Objeto contendo os dados de todas as janelas
 * @returns {Promise<Response>} Promessa que resolve para a resposta da requisição
 */
async function sendReportToScript(formType, data) {
    const url = formType === 'interno' ? SCRIPT_URL_INTERNA : SCRIPT_URL_EXTERNA;
    
    // 1. Clonar os dados para não modificar o objeto original
    const dataToSend = JSON.parse(JSON.stringify(data));
    
    // 2. Processar campos de imagem (assinatura e file)
    const allWindowFields = Object.values(FORM_STRUCTURE).flatMap(w => w.fields);
    
    for (const windowId in dataToSend) {
        if (windowId === 'previous') continue;
        const windowData = dataToSend[windowId];

        for (const key in windowData) {
            const value = windowData[key];
            const fieldConfig = allWindowFields.find(f => f.name === key);

            if (value && fieldConfig) {
                // Assinatura: Já está em Base64, mas vamos garantir que o formato seja mantido.
                if (fieldConfig.type === 'signature' && typeof value === 'string' && value.startsWith('data:image')) {
                    // O valor já é a string Base64, não precisa de conversão.
                    // Apenas garantir que o Apps Script o receba.
                    windowData[key] = value;
                } 
                
                // Inputs de Arquivo (type="file"): Estão armazenados em window.fileStorage
                else if (fieldConfig.type === 'file' && typeof value === 'string' && value.startsWith('FILE_SET')) {
                    const fileObj = window.fileStorage && window.fileStorage[key];
                    if (fileObj) {
                        try {
                            // Converte o objeto File para Base64
                            const base64String = await fileToBase64(fileObj);
                            windowData[key] = base64String;
                        } catch (e) {
                            console.error(`Erro ao converter arquivo ${key} para Base64: ${e}`);
                            windowData[key] = `ERRO_CONVERSAO_${e.message}`;
                        }
                    } else {
                        console.warn(`Tentou enviar arquivo ${key}, mas File não foi encontrado em fileStorage. O campo será enviado vazio.`);
                        windowData[key] = ''; // Envia vazio se o arquivo não for encontrado
                    }
                }
                // Outros campos (texto, número, etc.) são mantidos.
            }
        }
    }

    // 3. Realiza o POST com o objeto JSON no corpo
    return fetch(url, {
        method: 'POST',
        // CRÍTICO: Usar 'Content-Type: application/json' para enviar JSON
        headers: {
            'Content-Type': 'application/json',
        },
        // Envia o objeto de dados como JSON stringificado
        body: JSON.stringify(dataToSend),
    });
}

// Exportar as URLs para que o script.js possa usá-las
window.SCRIPT_URL_INTERNA = SCRIPT_URL_INTERNA;
window.SCRIPT_URL_EXTERNA = SCRIPT_URL_EXTERNA;
window.sendReportToScript = sendReportToScript;
window.fileToBase64 = fileToBase64;
