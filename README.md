# ⚽ Face Swap Posters App

App simples para criar pôsteres personalizados com face swap usando n8n + Nano Banana (Google Gemini AI).

## 🎯 O que faz

1. Usuário faz upload de uma foto do rosto
2. Backend (n8n) usa Nano Banana para fazer face swap em 2 pôsteres de referência
3. Retorna os 2 pôsteres personalizados com o rosto do usuário

## 🏗️ Arquitetura

- **Frontend**: Next.js 15 (React 19) - Deploy no Vercel
- **Backend**: n8n workflow - Rodando em `api.artur.digital`
- **AI**: Nano Banana (Google Gemini 2.0 Flash) para face swap

## 📋 Pré-requisitos

Antes de começar, você precisa:

### 1. Ativar o workflow no n8n

O workflow já foi criado! ID: `eqrwO7rG0b8SA9qO`

**Passos**:
1. Acesse: https://api.artur.digital/workflow/eqrwO7rG0b8SA9qO
2. Clique no botão **"Active"** no canto superior direito
3. Copie a **URL do Webhook** que aparecerá (algo como: `https://api.artur.digital/webhook/face-swap`)

### 2. Converter as imagens dos pôsteres para Base64

Você tem 2 imagens de referência (Ronaldo Portugal e Ronaldo Real Madrid). Precisa convertê-las para Base64:

**macOS/Linux**:
```bash
# Salve as imagens como poster1.jpg e poster2.jpg
base64 -i poster1.jpg > poster1.txt
base64 -i poster2.jpg > poster2.txt
```

**Ou use um serviço online**: https://www.base64-image.de/

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione:

```env
NEXT_PUBLIC_WEBHOOK_URL=https://api.artur.digital/webhook/face-swap

# Cole aqui o conteúdo dos arquivos poster1.txt e poster2.txt
NEXT_PUBLIC_POSTER1_BASE64=Cole_aqui_o_base64_do_poster1
NEXT_PUBLIC_POSTER2_BASE64=Cole_aqui_o_base64_do_poster2
```

## 🚀 Rodando Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📦 Deploy no Vercel

### Opção 1: Via CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir instruções no terminal
# Quando pedir, adicione as variáveis de ambiente:
# - NEXT_PUBLIC_WEBHOOK_URL
# - NEXT_PUBLIC_POSTER1_BASE64
# - NEXT_PUBLIC_POSTER2_BASE64
```

### Opção 2: Via Dashboard

1. Acesse: https://vercel.com
2. Click "Add New Project"
3. Importe este repositório (ou faça upload dos arquivos)
4. Configure as **Environment Variables**:
   - `NEXT_PUBLIC_WEBHOOK_URL`
   - `NEXT_PUBLIC_POSTER1_BASE64`
   - `NEXT_PUBLIC_POSTER2_BASE64`
5. Click "Deploy"

## 🔧 Como funciona

### Workflow n8n

```
Webhook (POST)
  → Recebe userPhoto + poster1Base64 + poster2Base64
  ↓
[Parallel Processing]
  ├─ HTTP Request → Gemini API (Poster 1) → Extract Base64
  └─ HTTP Request → Gemini API (Poster 2) → Extract Base64
  ↓
Merge Results
  ↓
Response → {success: true, poster1: "...", poster2: "..."}
```

### Frontend

1. **Upload**: Usuário seleciona foto
2. **Conversão**: Foto convertida para base64
3. **Request**: Envia para webhook do n8n junto com os base64 dos pôsteres
4. **Loading**: Mostra animação de carregamento
5. **Display**: Exibe os 2 pôsteres gerados

## 🐛 Troubleshooting

### Erro: "Falha ao gerar os pôsteres"

- Verifique se o workflow está **ativo** no n8n
- Confirme se a URL do webhook está correta
- Teste o webhook diretamente:

```bash
curl -X POST https://api.artur.digital/webhook/face-swap \
  -H "Content-Type: application/json" \
  -d '{"userPhoto": "test", "poster1Base64": "test", "poster2Base64": "test"}'
```

### Erro: "CORS"

- O n8n deve estar configurado para aceitar requests do domínio do Vercel
- Adicione o domínio nas configurações CORS do n8n

### Imagens não aparecem

- Verifique se os base64 dos pôsteres estão corretos
- Confirme que as variáveis de ambiente foram configuradas no Vercel
- Olhe o console do browser para ver erros

## 📝 Notas

- O Gemini 2.0 Flash tem limites de taxa (rate limits)
- Imagens grandes podem demorar mais para processar
- O n8n workflow processa os 2 pôsteres em paralelo para maior velocidade

## 🎨 Customização

Para adicionar mais pôsteres:

1. Adicione mais nodes HTTP Request no workflow n8n
2. Crie novas variáveis de ambiente `NEXT_PUBLIC_POSTER3_BASE64`, etc.
3. Atualize o frontend para mostrar mais cards

## 📄 Licença

MIT
