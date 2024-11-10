const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// Middleware para tratar as requisições CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Proxy para o endpoint da API
app.use('/api', createProxyMiddleware({
    target: 'http://mtilinkapi.matosti.com.br',  // URL da API original
    changeOrigin: true,  // Altera a origem da requisição para o servidor de destino
    pathRewrite: {
        '^/api': '',  // Remove o prefixo "/api" na URL
    },
    onProxyReq: (proxyReq, req, res) => {
        // Passa o cabeçalho Authorization da requisição original para o destino
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    }
}));

// Inicia o servidor
app.listen(port, () => {
    console.log(`Proxy rodando na porta ${port}`);
});
