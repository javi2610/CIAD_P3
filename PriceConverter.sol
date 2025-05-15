// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importa la interfaz de Chainlink para interactuar con oráculos de precios
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceConverter
 * @dev Contrato inteligente para obtener precios en USD y EUR de BTC y ETH usando oráculos de Chainlink en Sepolia.
 */
contract PriceConverter {
    // Referencias a los oráculos de Chainlink para cada par de divisas
    AggregatorV3Interface internal btcUsdFeed;
    AggregatorV3Interface internal ethUsdFeed;
    AggregatorV3Interface internal eurUsdFeed;

    /**
     * @dev Constructor que inicializa los oráculos al desplegar el contrato.
     * @param _btcUsdFeed Dirección del oráculo BTC/USD.
     * @param _ethUsdFeed Dirección del oráculo ETH/USD.
     * @param _eurUsdFeed Dirección del oráculo EUR/USD.
     */
    constructor(
        address _btcUsdFeed,
        address _ethUsdFeed,
        address _eurUsdFeed
    ) {
        btcUsdFeed = AggregatorV3Interface(_btcUsdFeed);
        ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
        eurUsdFeed = AggregatorV3Interface(_eurUsdFeed);
    }

    /**
     * @dev Función interna reutilizable que obtiene el precio actual y su timestamp desde un oráculo.
     * @param feed Oráculo de Chainlink.
     * @return price Precio actual con 8 decimales.
     * @return updatedAt Timestamp de la última actualización.
     */
    function getPriceWithTimestamp(AggregatorV3Interface feed)
        internal
        view
        returns (int256 price, uint256 updatedAt)
    {
        (, price, , updatedAt, ) = feed.latestRoundData();
    }

    /**
     * @dev Devuelve el precio actual de 1 BTC en USD.
     * @return price Precio en USD.
     * @return timestamp Fecha de la última actualización.
     */
    function getBTCinUSD() public view returns (int256 price, uint256 timestamp) {
        return getPriceWithTimestamp(btcUsdFeed);
    }

    /**
     * @dev Devuelve el precio actual de 1 ETH en USD.
     * @return price Precio en USD.
     * @return timestamp Fecha de la última actualización.
     */
    function getETHinUSD() public view returns (int256 price, uint256 timestamp) {
        return getPriceWithTimestamp(ethUsdFeed);
    }

    /**
     * @dev Devuelve la tasa de conversión USD → EUR, calculada como el inverso del oráculo EUR/USD.
     * @return rate Valor de 1 USD en EUR.
     * @return timestamp Fecha de la última actualización.
     */
    function getUSDtoEUR() public view returns (int256 rate, uint256 timestamp) {
        (int256 eurUsd, uint256 updatedAt) = getPriceWithTimestamp(eurUsdFeed);
        require(eurUsd > 0, "EUR/USD not valid"); // Seguridad: evita divisiones por cero

        // Dado que Chainlink da EUR/USD, el inverso equivale a USD → EUR
        // 1e8*1e8 / eurUsd ajusta los decimales correctamente (8 decimales de Chainlink)
        rate = (1e16) / eurUsd;
        timestamp = updatedAt;
    }

    /**
     * @dev Devuelve el precio de 1 BTC en EUR, usando BTC/USD y EUR/USD.
     * @return priceEUR Precio resultante en euros.
     * @return timestamp Timestamp más antiguo entre ambos oráculos, para coherencia temporal.
     */
    function getBTCinEUR() public view returns (int256 priceEUR, uint256 timestamp) {
        (int256 btcUsd, uint256 ts1) = getPriceWithTimestamp(btcUsdFeed);
        (int256 eurUsd, uint256 ts2) = getPriceWithTimestamp(eurUsdFeed);
        require(eurUsd > 0, "EUR/USD not valid");

        // BTC/EUR = BTC/USD ÷ EUR/USD → se ajustan los decimales multiplicando por 1e8
        priceEUR = (btcUsd * 1e8) / eurUsd;
        timestamp = ts1 < ts2 ? ts1 : ts2;
    }

    /**
     * @dev Devuelve el precio de 1 ETH en EUR, usando ETH/USD y EUR/USD.
     * @return priceEUR Precio resultante en euros.
     * @return timestamp Timestamp más antiguo entre ambos oráculos.
     */
    function getETHinEUR() public view returns (int256 priceEUR, uint256 timestamp) {
        (int256 ethUsd, uint256 ts1) = getPriceWithTimestamp(ethUsdFeed);
        (int256 eurUsd, uint256 ts2) = getPriceWithTimestamp(eurUsdFeed);
        require(eurUsd > 0, "EUR/USD not valid");

        priceEUR = (ethUsd * 1e8) / eurUsd;
        timestamp = ts1 < ts2 ? ts1 : ts2;
    }
}
