const { ethers } = require("hardhat"); // Importa el objeto 'ethers' proporcionado por Hardhat para interactuar con la red Ethereum.

// Función principal asincrónica
async function main() {
  try {
    // Obtiene la cuenta que desplegará el contrato (primer signer configurado en Hardhat)
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Desplegando contrato con la cuenta: ${deployer.address}`);

    // Consulta y muestra el saldo disponible en ETH de la cuenta
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 Saldo de la cuenta: ${ethers.formatEther(balance)} ETH`);

    // Obtiene la "fábrica" del contrato, que permite crear instancias del mismo
    const PriceConverter = await ethers.getContractFactory("PriceConverter");
    console.log("🔧 Fábrica del contrato obtenida...");

    // Direcciones de los oráculos Chainlink en Sepolia
    const btcUsdFeed = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
    const ethUsdFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const eurUsdFeed = "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910";

    // Despliega el contrato pasándole las direcciones de los oráculos como parámetros al constructor
    const converter = await PriceConverter.deploy(btcUsdFeed, ethUsdFeed, eurUsdFeed);
    console.log("⏳ Desplegando contrato...");
    await converter.waitForDeployment(); // Espera a que la transacción de despliegue se confirme

    // Obtiene y muestra la dirección del contrato desplegado
    const address = await converter.getAddress();
    console.log(`✅ Contrato PriceConverter desplegado en: ${address}`);

    // Accede a la transacción de despliegue para mostrar información adicional
    const tx = converter.deploymentTransaction();
    console.log(`📦 Hash de la transacción: ${tx.hash}`);

    // Espera a que la transacción se mine y muestra el gas utilizado
    const receipt = await tx.wait();
    console.log(`⛽ Gas usado para el despliegue: ${receipt.gasUsed.toString()}`);
  
  } catch (error) {
    // Captura errores del proceso de despliegue y muestra un mensaje claro
    console.error("❌ Error durante el despliegue:", error.message);
    process.exit(1); // Finaliza el proceso con código de error
  }
}

// Ejecuta la función principal y captura posibles errores globales
main()
  .then(() => process.exit(0)) // Finaliza exitosamente si no hay errores
  .catch(error => {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  });
