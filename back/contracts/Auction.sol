// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Action {
    using ECDSA for bytes32;

    struct Bid {
        uint256 id;
        uint256 amount; // Deposit
        uint256 time; // Validity time
        address payable buyer;
        bool isFinished; // Just for this bid
    }
    struct Post {
        uint256 id;
        uint256 minBid; //The minimum amount of Ether required for the auction
        uint256 time; // Deadline time
        uint256 biddingEndTime;
        uint256 highestBid;
        address payable seller; // Beneficiary
        address highestBidder;
        bool ended;
        bytes32 name;
        address confirmPost1;
        address confirmPost2;
    }

    Post[] posts;
    mapping(uint256 => mapping(address => uint256[])) CountPstBids;
    mapping(uint256 => mapping(address => bool)) isSignPost;
    mapping(uint256 => Bid[]) bids;
    mapping(address => mapping(uint256 => uint256)) balances;

    event CreatePost(uint256 id, address seller);
    event ConfirmPost(address confirm, bool isvalid);



    //  * @dev This modifier is used to validate
    //  * @param adr An array of two Ethereum addresses that should not match the caller's address (msg.sender) and must not be zero addresses.
    modifier addSigner(address[2] memory adr) {
        for (uint256 i; i < 2; i++) {
            require(
                adr[i] != msg.sender,
                "The address should not be the seller"
            );
            require(adr[i] != address(0), "The address must not be zero");
        }
        _;
    }

 
    //  * @title createPost Function
    //  * @dev This function is used to create a new post in the smart contract. It performs the following tasks:
    //  * - Checks if the minimum bid is greater than or equal to 0.01 Ether.
    //  * - Ensures that the bidding time is set to more than 5 minutes.
    //  * - Calculates a unique identifier 'id' for the new post.
    //  * - Adds the new post to the 'posts' array, including various details such as the seller's address,
    //  *   post name, creation time, bidding end time, and more.
    //  * - Emits the 'CreatePost' event to notify external listeners about the creation of the new post.
    //  *
    //  * @param _name A bytes32 variable representing the name of the post.
    //  * @param _minBid A uint256 variable specifying the minimum bid amount.
    //  * @param _biddingTime A uint256 variable indicating the duration of the auction for this post.
    //  * @param adr An array of two Ethereum addresses used for confirmation.
    //  * @return id The unique identifier for the created post.
    function createPost(
        bytes32 _name,
        uint256 _minBid,
        uint256 _biddingTime,
        address[2] memory adr
    ) public addSigner(adr) {
        require(
            _minBid >= 0.01 ether,
            "Min bid should be greater than or equal to 0.01 Ether!"
        );
        require(
            _biddingTime > 5 minutes,
            "The auction time should be more than 5 minutes."
        );
        uint256 id;
        if (posts.length == 0) {
            id = 0;
        } else {
            id = posts.length;
        }

        posts.push(
            Post({
                id: id,
                seller: payable(msg.sender),
                minBid: _minBid,
                name: (_name),
                time: block.timestamp,
                biddingEndTime: block.timestamp + _biddingTime, //Hpw long we want this post to be avalable for bidding
                highestBidder: address(0),
                highestBid: 0,
                ended: false,
                confirmPost1: adr[0],
                confirmPost2: adr[1]
            })
        );
        emit CreatePost(id, msg.sender);
    }

    //  * @title createBid Function
    //  * @dev This function allows users to create bids on a specified post. It enforces various conditions, including:
    //  * - The bidder cannot be the seller of the post.
    //  * - The bid amount needs be greater than or equal the minimum bid specified for the post.
    //  * - The auction for the post must still be active.
    //  * - Bids must be higher than the previous highest bid, if any.
    //  * - A bidder can make up to three bids on the same post.
    //  * @param _postId The unique identifier of the post on which the bid is being placed.
    function createBid(uint256 _postId) public payable {
        Post memory post = posts[_postId];
        require(msg.sender != post.seller, "You can't bid on your own post");
        require(
            msg.value >= post.minBid,
            "This bid needs be greater than or equal minBid"
        );
        require(post.biddingEndTime > block.timestamp, "This auction is ended");

        if (bids[_postId].length > 0) {
            require(
                msg.value > bids[_postId][bids[_postId].length - 1].amount,
                "This bid needs to be more than last bid"
            );
        }

        if (CountPstBids[_postId][msg.sender].length < 3) {
            uint256 id;
            if (bids[_postId].length == 0) {
                id = 0;
            } else {
                id = bids[_postId].length;
            }
            bids[_postId].push(
                Bid({
                    id: id,
                    amount: msg.value,
                    buyer: payable(msg.sender),
                    time: block.timestamp,
                    isFinished: false
                })
            );

            CountPstBids[_postId][msg.sender].push(bids[_postId].length - 1);
            balances[msg.sender][_postId] += msg.value;
        } else {
            revert("You can only bid three times");
        }
    }

    //  * @title ConfirmPost Function
    //  * @dev This function allows members of a contract to confirm a specific post's validity using cryptographic signatures.
    //  * @param _postId The unique identifier of the post being confirmed.
    //  * @param data A bytes32 variable representing data related to the post.
    //  * @param signatures An array of bytes representing cryptographic signatures.
    function confirmPost(
        uint256 _postId,
        bytes32 data,
        bytes memory signatures
    ) public {
        Post memory post = posts[_postId];
        bytes32 _hash = getPostHash(_postId, data);
        address recovered = recover(_hash, signatures);
        require(recovered == msg.sender, "The signature is wrong");
        require(
            post.confirmPost1 == msg.sender || post.confirmPost2 == msg.sender,
            "This address is not a member of the verifiers"
        );
        require(!isSignPost[_postId][msg.sender], "You have confirmed");

        isSignPost[_postId][msg.sender] = true;
        emit ConfirmPost(msg.sender, true);
    }

    //  * @title AuctionEnd Function
    //  * @dev This function is used to finalize an auction for a specific post. It enforces various conditions, including:
    //  * -  It verifies the user's signature
    //  * - Checking if there are bids on the post.
    //  * - Verifying that the auction time has ended.
    //  * - Ensuring that two designated addresses have approved the auction.
    //  * - Confirming that the caller is the auction seller.
    //  * - Checking that the auction and bid are not already finished.
    //  * - Handling the transfer of funds to the highest bidder and marking the auction as ended.
    //  * @param _postId The unique identifier of the post for which the auction is ending.
    //  * @param data Arbitrary data related to the auction.
    //  * @param signature Signature associated with the data.
    function AuctionEnd(
        uint256 _postId,
        bytes32 data,
        bytes memory signature
    ) public {
        bytes32 _hash = getPostHash(_postId, data);
        address recovered = recover(_hash, signature);
        require(recovered == msg.sender, "The signature is wrong");
        if (bids[_postId].length > 0) {
            Post storage post = posts[_postId];
            Bid storage bid = bids[_postId][bids[_postId].length - 1];
            require(block.timestamp > post.biddingEndTime, "Time is not over");
            require(
                isSignPost[_postId][post.confirmPost1] &&
                    isSignPost[_postId][post.confirmPost2],
                "Two addresses must approve this auction."
            );
            require(
                msg.sender == post.seller,
                "You aren't the auction seller."
            );
            require(
                bid.isFinished == false && post.ended == false,
                "The money of auction has been withdrawn"
            );
            bid.isFinished = true;
            uint256 payment = bid.amount;
            bid.amount = 0;
            balances[bid.buyer][_postId] -= payment;
            post.highestBidder = bid.buyer;
            post.highestBid = payment;
            post.ended = true;
            (bool sent, ) = post.seller.call{value: payment}("");
            require(sent, "Failed to send Ether");
        } else {
            revert("There isn't bid of auction");
        }
    }

    //  * @title Withdraw Function
    //  * @dev This function allows a user to withdraw funds from completed bids on a specific post. It performs the following tasks:
    //  * - Retrieves a list of bids made by the caller for the given post.
    //  * - Iterates through the list, checking for unfinished and successful bids.
    //  * -  It verifies the user's signature
    //  * - If it is the last bid, it will not count.
    //  * - Accumulates the total payment owed to the caller from successful bids.
    //  * - Marks the successful bids as finished and updates balances accordingly.
    //  * - Transfers the accumulated payment to the caller's address.
    //  * @param _postId The unique identifier of the post for which the user is withdrawing funds.
    //  * @param data Additional data related to the withdrawal.
    //  * @param signature Cryptographic signature for authentication.
    function withdraw(
        uint256 _postId,
        bytes32 data,
        bytes memory signature
    ) public  {
        bytes32 _hash = getPostHash(_postId, data);
        address recovered = recover(_hash, signature);
        require(recovered == msg.sender, "The signature is wrong");
        Bid[] memory listBid = getPostBidsOfOneAddress(_postId);
        uint256 numberOfIndex;
        uint256 payment = 0;
        for (uint256 i; i < listBid.length; i++) {
            numberOfIndex = CountPstBids[_postId][msg.sender][i];
            if ((bids[_postId].length - 1) != numberOfIndex) {
                if (
                    bids[_postId][numberOfIndex].buyer == msg.sender &&
                    bids[_postId][numberOfIndex].isFinished == false
                ) {
                    payment += bids[_postId][numberOfIndex].amount;
                    bids[_postId][numberOfIndex].isFinished = true;
                    balances[listBid[i].buyer][_postId] -= bids[_postId][
                        numberOfIndex
                    ].amount;
                    bids[_postId][numberOfIndex].amount = 0;
                }
            }
        }
        (bool sent, ) = msg.sender.call{value: payment}("");
        require(sent, "Failed to send Ether");
    }

    //  * @title GetIsSignPost Function
    //  * @dev This function allows users to check whether two validating addresses have approved that particular post or not.
    //  * @param _postId The unique identifier of the post in question.
    //  * @return bool[2] An array containing two boolean, representing the confirmers of the specified post.
    function getIsSignPost(
        uint256 _postId
    ) public view returns (bool[2] memory) {
        Post memory post = posts[_postId];
        return [
            isSignPost[_postId][post.confirmPost1],
            isSignPost[_postId][post.confirmPost2]
        ];
    }

    //  * @title GetPostHash Function
    //  * @dev This function calculates and returns the hash of a post's data for verification purposes.
    //  * @param _postId The unique identifier of the post for which the hash is being generated.
    //  * @param data A bytes32 variable representing additional data to include in the hash.
    //  * @return bytes32 The computed hash of the post's data and additional input.
    function getPostHash(
        uint256 _postId,
        bytes32 data
    ) public view returns (bytes32) {
        Post memory post = posts[_postId];
        return
            keccak256(
                abi.encodePacked(address(this), post.seller, msg.sender, data)
            );
    }

    //  * @title Recover Function
    //  * @dev This function is used to recover an Ethereum address from a hash and a cryptographic signature.
    //  * @param _hash The hash from which to recover the address.
    //  * @param _signature The cryptographic signature associated with the address.
    //  * @return address The Ethereum address recovered from the provided hash and signature.
    function recover(
        bytes32 _hash,
        bytes memory _signature
    ) public pure returns (address) {
        return _hash.toEthSignedMessageHash().recover(_signature);
    }

    //  * @title GetBalanceAddressOfPost Function
    //  * @dev This function allows users to retrieve the balance of a specific address for a particular post.
    //  * @param _address The Ethereum address for which the balance is being queried.
    //  * @param _postId The unique identifier of the post associated with the balance.
    //  * @return uint256 The balance of the specified address for the given post.
    function getBalanceAddressOfPost(
        address _address,
        uint256 _postId
    ) public view returns (uint256) {
        return balances[_address][_postId];
    }

    //  * @title GetBalance Function
    //  * @dev This function allows users to retrieve the Ether balance of a specific Ethereum address.
    //  * @param _adr The Ethereum address for which the Ether balance is being queried.
    //  * @return uint256 The Ether balance of the specified address.
    function getBalance(address _adr) public view returns (uint256) {
        return _adr.balance;
    }

    //  * @title GetPostBidsOfOneAddress Function
    //  * @dev This function retrieves an array of bids made by a specific address for a particular post.
    //  * @param _postId The unique identifier of the post for which bids are being retrieved.
    //  * @return Bid[] An array of Bid structures representing the bids made by the caller for the given post.
    function getPostBidsOfOneAddress(
        uint256 _postId
    ) public view returns (Bid[] memory listBid) {
        uint256 count = CountPstBids[_postId][msg.sender].length;
        require(count > 0, "There is no bid");
        listBid = new Bid[](count);
        uint256 j;
        for (uint256 i = 0; i < count; i++) {
            j = CountPstBids[_postId][msg.sender][i];
            listBid[i] = bids[_postId][j];
        }
    }

    //  * @title GetAllBidsOfPost Function
    //  * @dev This function retrieves all bids made for a specific post.
    //  * @param _postId The unique identifier of the post for which bids are being retrieved.
    //  * @return Bid[] An array of Bid structures representing all bids made for the given post.
    function getAllBidsOfPost(
        uint256 _postId
    ) public view returns (Bid[] memory) {
        return bids[_postId];
    }

    //  * @title GetPosts Function
    //  * @dev This function retrieves an array of all posts stored in the contract.
    //  * @return Post[] An array of Post structures representing all posts stored in the contract.
    function getPosts() public view returns (Post[] memory) {
        return posts;
    }
}
