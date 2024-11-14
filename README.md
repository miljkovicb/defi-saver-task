# CDP Search Application

This is a decentralized finance (DeFi) application built with **React** that allows users to search for and display details of Collateralized Debt Positions (CDPs) on the MakerDAO protocol. The app integrates with **MetaMask** and uses **Web3** to fetch CDP data from smart contracts. Users can select collateral types, search by CDP ID, view key position details, and sign messages to claim ownership of a CDP.

## Features

- **Search and Display CDPs**: Users can search for CDPs by ID and view position details, including collateral, debt, and collateralization ratio.
- **Responsive UI**: The app provides a responsive layout, optimized for different screen sizes.
- **MetaMask Integration**: The app connects to MetaMask, allowing users to sign a message to claim a CDP.
- **Lodash Debounce for Optimized Search**: Search queries are throttled to reduce API calls while providing a responsive search experience.

## Prerequisites

- **Node.js** (v14+ recommended)
- **MetaMask Extension** in the browser

## Getting Started

Follow these instructions to set up the application on your local machine for development and testing.

### Installation

1. **Install dependencies**:

    ```bash
    npm install
    ```

    If you have only `lodash.debounce` installed and need additional lodash functions, run:

    ```bash
    npm install lodash
    ```

2. **Environment Setup**:

   Create a `.env` file in the root directory and add the required environment variables. Here’s an example:

    ```plaintext
    VITE_CONTRACT_ADDRESS=<CDP_Contract_Address>
    VITE_ILK_CONTRACT_ADDRESS=<Ilk_Contract_Address>
    ```

   Replace `<CDP_Contract_Address>` and `<Ilk_Contract_Address>` with your own contracts.

### Running the Application

1. **Start the Development Server**:

    ```bash
    npm run dev
    ```

2. **Open the Application**:

   Once the server is running, open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### Usage

1. **Select a Collateral Type**: Choose a collateral type (e.g., `ETH-A`, `WBTC-A`, or `USDC-A`) from the dropdown.
2. **Search for CDP by ID**: Enter a CDP ID in the search box. The search box will be disabled until a collateral type is selected.
3. **View CDP Details**: Click on a search result to view detailed information, including collateralization ratio, max collateral withdrawal, and max debt creation.
4. **Sign CDP Ownership**: If MetaMask is connected, click the **This is my CDP** button to sign the ownership message.

### Technical Details

- **React and Redux**: Manages state for CDP data, user interactions, and MetaMask connection.
- **Web3.js**: Communicates with Ethereum contracts to fetch CDP and collateral data.
- **Lodash Debounce**: Optimizes search requests to reduce API load.
- **Tailwind CSS**: Styles the responsive interface, ensuring a seamless experience across devices.
- **react-tooltip**: Adds tooltips for a guided user experience.

### Troubleshooting

- **MetaMask Connection Issues**: Ensure MetaMask is installed and connected to the appropriate Ethereum network.
- **Debounced Search Box**: If search doesn’t trigger as expected, confirm that `lodash` or `lodash.debounce` is properly installed.

### License

This project is licensed under the MIT License.
