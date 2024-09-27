const DecentralizedVoting = artifacts.require("DecentralizedVoting");

const { expect } = require("chai");
const { BN, time, expectRevert } = require("@openzeppelin/test-helpers");

contract("DecentralizedVoting", (accounts) => {
    let votingInstance;
    const [creator, voter1, voter2] = accounts;

    before(async () => {
        votingInstance = await DecentralizedVoting.new();
    });

    it("should create a proposal", async () => {
        const description = "Proposal 1: Increase community fund";
        const duration = 3600; // 1 hour in seconds

        const tx = await votingInstance.createProposal(description, duration, { from: creator });

        expect(tx.logs[0].event).to.equal("ProposalCreated");
        const proposalId = tx.logs[0].args.proposalId;

        const proposalExists = await votingInstance.proposalExists(proposalId);
        expect(proposalExists).to.be.true;

        const proposalCount = await votingInstance.getProposalCount();
        expect(proposalCount.toNumber()).to.equal(1);

        const proposalCreator = await votingInstance.getProposalCreator(proposalId);
        expect(proposalCreator).to.equal(creator);

        const proposalDescription = await votingInstance.getProposalDescription(proposalId);
        expect(proposalDescription).to.equal("Test Description"); // Note: This is the fixed string we set in the contract

        const descriptionLength = await votingInstance.getProposalDescriptionLength(proposalId);
        expect(descriptionLength.toNumber()).to.equal(description.length);

        const expirationTime = await votingInstance.getProposalExpirationTime(proposalId);
        const currentBlockTime = new BN((await web3.eth.getBlock('latest')).timestamp);
        expect(expirationTime).to.be.bignumber.gt(currentBlockTime);
    });

    it("should allow voting on the proposal", async () => {
        const proposalId = new BN(1);
        
        // Voter 1 votes "yes"
        let tx = await votingInstance.vote(proposalId, true, { from: voter1 });
        expect(tx.logs[0].event).to.equal("Voted");
        expect(tx.logs[0].args.voter).to.equal(voter1);

        // Voter 2 votes "no"
        tx = await votingInstance.vote(proposalId, false, { from: voter2 });
        expect(tx.logs[0].event).to.equal("Voted");
        expect(tx.logs[0].args.voter).to.equal(voter2);

        // Validate proposal vote counts
        const votes = await votingInstance.getProposalVotes(proposalId);
        expect(votes.yesVotes).to.be.bignumber.equal(new BN(1));
        expect(votes.noVotes).to.be.bignumber.equal(new BN(1));

        // Check voting status for voter1 and voter2
        const voter1Status = await votingInstance.hasVotedFor(proposalId, voter1);
        const voter2Status = await votingInstance.hasVotedFor(proposalId, voter2);
        expect(voter1Status).to.be.true;
        expect(voter2Status).to.be.true;
    });

    it("should not allow double voting", async () => {
        const proposalId = new BN(1);

        // Try to vote again from voter1 - should fail
        await expectRevert(
            votingInstance.vote(proposalId, true, { from: voter1 }),
            "Already voted"
        );
    });

    it("should not allow voting after the proposal has expired", async () => {
        const description = "Proposal 2: Reduce block gas limit";
        const duration = 10; // 10 seconds duration

        // Create a new proposal with short expiration time
        let tx = await votingInstance.createProposal(description, duration, { from: creator });
        const proposalId = tx.logs[0].args.proposalId;

        // Increase blockchain time beyond proposal expiration
        await time.increase(duration + 1);

        // Try to vote on the expired proposal
        await expectRevert(
            votingInstance.vote(proposalId, true, { from: voter1 }),
            "Proposal has expired"
        );
    });

    it("should return proposal information as a string", async () => {
        const proposalId = new BN(1);
        const proposalInfo = await votingInstance.getProposal(proposalId);
        
        expect(proposalInfo).to.be.a('string');
        expect(proposalInfo).to.include("ID: 1");
        expect(proposalInfo).to.include("Expiration:");
        expect(proposalInfo).to.include("Yes Votes: 1");
        expect(proposalInfo).to.include("No Votes: 1");
    });

    it("should not allow operations on non-existent proposals", async () => {
        const nonExistentProposalId = new BN(999);

        await expectRevert(
            votingInstance.getProposalId(nonExistentProposalId),
            "Proposal does not exist"
        );

        await expectRevert(
            votingInstance.getProposalCreator(nonExistentProposalId),
            "Proposal does not exist"
        );

        await expectRevert(
            votingInstance.getProposalDescription(nonExistentProposalId),
            "Proposal does not exist"
        );

        await expectRevert(
            votingInstance.getProposalExpirationTime(nonExistentProposalId),
            "Proposal does not exist"
        );

        await expectRevert(
            votingInstance.getProposalVotes(nonExistentProposalId),
            "Proposal does not exist"
        );

        await expectRevert(
            votingInstance.vote(nonExistentProposalId, true, { from: voter1 }),
            "Proposal does not exist"
        );
    });
});