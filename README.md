# 💄 GabyMakes - E-commerce de Cosméticos

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Mercado_Pago-009EE3?style=for-the-badge&logo=mercado-pago&logoColor=white" alt="Mercado Pago"/>
  <img src="https://img.shields.io/badge/Google-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Auth"/>
</p>

<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/52f2ae22-b06e-4bf4-b7f8-e06ca44eb751" />


<p align="center">
  <em>Website moderno e responsivo para uma loja de cosméticos, desenvolvido com foco em proporcionar uma experiência de navegação agradável, intuitiva e eficiente.</em>
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=mGq-ixsFJSQ">
    <img src="https://img.shields.io/badge/Assistir_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Assista a Demo no YouTube"/>
  </a>
    
  <a href="https://github.com/CristianoMends/gabymakes-servidor">
    <img src="https://img.shields.io/badge/Repositório_Backend-181717?style=for-the-badge&logo=github&logoColor=white" alt="Repositório Backend"/>
  </a>
</p>

## 📜 Sobre o Projeto

**GabyMakes WebSite** é uma plataforma de e-commerce completa, criada para a venda de cosméticos e acessórios de beleza. O projeto foi construído do zero utilizando tecnologias modernas, com o objetivo de oferecer uma vitrine online atrativa, um processo de compra simplificado e uma área administrativa robusta para gerenciamento da loja.

A aplicação conta com autenticação de usuários (tradicional e social com Google), catálogo de produtos, carrinho de compras, checkout integrado com o Mercado Pago e um painel de controle para o administrador.

---

## ✨ Funcionalidades Principais

* **Vitrine de Produtos:**
    * Página inicial com banners e seções de produtos em destaque.
    * Catálogo completo com sistema de busca e filtros por categoria, marca e faixa de preço.
    * Página de detalhes para cada produto com zoom na imagem e produtos relacionados.
* **Carrinho e Checkout:**
    * Carrinho de compras persistente para usuários logados e não logados (usando `localStorage`).
    * Processo de "Compre agora" para compras rápidas de um único item.
    * Integração completa com a API do **Mercado Pago** para um checkout seguro e transparente.
* **Área do Cliente:**
    * Autenticação via E-mail/Senha e **Login Social com Google**.
    * Página de perfil onde o usuário pode visualizar seus dados e gerenciar endereços de entrega.
* **Painel Administrativo:**
    * **Dashboard** com métricas de vendas, produtos mais vendidos e categorias populares.
    * CRUD completo para **Produtos**, incluindo gerenciamento de estoque, preço e imagens.
    * Gerenciamento de seções de **Destaques** para a página inicial.
    * Controle de **Banners** promocionais.
    * Visualização e gerenciamento de **Pedidos**.

---

## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * **[React](https://react.dev/)**: Biblioteca principal para a construção da interface.
    * **[Vite](https://vitejs.dev/)**: Ferramenta de build para um desenvolvimento rápido e otimizado.
    * **[Tailwind CSS](https://tailwindcss.com/)**: Framework de estilização para um design moderno e responsivo.
    * **[React Router](https://reactrouter.com/)**: Para gerenciamento de rotas na aplicação.
* **Integrações:**
    * **[Mercado Pago SDK](https://www.mercadopago.com.br/developers/pt/docs/sdks-library/client-side/sdk-react-v1)**: Para processamento de pagamentos.
    * **[Google OAuth](https://developers.google.com/identity/protocols/oauth2)**: Para autenticação social.
* **Estado e Comunicação:**
    * **[Axios](https://axios-http.com/)**: Cliente HTTP para comunicação com a API.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* Um gerenciador de pacotes ([npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/))
* Uma instância da API backend do projeto rodando localmente.

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/CristianoMends/gabymakes-website.git
    cd gabymakes-website
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie um arquivo `.env` na raiz do projeto.
    * Adicione a URL da sua API e a chave pública do Mercado Pago:
        ```env
        VITE_API_URL=http://localhost:3000
        VITE_MERCADO_PAGO_PUBLIC_KEY=SUA_CHAVE_PUBLICA_AQUI
        ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou na porta indicada pelo Vite).

---

## 🤝 Colaboradores

Agradecimentos especiais aos desenvolvedores que contribuíram para este projeto:

<table border>
    <tr>
        <td align="center">
            <a href="https://github.com/CristianoMends">
                <img src="https://avatars.githubusercontent.com/u/116528159?v=4" width="100px;" alt="Cristiano Mendes"/>
                <br />
                <sub><b>Cristiano Mendes</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/GuilhermeDNobre">
                <img src="https://avatars.githubusercontent.com/u/88898043?v=4" width="100px;" alt="Guilherme Nobre"/>
                <br />
                <sub><b>Guilherme Nobre</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/FGabriel-Lima">
                <img src="https://avatars.githubusercontent.com/u/95498571?v=4" width="100px;" alt="Gabriel Lima"/>
                <br />
                <sub><b>Gabriel Lima</b></sub>
            </a>
        </td>
    </tr>
</table>
