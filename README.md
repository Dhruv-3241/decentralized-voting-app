# Decentralized Voting Application

This project implements a simple decentralized voting application using smart contracts on the Ethereum blockchain. It allows users to create proposals and vote on them, simulating a basic Decentralized Autonomous Organization (DAO) mechanism..

## Prerequisites

- Node.js (v12 or higher)
- Truffle (v5.0 or higher)
- Ganache

## Project Structure

```
decentralized-voting-app/
│
├── contracts/
│   └── DecentralizedVoting.sol
│
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
│
├── test/
│   └── test_decentralized_voting.js
│
├── node_modules/
│
├── package.json
├── package-lock.json
├── truffle-config.js
└── README.md
```

- `contracts/`: Contains the Solidity smart contract files.
- `migrations/`: Contains the deployment scripts for Truffle.
- `test/`: Contains the test files for the smart contracts.
- `truffle-config.js`: Configuration file for Truffle.

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd decentralized-voting-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start Ganache:
   - Open the Ganache application
   - Create a new workspace (if needed)
   - Ensure it's running on `127.0.0.1:7545`

## Deployment

1. Compile the contracts:
   ```
   truffle compile
   ```

2. Deploy the contracts to the local Ganache network:
   ```
   truffle migrate
   ```

## Testing

Run the test suite:
```
truffle test
```

## Interacting with the Contract

You can interact with the deployed contract using Truffle Console:

1. Start Truffle Console:
   ```
   truffle console
   ```

2. Get an instance of the deployed contract:
   ```javascript
   let instance = await DecentralizedVoting.deployed()
   ```

3. Create a new proposal:
   ```javascript
   let accounts = await web3.eth.getAccounts()
   let expirationTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
   await instance.createProposal("Test Proposal", expirationTime, { from: accounts[0] })
   ```

4. Vote on a proposal:
   ```javascript
   await instance.vote(1, true, { from: accounts[1] })
   ```

5. Get proposal details:
   ```javascript
   let proposal = await instance.getProposalDetails(1)
   console.log(proposal)
   ```

## Design Decisions and Assumptions

- The contract uses OpenZeppelin's `Counters` library for generating unique proposal IDs.
- Proposals are stored in a mapping for efficient access.
- A separate array `proposalIds` is maintained to allow iteration over all proposals.
- Voting is implemented as a boolean (for/against) to keep the contract simple.
- The contract does not implement any access control - any user can create proposals and vote.
- Proposal expiration is based on the block timestamp. In a production environment, consider using block numbers for more predictable expiration.

## Security Considerations

- The contract uses Solidity 0.8.0, which includes built-in overflow protection.
- Input validation is implemented to prevent voting on non-existent or expired proposals.
- The contract prevents double voting by maintaining a record of addresses that have voted on each proposal.

Please note that this is a basic implementation and would require additional security audits and improvements before being used in a production environment.