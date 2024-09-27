
# Sequence Diagram - Decentralized Voting

## Overview

This diagram represents the interaction between a user and the DecentralizedVoting smart contract. It outlines the following processes:

1. **Proposal Creation**:
    - The user invokes the `createProposal()` function, passing in the description and duration.
    - The contract checks the expiration, increments the proposal ID, and stores the proposal.
    - A `ProposalCreated` event is emitted to indicate that a proposal has been created.

2. **Voting on a Proposal**:
    - The user votes on a proposal by calling the `vote()` function.
    - The contract checks if the proposal exists and whether it has expired.
    - The contract then records the vote and emits a `Voted` event.

## Entities
- **User**: The entity interacting with the contract, either by creating proposals or voting.
- **DecentralizedVoting (DV)**: The smart contract that manages the proposals and votes.

