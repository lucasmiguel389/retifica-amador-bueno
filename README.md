# Retífica de Motores Amador Bueno — Site Completo

## Estrutura do Projeto

```
retifica-amador-bueno/
├── frontend/
│   ├── index.html      # Página principal
│   ├── style.css       # Estilos
│   └── script.js       # Interações e envio de formulário
├── backend/
│   ├── server.js       # Servidor Node.js + Express
│   └── contatos.json   # Gerado automaticamente ao receber contatos
├── package.json
└── README.md
```

---

## ✅ Como Rodar

### 1. Pré-requisito: Node.js instalado
Baixe em: https://nodejs.org (versão LTS recomendada)

### 2. Instale as dependências
Na pasta raiz do projeto, abra o terminal e rode:
```bash
npm install
```

### 3. Inicie o servidor
```bash
npm start
```

### 4. Acesse o site
Abra o navegador e acesse:
```
http://localhost:3000
```

---

## 🔧 Desenvolvimento (com auto-reload)
```bash
npm run dev
```

---

## 📬 Rotas da API

| Método | Rota              | Descrição                        |
|--------|-------------------|----------------------------------|
| POST   | /api/contato      | Recebe o formulário de contato   |
| GET    | /api/contatos     | Lista todos os contatos salvos   |
| DELETE | /api/contatos/:id | Remove um contato pelo ID        |

### Exemplo de body para POST /api/contato:
```json
{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com",
  "servico": "cabecote",
  "mensagem": "Preciso de orçamento para cabeçote."
}
```

---

## 📦 Tecnologias Usadas
- **Front-end:** HTML5, CSS3, JavaScript puro
- **Back-end:** Node.js, Express
- **Persistência:** JSON local (`contatos.json`)

---

## 💡 Para Produção
Para publicar o site online, recomenda-se:
- **Vercel / Render / Railway** para hospedar o Node.js
- Ou use um serviço como **Hostinger** com suporte a Node.js

Os contatos ficam salvos em `backend/contatos.json`. Para usar um banco de dados real, substitua as funções `lerContatos()` e `salvarContatos()` por chamadas ao banco (ex: MySQL, MongoDB).
