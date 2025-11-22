# 🔍 Problemas Identificados no Formulário Externo

## Data da Análise: 16/11/2025

---

## ✅ O QUE FUNCIONA CORRETAMENTE

### 1. Formulário Interno (`interno.html` + `data_structure_interno.js`)
- ✅ Estrutura de dados bem definida
- ✅ Campos com sinaleiros visuais (status com cores)
- ✅ Integração com Google Apps Script funcional
- ✅ Envio para Google Sheets, Docs e Email
- ✅ Layout moderno com janelas/cards
- ✅ Validações em tempo real
- ✅ Persistência de dados no localStorage

### 2. Página de Destinatários (`destinatario.html`)
- ✅ Gerenciamento de emails funcionando
- ✅ 4 destinatários cadastrados na planilha

---

## ❌ PROBLEMAS CRÍTICOS NO FORMULÁRIO EXTERNO

### **PROBLEMA 1: Estrutura de Dados Inadequada**

**Situação Atual:**
- O arquivo `data_structure.js` (usado pelo externo) possui **350 linhas**
- Contém dados de **INSPEÇÃO INTERNA** (motores, geradores, separadoras, etc.)
- O formulário externo está carregando estrutura errada

**Evidência:**
```javascript
// data_structure.js contém seções de INSPEÇÃO INTERNA:
'separadoras-hfo': {
    title: 'Separadoras de HFO',
    icon: '⚙️',
    fields: [
        { name: 'pbb901_1_status', label: 'Status PBB901.1 (BJJ902)', type: 'status', options: ['OPE', 'ST-BY', 'MNT'] },
        // ... muitos outros campos técnicos internos
    ]
}
```

**O que deveria ter:**
- Estrutura simplificada para inspeção EXTERNA
- Campos alinhados com o template `inspecao_externa_template.docx`
- Apenas equipamentos visíveis externamente

---

### **PROBLEMA 2: Template Externo vs. Estrutura de Dados Desalinhados**

**Template Externo (inspecao_externa_template.docx) contém:**
1. Dados Iniciais ✅
2. Bomba dos Poços ✅
3. Container de Combate a Incêndio ✅
4. Estação de Tratamento de Água (ETA) ✅
5. Área de Tancagem ✅
6. Separadoras de HFO ✅
7. Bombas de Transferência O.C. ✅
8. Anormalidades (6 registros) ✅

**Planilha Externa (Inspecoes_UTE-PE3.xlsx - aba "Externa"):**
- **219 colunas** de dados
- Campos alinhados com o template externo
- Estrutura correta para receber os dados

**data_structure.js atual:**
- ❌ Contém dados de INSPEÇÃO INTERNA
- ❌ Não está alinhado com o template externo
- ❌ Não corresponde às 219 colunas da planilha

---

### **PROBLEMA 3: Sinaleiros Não Visíveis/Funcionais**

**O que o usuário relatou:**
> "Conforme outros chats o layout deve ser recuperado com os sinaleiros visíveis"

**Análise:**
- Os sinaleiros (indicadores tipo farol) existem no código CSS e JavaScript
- O campo `type: 'status'` gera os indicadores visuais
- **MAS** o formulário externo não está renderizando corretamente

**Sinaleiros esperados:**
- 🟢 Verde = OPE (Operando)
- 🟡 Amarelo = ST-BY (Stand-by)  
- 🔴 Vermelho = MNT (Manutenção)

**Código CSS existente (style.css):**
```css
.status-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
}

.status-indicator.ope { background-color: #28a745; }
.status-indicator.st-by { background-color: #ffc107; }
.status-indicator.mnt { background-color: #dc3545; }
```

---

### **PROBLEMA 4: Layout Não Moderno/Funcional**

**Situação:**
- O `externo.html` usa a mesma estrutura do `interno.html`
- Não há diferenciação visual entre interno e externo
- Layout deveria ser mais simples e direto para inspetores externos

---

## 📊 COMPARAÇÃO: INTERNO vs. EXTERNO

