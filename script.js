console.log("hey");
import { ethers } from "./ethers.esm.min.js";
import { NFTStorage } from "nft.storage";

//tasks:
// first,  get the contract address from the connect wallet button
// second, create a wallet instance using the contract address, contract abi and signer
// third, get the cid from the searchStudent function of the contract
// fourth, from the cid, get the various properties
// fifth, display the properties in the html

//task 1
const contractAddress = "0x558E9295D8b87bf363094ef2fDA5Cb034920FF7c";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NotUniAccessDenied",
    type: "error",
  },
  {
    inputs: [],
    name: "StudentDoesNotExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_acc",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "AddedStudent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_acc",
        type: "address",
      },
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "addStudent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "i_uniAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_acc",
        type: "address",
      },
    ],
    name: "searchStudent",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_acc",
        type: "address",
      },
    ],
    name: "studentExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let walletAddress;
let metadata;
let photo;
let imageP;
//connecting wallet
const connectBtn = document.querySelector(".connect-btn");
connectBtn.addEventListener("click", async () => {
  await connect();
});

//task 2
// need provider, signer, contract details for creating the instance

const connect = async () => {
  //connecting to the wallet
  if (window.ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected to metamask!");
    console.log(window.ethereum);
    walletAddress = window.ethereum.selectedAddress;
    console.log(`Connected Wallet Address: ${walletAddress}`);

    connectBtn.innerHTML = "Connected";
  } else {
    connectBtn.innerHTML = "Please download Metamask extension";
  }

  //getting provider, signer and contract instance
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log(provider);

  // const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
  const signer = provider.getSigner();
  // console.log(signer);

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  // console.log(contract);

  //task 3 - got the wallet address and the contract instance, now getting the cid
  const cid = await contract.searchStudent(walletAddress);
  console.log(`Associated cid: ${cid}`);

  // await fetch(`https://api.nft.storage/${cid}`, {
  //   headers: {
  //     Authorization: `Bearer ${import.meta.env.VITE_NFTSTORAGE_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  // })
  await fetch(`https://nftstorage.link/ipfs/${cid}?format=dag-json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      metadata = data.properties;
      photo = data.image;
      if (!data.properties) {
        throw new Error("Metadata not found in response.");
      }
      // console.log(metadata);
    })
    .catch((error) => console.error(error));

  //now displaying the properties in the html
  const rollNumber = document.getElementById("roll-no");
  const dob = document.getElementById("dob");
  const branch = document.getElementById("branch");
  const college = document.getElementById("college");
  const name = document.getElementById("name");
  const image = document.getElementById("image");

  //image part

  await fetch(`https://nftstorage.link/ipfs/${photo["/"]}?format=dag-json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      imageP = data.Links[0].Name;
      if (!data) {
        throw new Error("Metadata not found in response.");
      }
      // console.log(metadata);
    })
    .catch((error) => console.error(error));

  rollNumber.innerHTML = metadata.sRollno;
  dob.innerHTML = metadata.sDob;
  branch.innerHTML = metadata.sBranch;
  name.innerHTML = metadata.sName;

  image.src = `https://nftstorage.link/ipfs/${photo["/"]}/${imageP}`;

  // image.src = `https://ipfs.io/ipfs/${photo["/"]}`;
  // image.src = `https://nftstorage.link/ipfs/${metadata.sPhoto["/"]}`;
  // console.log(`https://nftstorage.link/ipfs/${metadata.sPhoto["/"]}`);
};
/*
sAccount: "0x416195cCEb99a3d846900FeDEdeF9D9D3e8c4F3d"
sAddress: "3/462, Malviya Nagar"
sDob: "45"
sName: "klaus"
sPhoto: {/:'bafybeiggaksenzxq6qdwe2hdmdm4b53i5o673livwfhxho3mo2nrm57ecy'}
sRollno: "20uec038"
*/
