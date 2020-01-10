import { keyBy } from 'lodash'

import { ipfs } from '../utils/ipfs'

import {
  GET_PETS,
  GET_PETS_SUCCESS,
  GET_PET,
  UPLOAD_PET,
  UPLOAD_PET_SUCCESS,
  SET_ERROR,
  ADOPT_PET,
} from '../utils/types'

// Get all pets
export const getPets = () => async (dispatch, getState) => {
  dispatch({ type: GET_PETS })

  const web3State = getState().web3

  // Retrieve pet state from local storage
  const localData = localStorage.getItem(web3State.account)
  const localPets = localData ? JSON.parse(localData) : []
  const petsByIndex = keyBy(localPets, 'index')

  const pets = []
  try {
    const count = await web3State.contractInstance.getPetCount.call(
      web3State.account,
      {
        from: web3State.account,
      }
    )
    const petCount = count.toNumber()

    for (let index = 0; index < petCount; index++) {
      const petResult = await web3State.contractInstance.getPet.call(
        web3State.account,
        index,
        {
          from: web3State.account,
        }
      )

      // pet for UI
      const pet = {
        ...petsByIndex[index],
        index,
        ipfsHash: petResult[0],
        name: petResult[1],
        location: petResult[2],
        breed: petResult[3],
        age: petResult[4],
        isAdopted: ''+petResult[5] + '',
        uploadedOn: convertTimestampToString(petResult[6]),
      }
      pets.push(pet)
    }

    // Save pet state to local storage
    localStorage.setItem(web3State.account, JSON.stringify(pets))

    dispatch({ type: GET_PETS_SUCCESS, payload: pets })
  } catch (error) {
    console.log('error', error)
    dispatch({ type: SET_ERROR, payload: error })
  }
}

export const adoptPet = (aa) => async (dispatch, getState) => {

  dispatch({ type: ADOPT_PET })

  const web3State = getState().web3
  const contractInstance = web3State.contractInstance

  try {
        // Success, upload IPFS and metadata to the blockchain
        const txReceipt = await contractInstance.adoptPet(
          web3State.account,
          aa,
          {
            from: web3State.account,
          }
        )

        console.log('updated pet', txReceipt)

    getPets(dispatch,getState);
  } catch (error) {
    console.log('error', error)
    dispatch({ type: SET_ERROR, payload: error })
  }
}

// upload an pet
export const uploadPet = (
  buffer,
  name,
  location,
  breed,
  age,
  history
) => async (dispatch, getState) => {
  dispatch({ type: UPLOAD_PET })

  // Add pet to IPFS
  ipfs.files.add(buffer, async (error, result) => {
    if (error) {
      console.log('ERR', error)
      dispatch({
        type: SET_ERROR,
        payload: {
          error,
        },
      })
    } else {
      const ipfsHash = result[0].hash // base58 encoded multihash
      ipfs.files.get(ipfsHash, (error, files) => {
        console.log(files)
      })

      const web3State = getState().web3
      const contractInstance = web3State.contractInstance
      try {
        // Success, upload IPFS and metadata to the blockchain
        const txReceipt = await contractInstance.uploadPet(
          ipfsHash,
          name,
          location,
          breed,
          age,
          {
            from: web3State.account,
          }
        )

        console.log('uploadPet tx receipt', txReceipt)

        const {
          blockHash,
          blockNumber,
          transactionHash,
          transactionIndex,
          cumulativeGasUsed,
          gasUsed,
        } = txReceipt.receipt

        // Determine index based on length of pets array; otherwise,
        // would need to call contract to get length
        const index = getState().pet.pets.length
          ? getState().pet.pets.length
          : 0

        const newPet = {
          index,
          ipfsHash,
          name,
          location,
          breed,
          age,
          isAdopted: false,
          uploadedOn: 'Pending',
          blockHash,
          blockNumber,
          transactionHash,
          transactionIndex,
          cumulativeGasUsed,
          gasUsed,
        }

        // Update persisted state in local storage
        const localData = localStorage.getItem(web3State.account)
        const localPets = localData ? JSON.parse(localData) : []
        localPets.push(newPet)
        localStorage.setItem(web3State.account, JSON.stringify(localPets))

        dispatch({
          type: UPLOAD_PET_SUCCESS,
          payload: newPet,
        })
      } catch (error) {
        console.log('ERR', error)
        dispatch({
          type: SET_ERROR,
          payload: {
            error,
          },
        })
        throw error
      }
    }
  })
}

// Get pet by index
export const getPet = (index) => ({ type: GET_PET, payload: index })

const convertTimestampToString = (timestamp) => {
  let tempDate = timestamp.toNumber()
  return tempDate !== 0 ? new Date(tempDate * 1000).toString() : null
}
