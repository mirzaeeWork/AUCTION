const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", async function () {
    let auction
    let owner, adr1, adr2, adr3, name
    const sendValue = hre.ethers.parseEther("0.015");
    const minBid = hre.ethers.parseEther("0.01");
    const biddingTime = 6 * 60;
    const endTime = 7 * 60;

    beforeEach(async () => {
        [owner, adr1, adr2, adr3] = await ethers.getSigners();
        auction = await hre.ethers.deployContract("Action");
        await auction.waitForDeployment();
        name = ethers.encodeBytes32String("مزایده اول")
        // console.log("first: " ,name)
    })

    describe("Post", function () {
        it("Fails if you set less than 0.01 ETH", async () => {
            await expect(auction.createPost(name, hre.ethers.parseEther("0.009")
                , biddingTime, [adr1, adr2])).to.be.revertedWith(
                    "Min bid should be greater than or equal to 0.01 Ether!"
                )
        })

        it("Fails if the post time is less than 5 minutes", async () => {
            await expect(auction.createPost(name, minBid, 4 * 60, [adr1, adr2])).to.be.revertedWith(
                "The auction time should be more than 5 minutes."
            )
        })

        it("Fails If the address is the same as the seller", async () => {
            await expect(auction.createPost(name, minBid, biddingTime, [owner, adr2])).to.be.revertedWith(
                "The address should not be the seller"
            )
        })

        it("Fails If the address is the zero", async () => {
            await expect(auction.createPost(name, minBid, biddingTime, [ethers.ZeroAddress, adr2])).to.be.revertedWith(
                'The address must not be zero'
            )
        })

        it("Create post", async () => {
            await expect(auction.createPost(name, minBid, biddingTime, [adr1, adr2]))
                .to.emit(auction, "CreatePost")
                .withArgs((await auction.getPosts()).length, owner.address);
        })
    })

    describe("Create a bid for the post", function () {
        let len;
        beforeEach(async () => {
            await auction.createPost(name, minBid, biddingTime, [adr1, adr2])
            len = (await auction.getPosts()).length - 1
        })

        it("Fails If the seller wants to create bid", async () => {
            await expect(auction.createBid(len, { value: sendValue })).to.be.revertedWith(
                "You can't bid on your own post"
            )
        })

        it("Fails if you send less than minBid", async () => {
            await expect(auction.connect(adr1).createBid(len, { value: hre.ethers.parseEther("0.009") }))
                .to.be.revertedWith(
                    "This bid needs be greater than or equal minBid"
                )
        })

        it("Fails if this auction is ended", async () => {
            ethers.provider.send("evm_increaseTime", [endTime])
            ethers.provider.send("evm_mine")      // mine the next block
            await expect(auction.connect(adr1).createBid(len, { value: sendValue }))
                .to.be.revertedWith(
                    "This auction is ended"
                )
        })

        it("Fails if the bid is less than or equal to the last bid ", async () => {
            auction.connect(adr1).createBid(len, { value: sendValue })
            await expect(auction.connect(adr2).createBid(len, { value: sendValue }))
                .to.be.revertedWith(
                    "This bid needs to be more than last bid"
                )
        })

        it("Fails if you send bid more than three times", async () => {
            await auction.connect(adr1).createBid(len, { value: sendValue })
            await auction.connect(adr1).createBid(len, { value: hre.ethers.parseEther("0.02") })
            await auction.connect(adr1).createBid(len, { value: hre.ethers.parseEther("0.022") })
            await expect(auction.connect(adr1).createBid(len, { value: hre.ethers.parseEther("0.025") }))
                .to.be.revertedWith(
                    "You can only bid three times"
                )
        })

        it("Create bid", async () => {
            const beforeBalance = await auction.getBalance(auction.target)
            await auction.connect(adr1).createBid(len, { value: sendValue })
            const afterBalance = await auction.getBalance(auction.target)
            assert.equal(
                (beforeBalance + sendValue).toString(),
                (afterBalance).toString()
            )
        })
    })

    describe("confirmPost", function () {
        let data, hash;
        beforeEach(async () => {
            await auction.createPost(name, minBid, biddingTime, [adr1, adr2])
        })

        it("Fails if the signature is wrong", async () => {
            data = ethers.encodeBytes32String("samaneh")
            hash = await auction.connect(adr3).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr3.signMessage(_hash);
            await expect(auction.connect(adr1).confirmPost(0, data, signature)).to.be.revertedWith(
                "The signature is wrong"
            )
        })

        it("Fails if this address is not a member of the verifiers", async () => {
            data = ethers.encodeBytes32String("samaneh")
            hash = await auction.connect(adr3).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr3.signMessage(_hash);
            await expect(auction.connect(adr3).confirmPost(0, data, signature)).to.be.revertedWith(
                "This address is not a member of the verifiers"
            )
        })

        it("The address confirms post and fails if execute the function", async () => {
            data = ethers.encodeBytes32String("samaneh")
            hash = await auction.connect(adr2).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr2.signMessage(_hash);
            await expect(auction.connect(adr2).confirmPost(0, data, signature))
                .to.emit(auction, "ConfirmPost")
                .withArgs(adr2.address, true);
            await expect(auction.connect(adr2).confirmPost(0, data, signature)).to.be.revertedWith(
                "You have confirmed"
            )
        })
    })


    describe("AuctionEnd", function () {
        let data, hash, dataOwner, hashOwner, signatureowner;
        beforeEach(async () => {
            await auction.createPost(name, minBid, biddingTime, [adr1, adr2])
            data = ethers.encodeBytes32String("samaneh")
            hash = await auction.connect(adr1).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr1.signMessage(_hash);
            await auction.connect(adr1).confirmPost(0, data, signature)
            //--------------------
            dataOwner = ethers.encodeBytes32String("salam")
            hashOwner = await auction.connect(owner).getPostHash(0, dataOwner)
            signatureowner = await owner.signMessage(ethers.getBytes(hashOwner))
        })

        it("Fails if there isn't bid of auction.", async () => {
            await expect(auction.AuctionEnd(0, dataOwner, signatureowner)).to.be.revertedWith(
                "There isn't bid of auction"
            )
        })


        it("Fails if time is not over or two addresses don't confirme the auction.", async () => {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 5; i++) {
                await auction.connect(accounts[i]).createBid(0,
                    { value: ethers.parseEther(`0.0${i}`) })
            }
            await expect(auction.AuctionEnd(0, dataOwner, signatureowner)).to.be.revertedWith(
                "Time is not over"
            )
            ethers.provider.send("evm_increaseTime", [endTime])
            ethers.provider.send("evm_mine")      // mine the next block
            await expect(auction.AuctionEnd(0, dataOwner, signatureowner)).to.be.revertedWith(
                "Two addresses must approve this auction."
            )
        })

        it("Fails if you aren't the auction seller.", async () => {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 5; i++) {
                await auction.connect(accounts[i]).createBid(0, { value: ethers.parseEther(`0.0${i}`) })
            }
            data = ethers.encodeBytes32String("mirzaee")
            hash = await auction.connect(adr2).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr2.signMessage(_hash);
            await auction.connect(adr2).confirmPost(0, data, signature)
            ethers.provider.send("evm_increaseTime", [endTime])
            ethers.provider.send("evm_mine")      // mine the next block
            dataOwner = ethers.encodeBytes32String("salam")
            hashOwner = await auction.connect(adr3).getPostHash(0, dataOwner)
            signatureowner = await adr3.signMessage(ethers.getBytes(hashOwner))
            await expect(auction.connect(adr3).AuctionEnd(0, dataOwner, signatureowner)).to.be.revertedWith(
                "You aren't the auction seller."
            )
        })

        it("The seller withdraws the money and fails if it executes the function again", async () => {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 5; i++) {
                await auction.connect(accounts[i]).createBid(0, { value: ethers.parseEther(`0.0${i}`) })
            }
            data = ethers.encodeBytes32String("mirzaee")
            hash = await auction.connect(adr2).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr2.signMessage(_hash);
            await auction.connect(adr2).confirmPost(0, data, signature)
            ethers.provider.send("evm_increaseTime", [endTime])
            ethers.provider.send("evm_mine")      // mine the next block
            const bids = await auction.getAllBidsOfPost(0);
            await expect(auction.AuctionEnd(0, dataOwner, signatureowner)).to.changeEtherBalances(
                [owner],
                [bids[bids.length - 1].amount]
            );

            await expect(auction.AuctionEnd(0, dataOwner, signatureowner)).to.be.revertedWith(
                "The money of auction has been withdrawn"
            )
        })
    })

    describe("withdraw", function () {
        let data, hash, dataOwner, hashOwner, signatureowner;
        beforeEach(async () => {
            await auction.createPost(name, minBid, biddingTime, [adr1, adr2])
            data = ethers.encodeBytes32String("samaneh")
            hash = await auction.connect(adr1).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr1.signMessage(_hash);
            await auction.connect(adr1).confirmPost(0, data, signature)
            //--------------------
            dataOwner = ethers.encodeBytes32String("salam")
            hashOwner = await auction.connect(owner).getPostHash(0, dataOwner)
            signatureowner = await owner.signMessage(ethers.getBytes(hashOwner))

        })


        it("Other than the last bid, other addresses can withdraw their money", async () => {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 5; i++) {
                await auction.connect(accounts[i]).createBid(0, { value: ethers.parseEther(`0.0${i}`) })
            }
            data = ethers.encodeBytes32String("mirzaee")
            hash = await auction.connect(adr2).getPostHash(0, data)
            const _hash = ethers.getBytes(hash)
            const signature = await adr2.signMessage(_hash);
            await auction.connect(adr2).confirmPost(0, data, signature)
            ethers.provider.send("evm_increaseTime", [endTime])
            ethers.provider.send("evm_mine")      // mine the next block
            await auction.AuctionEnd(0, dataOwner, signatureowner);
            for (i = 1; i < 5; i++) {
               let _data = ethers.encodeBytes32String(`salam${i}`)
               let _hash = await auction.connect(accounts[i]).getPostHash(0, _data)
               let _signature = await accounts[i].signMessage(ethers.getBytes(_hash))    
                await auction.connect(accounts[i]).withdraw(0,_data,_signature);
                assert.equal(
                    await auction.getBalanceAddressOfPost(
                        accounts[i], 0
                    ),
                    0
                )
            }
        })
    })

});
