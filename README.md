# 🧠 Práctica 3 - Consulta de Precios con Chainlink

Este proyecto forma parte del Máster Interuniversitario en Ciberseguridad (MUNICS). Su objetivo es desplegar un contrato inteligente sobre la red de pruebas Sepolia, que permite consultar los precios de BTC y ETH tanto en USD como en EUR utilizando oráculos de Chainlink. Además, se desarrolla una interfaz de línea de comandos (CLI) para interactuar con el contrato.

## 📆 Funcionalidades

* Consulta del precio de:

  * BTC/USD
  * ETH/USD
  * USD → EUR (calculado como 1 ÷ EUR/USD)
  * BTC/EUR y ETH/EUR (calculados combinando feeds)
* Timestamp asociado a cada precio
* Interfaz CLI interactiva en Node.js
* Despliegue con Hardhat en Sepolia

---

## 🛠️ Tecnologías utilizadas

* [Solidity](https://soliditylang.org/)
* [Chainlink Data Feeds](https://docs.chain.link/data-feeds)
* [Hardhat](https://hardhat.org/)
* [Node.js](https://nodejs.org/) + [Ethers.js](https://docs.ethers.org/)
* [Alchemy](https://www.alchemy.com/) (nodo Sepolia)
* [Inquirer](https://www.npmjs.com/package/inquirer) y [Ora](https://www.npmjs.com/package/ora) para la CLI

---

## ⚙️ Estructura del proyecto

```
├── contracts/
│   └── PriceConverter.sol         # Contrato inteligente
├── scripts/
│   └── deploy.js                  # Script de despliegue con Hardhat
├── cli.js                         # Aplicación de línea de comandos
├── .env                           # Variables privadas (no incluida)
├── hardhat.config.js              # Configuración del entorno Hardhat
└── artifacts/                     # ABI y bytecode generado por Hardhat
```

---

## 🚀 Despliegue del contrato

1. Clona este repositorio y entra en el directorio:

```bash
git clone https://github.com/javi2610/CIAD_P3.git
cd CIAD_P3
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con el siguiente contenido:

```env
API_KEY=tu_api_key_de_alchemy
PRIVATE_KEY=tu_clave_privada
CONTRACT_ADDRESS=se rellenará después del despliegue
```

4. Despliega el contrato en Sepolia:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5. Copia la dirección del contrato desplegado en `.env` bajo `CONTRACT_ADDRESS`.

---

## 💻 Uso de la CLI

Una vez desplegado el contrato y configurado `.env`, ejecuta:

```bash
node cli.js
```

Selecciona la opción deseada en el menú para consultar precios actualizados y sus timestamps.

---

## 🎥 Vídeo de demostración

📺 Puedes visualizar el vídeo con el funcionamiento completo del sistema (despliegue + CLI):

👉 [Ver vídeo de demostración](https://github.com/javi2610/CIAD_P3/blob/main/demo_video.mp4)

