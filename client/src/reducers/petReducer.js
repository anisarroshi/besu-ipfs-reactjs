import { keyBy } from 'lodash'

import {
  GET_PETS,
  GET_PETS_SUCCESS,
  GET_PET,
  SET_ERROR,
  UPLOAD_PET,
  UPLOAD_PET_SUCCESS,
} from '../utils/types'

const initialState = {
  pets: null,
  pet: null,
  loading: false,
  error: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PETS:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_PETS_SUCCESS:
      const petsByIndex = keyBy(state.pets, 'index')
      const updatedPets = action.payload.map((pet) => {
        const updatedPet = { ...petsByIndex[pet.index], ...pet }
        return updatedPet
      })
      return {
        ...state,
        loading: false,
        pets: updatedPets,
        error: null,
        pet: null,
      }
    case GET_PET:
      return {
        ...state,
        loading: false,
        pet: state.pets ? state.pets[action.payload] : null,
        error: null,
      }
    case UPLOAD_PET:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case UPLOAD_PET_SUCCESS:
      return {
        ...state,
        pets: [...state.pets, action.payload],
        loading: false,
        error: null,
      }
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