| Aspecto | Interno | Externo (Atual) | Externo (Esperado) |
|---------|---------|-----------------|-------------------|
| **Estrutura de dados** | `data_structure_interno.js` (131 linhas) | `data_structure.js` (350 linhas) ❌ | Novo arquivo alinhado com template |
| **Template Word** | `inspecao_interna_template.docx` | `inspecao_externa_template.docx` ✅ | Mesmo |
| **Planilha Excel** | Aba "Interna" (382 colunas) | Aba "Externa" (219 colunas) ✅ | Mesmo |
| **Sinaleiros** | Funcionam ✅ | Não funcionam ❌ | Devem funcionar |
| **Layout** | Moderno com janelas ✅ | Igual ao interno ❌ | Simplificado e moderno |
| **Integração Google** | Funciona ✅ | Não testada ❌ | Deve funcionar |

---

## 🎯 SOLUÇÃO NECESSÁRIA

### 1. **Criar Novo `data_structure.js` para Externo**

Baseado no template externo, criar estrutura com:

```javascript
const FORM_STRUCTURE = {
    'dados-iniciais': { /* ... */ },
    'bomba-pocos': { /* ... */ },
    'container-incendio': { /* ... */ },
    'eta': { /* ... */ },
    'tancagem': { /* ... */ },
    'separadoras-hfo': { /* 6 separadoras */ },
    'bombas-transferencia': { /* 5 bombas */ },
    'anormalidades': { /* 6 registros com foto */ }
};
```

### 2. **Garantir Sinaleiros Visíveis**

- Verificar renderização dos campos `type: 'status'`
- Garantir que os indicadores visuais apareçam
- Testar em mobile e desktop

### 3. **Layout Moderno e Funcional**

- Manter estrutura de janelas/cards
- Cores e ícones apropriados
- Responsivo para mobile
- Validações em tempo real

### 4. **Integração Completa**

- Google Sheets (aba "Externa")
- Google Docs (template externo)
- Email para destinatários
- Upload de fotos das anormalidades

---

## 📝 CAMPOS NECESSÁRIOS NO FORMULÁRIO EXTERNO

### Baseado no Template e Planilha:

1. **Dados Iniciais** (7 campos)
   - hora_inicial, hora_final, data, operador, supervisor, turma, assinatura

2. **Bomba dos Poços** (4 campos)
   - bomba1_status, bomba1_hidrometro, bomba2_status, bomba2_hidrometro

3. **Container Incêndio** (11 campos)
   - jockey_status, incendio_pressao, sprinkler_status, sprinkler_oleo, diesel_status, bateria01_tensao, bateria02_tensao, radiador_agua, oleo_lubrificante, oleo_combustivel, horimetro, diesel_oleo_cavalete

4. **ETA** (12 campos)
   - abrandado_status, abrandado_nivel, osmose_status, agua_tratada_pressao, ph_bruta, ph_tratada, hidrometro_bruta, hidrometro_tratada, soda_caustica, complexante_ferro, biocida, anti_incrustante

5. **Tancagem** (17 campos - Volume e Temperatura)
   - storage_hfo, buffer_hfo, day_hfo, lfo, agua_oleosa, borra, agua_bruta_incendio, agua_tratada, oleo_novo, oleo_usado, oleo_manutencao1, oleo_manutencao2

6. **Separadoras de HFO** (6 separadoras x 7 campos = 42 campos)
   - PBB901 #1, #2, #3
   - PBB902 #1, #2, #3
   - Cada uma: status, temp, vazao, frequencia, pressao_saida, nivel_oleo, horimetro

7. **Bombas de Transferência O.C.** (5 bombas x 1 campo = 5 campos)
   - PAC901-1, PAC901-2, PCA902, PCA903-1, PCA903-2
   - Cada uma: status

8. **Anormalidades** (6 anormalidades x 3 campos = 18 campos)
   - Anormalidade 1 a 6
   - Cada uma: descricao, local, foto

**TOTAL: ~116 campos principais + variações = 219 colunas na planilha** ✅

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Análise completa realizada
2. ⏳ Criar novo `data_structure.js` alinhado com template externo
3. ⏳ Implementar sinaleiros visíveis
4. ⏳ Aplicar layout moderno
5. ⏳ Testar integração completa
6. ⏳ Entregar projeto corrigido

---

**Status**: Problemas identificados com precisão. Pronto para correção.
