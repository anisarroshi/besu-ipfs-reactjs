import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Spinner from '../utils/Spinner'
import PetItem from './PetItem'
import { getPets } from './petActions'
import { adoptPet } from './petActions'

class Pets extends Component {
  static propTypes = {
    getPets: PropTypes.func.isRequired,
    pet: PropTypes.object.isRequired,
  }

  componentDidMount = () => {
    this.props.getPets()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.pet.pets !== nextProps.pet.pets
  }

  togglePersonsHandler = (item) => {
    alert(item);
  };

  adoptPet = async (item) => { 
    try {
      await this.props.adoptPet(item)
      console.log('pet updated sucessfully');
      window.location.reload();

    } catch (error) {
      alert(error)
    }
  }

  render() {
    let { pets, loading } = this.props.pet
    let petItems

    if (pets === null || loading) {
      petItems = <Spinner />
    } else {
      if (pets.length > 0) {
        petItems = pets.map((pet) => (
          <PetItem key={pet.index} pet={pet} clicked={() => this.adoptPet(pet.index)} />
        ))
      } else {
        petItems = <h4>No pets found</h4>
      }
    }

    return (
      <div>
        <div className="row">
              <div className="col-xs-12 col-sm-12 col-lg-12 col-sm-push-2">
                <h1 className="text-center">Pete's Pet Shop</h1>
                <br/>
              </div>
            </div>
        <section>
          <div className="container">
            <p>
              <Link to="/uploadPet" className="btn btn-primary my-2">
                Add Pet
              </Link>
            </p>
          </div>
        </section>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">{petItems}</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  web3: state.web3,
  pet: state.pet,
})

export default connect(
  mapStateToProps,
  { adoptPet, getPets  }
)(Pets)
