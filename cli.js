const dotenv = require("dotenv");
const { ethers } = require("ethers");
const inquirer = require("inquirer");
const ora = require("ora").default;
const fs = require("fs");

// Cargar variables de entorno
dotenv.config();

const provider = new ethers.AlchemyProvider("sepolia", process.env.API_KEY);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Leer ABI compilado
const contractJson = require("./artifacts/contracts/PriceConverter.sol/PriceConverter.json");
const abi = contractJson.abi;
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

// Obtener balance de la cuenta
async function checkBalance() {
  const balance = await provider.getBalance(signer.address);
  console.log(`💰 Saldo disponible: ${ethers.formatEther(balance)} ETH`);
}

// Lógica de consulta del contrato
async function consultarPrecio(nombreFuncion, label) {
  const spinner = ora(`Obteniendo ${label}...`).start();
  try {
    const [precio, timestamp] = await contract[nombreFuncion]();
    const parsedPrice = Number(precio.toString()) / 1e8;
    const parsedTime = new Date(Number(timestamp.toString()) * 1000).toLocaleString();
    spinner.succeed(`✅ ${label}: ${parsedPrice.toFixed(2)} | Fecha: ${parsedTime}`);
  } catch (err) {
    spinner.fail(`❌ Error al consultar ${label}: ${err.message}`);
  }
}

// Menú interactivo
async function showMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: "list",
      name: "opcion",
      message: "¿Qué quieres consultar?",
      choices: [
        "BTC en USD",
        "ETH en USD",
        "USD → EUR",
        "BTC en EUR",
        "ETH en EUR",
        "Salir",
      ],
    },
  ]);

  switch (opcion) {
    case "BTC en USD":
      await consultarPrecio("getBTCinUSD", "BTC/USD");
      break;
    case "ETH en USD":
      await consultarPrecio("getETHinUSD", "ETH/USD");
      break;
    case "USD → EUR":
      await consultarPrecio("getUSDtoEUR", "USD → EUR");
      break;
    case "BTC en EUR":
      await consultarPrecio("getBTCinEUR", "BTC/EUR");
      break;
    case "ETH en EUR":
      await consultarPrecio("getETHinEUR", "ETH/EUR");
      break;
    case "Salir":
      console.log("👋 Hasta pronto");
      return process.exit(0);
  }

  // Volver al menú
  await showMenu();
}

// Iniciar CLI
async function main() {
  console.log("📈 Bienvenido al CLI de consulta de precios Chainlink");
  await checkBalance(); // Mostrar saldo solo una vez
  await showMenu();
}

main();
