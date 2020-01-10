pragma solidity >=0.4.21 <0.6.0;

contract PetAdoption {

    struct Pet {
        string ipfsHash;        
        string name;          
        string location;    
        string breed;           
        string age;
        bool isAdopted;
        uint256 uploadedOn;     
    }

    mapping (address => Pet[]) public pets;

    bool private stopped = false;

    event LogPetUploaded(
        address indexed _owner, 
        string _ipfsHash, 
        string _name, 
        string _location, 
        string _breed,
        string _age,
        bool _isAdopted,
        uint256 _uploadedOn
    );

     event LogPetAdopted(
        address indexed _owner, 
        string _ipfsHash, 
        string _name, 
        string _location, 
        string _breed,
        string _age,
        bool _isAdopted,
        uint256 _uploadedOn
    );

    event LogEmergencyStop(
        address indexed _owner, 
        bool _stop
    );

    modifier stopInEmergency { 
        require(!stopped); 
        _;
    }

    function() external {}

    function uploadPet(
        string memory _ipfsHash, 
        string memory _name, 
        string memory _location, 
        string memory _breed,
        string memory _age
    ) public stopInEmergency returns (bool _success) {
            
        require(bytes(_ipfsHash).length == 46);
        require(bytes(_name).length > 0 && bytes(_name).length <= 256);
        require(bytes(_location).length < 1024);
        require(bytes(_breed).length > 0 && bytes(_breed).length <= 256);
        require(bytes(_age).length < 1024);

        uint256 uploadedOn = now;
        bool _isAdopted = false;
        Pet memory pet = Pet(
            _ipfsHash,
            _name,
            _location,
            _breed,
            _age,
            _isAdopted,
            uploadedOn
        );

        pets[msg.sender].push(pet);

        emit LogPetUploaded(
            msg.sender,
            _ipfsHash,
            _name,
            _location,
            _breed,
            _age,
            _isAdopted,
            uploadedOn
        );

        _success = true;
    }

    function getPetCount(address _owner) 
        public view 
        stopInEmergency 
        returns (uint256) 
    {
        require(_owner != address(0));
        return pets[_owner].length;
    }

    function getPet(address _owner, uint8 _index) 
        public stopInEmergency view returns (
        string memory _ipfsHash, 
        string memory _name, 
        string memory _location, 
        string memory _breed,
        string memory _age,
        bool isAdopted,
        uint256 _uploadedOn
    ) {

        require(_owner != address(0));
        require(_index >= 0 && _index <= 2**8 - 1);
        require(pets[_owner].length > 0);

        Pet storage pet = pets[_owner][_index];
        
        return (
            pet.ipfsHash, 
            pet.name, 
            pet.location, 
            pet.breed, 
            pet.age,
            pet.isAdopted,
            pet.uploadedOn
        );
    }

    function adoptPet(address _owner, uint8 _index) 
        public stopInEmergency returns (
        bool _success
    ) {

        require(_owner != address(0));
        require(_index >= 0 && _index <= 2**8 - 1);
        require(pets[_owner].length > 0);

        pets[_owner][_index].isAdopted = true;
        
        emit LogPetAdopted(
            _owner,
            pets[_owner][_index].ipfsHash,
            pets[_owner][_index].name,
            pets[_owner][_index].location,
            pets[_owner][_index].breed,
            pets[_owner][_index].age,
            pets[_owner][_index].isAdopted,
            pets[_owner][_index].uploadedOn
        );

        _success = true;
    }
}
