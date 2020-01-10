import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PetItem extends Component {
  static propTypes = {
    pet: PropTypes.object.isRequired,
  }

  render() {
    const {
      ipfsHash,
      name,
      location,
      breed,
      age,
      isAdopted,
    } = this.props.pet

  

    return (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow">
        <div className="card-body">
            <h5 className="card-title">{name}</h5>
            </div>
          <img
            className="card-img-top"
            src={`https://ipfs.io/ipfs/${ipfsHash}`}
            alt="Card"
          />
          <div className="card-body">
            <p className="card-text"><b>Location: </b> {location}</p>
            <p className="card-text"><b>Breed: </b> {breed}</p>
            <p className="card-text"><b>Age: </b> {age}</p>
            
            <hr />
            <div>
              <strong>IPFS Hash</strong>
              <p>
                <span className="text-muted">{ipfsHash}</span>
              </p>
            </div>
            <button 
              className="btn btn-default" 
              disabled={isAdopted === 'true'}
              onClick={this.props.clicked}>
              {isAdopted === 'true'
                ? 'SUCCESS'
                : 'ADOPT'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default PetItem
