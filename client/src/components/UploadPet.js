import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import toastr from 'toastr'

import { uploadPet } from './petActions'

class UploadPet extends Component {
  state = {
    name: '',
    location: '',
    breed: '',
    age: '',
    buffer: null,
    file: null,
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  captureFile = (event) => {
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        file: URL.createObjectURL(file),
      })
    }
  }

  handleUploadPet = async (event) => {
    event.preventDefault()
    const { name, location, breed, age, buffer } = this.state
    console.log(name, location, buffer)
    try {
      await this.props.uploadPet(
        buffer,
        name,
        location,
        breed,
        age,
        this.props.history
      )
      toastr.success(
        'Pet uploaded.  It may take a while for MetaMask to respond, the transaction to be mined and the pet to appear in the list.'
      )
    } catch (error) {
      toastr.error(error)
    }

    // return to pet list
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="container">
        <fieldset disabled={this.props.loading}>
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center mt-4">Add Pet</h1>
              <form
                className="needs-validation"
                onSubmit={this.handleUploadPet}
              >
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Name is required.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="Location"
                    value={this.state.location}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Location is required.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="breed">Breed *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="breed"
                    placeholder="Breed"
                    value={this.state.breed}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Breed is required.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="age"
                    placeholder="Age"
                    value={this.state.age}
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Age is required.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="file">Image *</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="file"
                    onChange={this.captureFile}
                    required
                  />
                  <div className="invalid-feedback">Image required.</div>
                </div>
                <div className="mb-3">
                  <Link to="/" className="btn btn-secondary mr-2">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </form>
              {this.state.file && (
                <div className="text-center mt-3 mb-3">
                  <img
                    src={this.state.file}
                    className="img-thumbnail"
                    alt="Preview"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.pet.loading,
})

export default connect(
  mapStateToProps,
  { uploadPet }
)(UploadPet)
