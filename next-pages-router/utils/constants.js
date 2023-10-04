export const contractAddress = "0x1A5642C049c74493676BD6B9aE73eec79B014a9C"

export const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "confirm",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isvalid",
        "type": "bool"
      }
    ],
    "name": "ConfirmPost",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "CreatePost",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "data",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "AuctionEnd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "data",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signatures",
        "type": "bytes"
      }
    ],
    "name": "confirmPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      }
    ],
    "name": "createBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_name",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_minBid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_biddingTime",
        "type": "uint256"
      },
      {
        "internalType": "address[2]",
        "name": "adr",
        "type": "address[2]"
      }
    ],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      }
    ],
    "name": "getAllBidsOfPost",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isFinished",
            "type": "bool"
          }
        ],
        "internalType": "struct Action.Bid[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_adr",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      }
    ],
    "name": "getBalanceAddressOfPost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      }
    ],
    "name": "getIsSignPost",
    "outputs": [
      {
        "internalType": "bool[2]",
        "name": "",
        "type": "bool[2]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      }
    ],
    "name": "getPostBidsOfOneAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isFinished",
            "type": "bool"
          }
        ],
        "internalType": "struct Action.Bid[]",
        "name": "listBid",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "data",
        "type": "bytes32"
      }
    ],
    "name": "getPostHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPosts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minBid",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "biddingEndTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "highestBid",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "highestBidder",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "ended",
            "type": "bool"
          },
          {
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "confirmPost1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "confirmPost2",
            "type": "address"
          }
        ],
        "internalType": "struct Action.Post[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "recover",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_postId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "data",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]