# AUCTION
The smart contract consists of five main functions: CreatePost, CreateBid, ConfirmPost, AuctionEnd, and Withdrawal. Here is an explanation of each function:

CreatePost: This function is responsible for creating a new post in the smart contract.
It includes specifying details such as post name, minimum bid amount, auction duration and other relevant information. Once called, 
it adds the post to the contract data structure and emits an event to notify external listeners about the creation of the new post.

CreateBid: The CreateBid function allows users to bid on existing posts in smart contracts. Bidders specify the post they want to bid on and the bid amount.

ConfirmPost: ConfirmPost serves as a function to confirm the successful completion of a post or an auction.

AuctionEnd: AuctionEnd is responsible for ending an ongoing auction or post.

Withdrawal: Withdrawal function allows users to withdraw funds or assets from the smart contract.
