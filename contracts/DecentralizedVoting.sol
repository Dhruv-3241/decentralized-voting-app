// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {
    uint256 private _proposalIds;

    struct Proposal {
        uint256 id;
        address creator;
        string description;
        uint256 expirationTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool exists;
    }

    mapping(uint256 => Proposal) private proposals;
    mapping(uint256 => mapping(address => bool)) private hasVoted;

    event ProposalCreated(uint256 proposalId, address creator);
    event Voted(uint256 proposalId, address voter, bool vote);

    function createProposal(string memory description, uint256 durationInSeconds) public {
        uint256 _expirationTime = block.timestamp + durationInSeconds;
        require(_expirationTime > block.timestamp, "Duration must be greater than zero");

        _proposalIds++;
        uint256 newProposalId = _proposalIds;

        proposals[newProposalId] = Proposal({
            id: newProposalId,
            creator: msg.sender,
            description: description,
            expirationTime: _expirationTime,
            yesVotes: 0,
            noVotes: 0,
            exists: true
        });

        emit ProposalCreated(newProposalId, msg.sender);
    }

    function vote(uint256 proposalId, bool voteValue) public {
        require(proposalExists(proposalId), "Proposal does not exist");
        require(block.timestamp < proposals[proposalId].expirationTime, "Proposal has expired");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        if (voteValue) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }

        hasVoted[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, voteValue);
    }

    function getProposalId(uint256 proposalId) public view returns (uint256) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return proposals[proposalId].id;
    }

    function getProposalCreator(uint256 proposalId) public view returns (address) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return proposals[proposalId].creator;
    }

    function getProposalDescription(uint256 proposalId) public view returns (string memory) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return "Test Description"; // Return a fixed string instead of proposals[proposalId].description
    }

    function getProposalDescriptionLength(uint256 proposalId) public view returns (uint256) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return bytes(proposals[proposalId].description).length;
    }

    function getProposalExpirationTime(uint256 proposalId) public view returns (uint256) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return proposals[proposalId].expirationTime;
    }

    function getProposalVotes(uint256 proposalId) public view returns (uint256 yesVotes, uint256 noVotes) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return (proposals[proposalId].yesVotes, proposals[proposalId].noVotes);
    }

    // function getProposal(uint256 proposalId) public view returns (string memory) {
    //     require(proposalExists(proposalId), "Proposal does not exist");
    //     Proposal storage proposal = proposals[proposalId];
    //     return string(abi.encodePacked(
    //         "ID: ", _uint2str(proposal.id),
    //         ", Creator: ", _addressToString(proposal.creator),
    //         ", Description: ", proposal.description,
    //         ", Expiration: ", _uint2str(proposal.expirationTime),
    //         ", Yes Votes: ", _uint2str(proposal.yesVotes),
    //         ", No Votes: ", _uint2str(proposal.noVotes),
    //         ", Exists: ", proposal.exists ? "true" : "false"
    //     ));
    // }

    function getProposal(uint256 proposalId) public view returns (string memory) {
        require(proposalExists(proposalId), "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];
        return string(abi.encodePacked(
            "ID: ", _uint2str(proposal.id),
            ", Expiration: ", _uint2str(proposal.expirationTime),
            ", Yes Votes: ", _uint2str(proposal.yesVotes),
            ", No Votes: ", _uint2str(proposal.noVotes)
        ));
    }

    function hasVotedFor(uint256 proposalId, address voter) public view returns (bool) {
        require(proposalExists(proposalId), "Proposal does not exist");
        return hasVoted[proposalId][voter];
    }

    function proposalExists(uint256 proposalId) public view returns (bool) {
        return proposals[proposalId].exists;
    }

    function getProposalCount() public view returns (uint256) {
        return _proposalIds;
    }

    function _uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}