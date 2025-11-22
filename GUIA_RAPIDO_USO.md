# 🚀 Guia Rápido de Uso - Sistema de Inspeção

## 📱 Como Usar o Formulário Externo

### Passo 1: Abrir o Formulário
- Abra o arquivo `externo.html` no navegador
- Você verá 8 cards com ícones representando diferentes áreas

### Passo 2: Preencher os Dados

#### 2.1 Dados Iniciais (Obrigatório)
1. Clique no card "📋 Dados Iniciais"
2. Preencha:
   - Nome do Inspetor *
   - Data da Inspeção *
   - Hora da Inspeção *
   - Turno (Selecione: Manhã, Tarde ou Noite)
3. Clique em "SALVAR"

#### 2.2 Bomba dos Poços
1. Clique no card "💧 Bomba dos Poços"
2. Selecione o status de cada bomba:
   - **OPE** = Operando (🟢 Verde)
   - **ST-BY** = Stand-by (🟡 Amarelo)
   - **MNT** = Manutenção (🔴 Vermelho)
3. Preencha os hidrômetros (leitura em m³)
4. Clique em "SALVAR"

#### 2.3 Container de Combate a Incêndio
1. Clique no card "🔥 Container de Combate a Incêndio"
2. Selecione status das 3 bombas (Jockey, Sprinkler, Diesel)
3. Preencha:
   - Pressão da linha
   - Níveis de óleo
   - Tensão das baterias
   - Níveis de água e combustível
   - Horímetro
4. Clique em "SALVAR"

#### 2.4 Estação de Tratamento de Água (ETA)
1. Clique no card "🧪 Estação de Tratamento de Água (ETA)"
2. Selecione status do sistema
3. Preencha níveis dos tanques (use o slider)
4. Clique em "SALVAR"

#### 2.5 Área de Tancagem
1. Clique no card "🛢️ Área de Tancagem"
2. Preencha níveis dos tanques:
   - Tanque HFO 01, 02, 03
   - Tanque Óleo Diesel 01, 02
3. Use os sliders para ajustar percentuais
4. Clique em "SALVAR"

#### 2.6 Separadoras de HFO
1. Clique no card "⚙️ Separadoras de HFO"
2. Selecione status das separadoras 1 e 2
3. Clique em "SALVAR"

#### 2.7 Bombas de Transferência O.C.
1. Clique no card "🔄 Bombas de Transferência O.C."
2. Selecione status das bombas 1 e 2
3. Clique em "SALVAR"

#### 2.8 Anormalidades
1. Clique no card "⚠️ Anormalidades"
2. Descreva qualquer anormalidade observada
3. Clique em "SALVAR"

### Passo 3: Enviar o Relatório

1. Após preencher todos os dados necessários
2. Clique no botão verde "📧 ENVIAR RELATÓRIO COMPLETO"
3. Aguarde o processamento (aparecerá um spinner)
4. Você receberá uma confirmação quando concluído

---

## 🎨 Entendendo os Sinaleiros

Os sinaleiros funcionam como um semáforo, indicando o status de cada equipamento:

### 🟢 Verde (OPE)
- **Significado:** Equipamento Operando
- **Quando usar:** Equipamento funcionando normalmente
- **Exemplo:** Bomba ligada e operacional

### 🟡 Amarelo (ST-BY)
- **Significado:** Stand-by (Em espera)
- **Quando usar:** Equipamento pronto mas não operando
- **Exemplo:** Bomba reserva aguardando acionamento

### 🔴 Vermelho (MNT)
- **Significado:** Manutenção
- **Quando usar:** Equipamento em manutenção ou com falha
- **Exemplo:** Bomba desligada para reparo

### ⚪ Cinza (Vazio)
- **Significado:** Status não selecionado
- **Quando usar:** Aparece automaticamente antes de selecionar

---

## 💡 Dicas Importantes

### ✅ Boas Práticas

1. **Preencha os Dados Iniciais primeiro**
   - São obrigatórios para gerar o relatório

2. **Salve cada janela após preencher**
   - Os dados são salvos automaticamente no navegador
   - Mesmo fechando, os dados permanecem

3. **Verifique os sinaleiros**
   - Certifique-se que a cor corresponde ao status real
   - Verde = funcionando, Amarelo = espera, Vermelho = problema

4. **Use os sliders para percentuais**
   - Mais rápido e preciso que digitar
   - Mostra o valor em tempo real

5. **Descreva anormalidades com detalhes**
   - Inclua localização, horário e gravidade
   - Facilita a tomada de decisão

### ⚠️ Atenção

- **Campos com asterisco (*)** são obrigatórios
- **Não feche o navegador** durante o envio do relatório
- **Mantenha internet ativa** para enviar dados
- **Verifique os dados** antes de enviar (não há como editar depois)

### 🔄 Limpar Dados

Para começar uma nova inspeção:
1. Abra o Console do navegador (F12)
2. Digite: `localStorage.clear()`
3. Pressione Enter
4. Recarregue a página (F5)

---

## 📧 Destinatários de Email

### Como Gerenciar

1. Abra `destinatario.html`
2. Adicione emails dos destinatários
3. Salve a lista
4. Os relatórios serão enviados automaticamente para todos

### Formato de Email

- **Assunto:** Relatório de Inspeção Externa - [Data]
- **Anexos:** PDF do relatório
- **Corpo:** Resumo com dados principais

---

## 🆘 Solução de Problemas

### Problema: Sinaleiros não aparecem
**Solução:** Recarregue a página (Ctrl + F5)

### Problema: Dados não salvam
**Solução:** Verifique se o localStorage está habilitado no navegador

### Problema: Erro ao enviar relatório
**Solução:** 
1. Verifique sua conexão com internet
2. Confirme que preencheu os Dados Iniciais
3. Tente novamente em alguns minutos

### Problema: Página não carrega
**Solução:**
1. Use um navegador moderno (Chrome, Firefox, Edge)
2. Desabilite extensões que bloqueiam JavaScript
3. Limpe o cache do navegador

---

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Google Chrome (recomendado)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari (iOS/macOS)
- ⚠️ Internet Explorer (não recomendado)

### Dispositivos
- ✅ Desktop/Notebook
- ✅ Tablet
- ✅ Smartphone
- ✅ Modo retrato e paisagem

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte o **RELATORIO_FINAL_COMPLETO.md**
2. Verifique o **README_NOVO.md**
3. Entre em contato com o suporte técnico

---

**Sistema de Inspeção v5.1** | Atualizado em 16/11/2025
