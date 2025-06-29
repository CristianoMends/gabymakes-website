<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Variaveis de ambiente

```properties
NODE_ENV=development
TZ='America/Sao_Paulo'
UPLOAD_STRATEGY=local #ou vercel
ALLOWED_ORIGINS=http://localhost:5173
BLOB_READ_WRITE_TOKEN=#token do vercel blob


JWT_SECRET=suaChaveSecretaMuitoForteELongaAqui
JWT_EXPIRATION_TIME=3600s 
GOOGLE_CLIENT_ID=#id do google para Oauth2
GOOGLE_CLIENT_SECRET=#chave secreta do google
GOOGLE_REDIRECT_URI=postmessage

#banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=qwe123
DB_NAME=gaby_makes_site_db
```

# Observações

- Documentação: A documentação está disponivel na porta ``/docs``
- Requisições: As requisições de `post` e `patch` devem conter `Bearer token` de usuários logados com role `admin`
