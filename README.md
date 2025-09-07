# API Gateway com Kong

Este projeto implementa um API Gateway usando Kong para gerenciar e rotear requisições para múltiplas APIs backend.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente       │    │   Kong Gateway  │    │   APIs Backend  │
│                 │    │                 │    │                 │
│  curl/browser   │───▶│  Port 8000      │───▶│  users-api      │
│                 │    │                 │    │  products-api   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estrutura do Projeto

```
api-gateway/
├── compose.yml          # Docker Compose com todos os serviços
├── kong.yml            # Configuração declarativa do Kong
├── products/           # API de produtos (Node.js)
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── users/              # API de usuários (Node.js)
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos

- Docker
- Docker Compose

### Iniciar o Ambiente

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd api-gateway

# Iniciar todos os serviços
docker-compose up -d

# Verificar status dos containers
docker-compose ps
```

### Verificar Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs específicos do Kong
docker-compose logs -f kong-cp

# Logs da API de usuários
docker-compose logs -f users-api
```

## 🔧 Configuração do Kong

O Kong está configurado em modo **DB-less** (declarativo) usando o arquivo `kong.yml` na raiz do projeto.

### Serviços Configurados

| Serviço        | URL Interna                   | Rota Kong       | Descrição                   |
| -------------- | ----------------------------- | --------------- | --------------------------- |
| `users`        | `http://users-api:3002/users` | `/users`        | API de usuários             |
| `users-api`    | `http://users-api:3002`       | `/users-api`    | API alternativa de usuários |
| `products-api` | `http://products-api:3001`    | `/products-api` | API de produtos             |

### Autenticação

- **Tipo**: Basic Auth
- **Usuário**: `admin`
- **Senha**: `admin123`
- **Aplicado em**: Serviço `users`

### Rate Limiting

- **Limite**: 1 requisição por minuto
- **Aplicado em**: Serviço `users`
- **Política**: Local (sem Redis)

## 🌐 Endpoints Disponíveis

### Kong Gateway

- **Proxy HTTP**: `http://localhost:8000`
- **Proxy HTTPS**: `https://localhost:8443`
- **Admin API**: `http://localhost:8001`
- **Kong Manager**: `http://localhost:8002`

### APIs Backend (através do Kong)

#### API de Usuários (com autenticação)

```bash
# Listar usuários (requer autenticação)
curl -u admin:admin123 http://localhost:8000/users

# Usando header Authorization
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:8000/users
```

#### API de Usuários (alternativa)

```bash
# Acesso direto (sem autenticação)
curl http://localhost:8000/users-api/users
```

#### API de Produtos

```bash
# Listar produtos (sem autenticação)
curl http://localhost:8000/products-api/products
```

## 🔍 Testando o Gateway

### Testar Rate Limiting

```bash
# Fazer múltiplas requisições rapidamente
for i in {1..5}; do
  curl -u admin:admin123 http://localhost:8000/users
  echo "Requisição $i"
done
```

## 🛠️ Gerenciamento

### Kong Manager (Interface Web)

Acesse: `http://localhost:8002`

## 🔧 Modificando Configurações

### Adicionar Novo Serviço

1. Edite o arquivo `kong.yml`
2. Adicione o serviço na seção `services`
3. Reinicie o Kong:

```bash
docker-compose restart kong-cp
```

### Exemplo de Novo Serviço

```yaml
services:
  - name: novo-servico
    url: http://novo-servico:3003
    routes:
      - name: nova-rota
        paths:
          - /nova-rota
        strip_path: true
```

## 🐳 Docker Compose

### Serviços

- **kong-cp**: Kong Gateway (Control Plane)
- **users-api**: API de usuários
- **products-api**: API de produtos

### Rede

Todos os serviços estão na rede `kong-ee-net` para comunicação interna.

### Volumes

- `./kong.yml:/kong/declarative/kong.yml:ro` - Configuração do Kong

## 🚨 Troubleshooting

### Kong não inicia

```bash
# Verificar logs
docker-compose logs kong-cp

# Verificar sintaxe do kong.yml
docker run --rm -v $(pwd)/kong.yml:/kong.yml kong/kong-gateway:3.11.0.2 kong config -c /kong.yml
```

### APIs não respondem

```bash
# Verificar se as APIs estão rodando
docker-compose ps

# Testar conectividade interna
docker-compose exec kong-cp ping users-api
docker-compose exec kong-cp ping products-api
```

## 👨‍💻 Autor

**Douglas Vinicius Caldas Bonin**

- GitHub: [@dviniciusbonin](https://github.com/dviniciusbonin)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
