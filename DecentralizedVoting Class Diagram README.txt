
# Class Diagram - Decentralized Voting

## Overview

This diagram represents the structure of the DecentralizedVoting smart contract, including its properties and functions.

### Classes:

1. **DecentralizedVoting**:
    - Properties:
        - `_proposalIds`: Counter for the proposal IDs.
        - `proposals`: Mapping of proposal IDs to Proposal structs.
        - `hasVoted`: Mapping to keep track of which addresses have voted on which proposals.
    - Functions:
        - `createProposal()`: Creates a new proposal.
        - `vote()`: Allows users to vote on a proposal.
        - `getProposalId()`, `getProposalCreator()`, etc.: Various getter functions to retrieve proposal details.
        - Utility functions like `_uint2str()` and `_addressToString()` for internal processing.

2. **Proposal**:
    - Properties:
        - `id`: Unique ID for the proposal.
        - `creator`: Address of the proposal creator.
        - `description`: Text description of the proposal.
        - `expirationTime`: Timestamp for when the proposal expires.
        - `yesVotes` and `noVotes`: Counters for votes.
        - `exists`: Boolean flag indicating whether the proposal exists.

## Relationships:
- The `DecentralizedVoting` contract stores `Proposal` structs in the `proposals` mapping.
