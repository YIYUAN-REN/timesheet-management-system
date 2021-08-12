import axios from 'axios';
import React from 'react';



class ProfileEdit extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      userId: 1,
      phoneNumber: '',
      email: '',
      fullAddress: '',
      profilePicturePath: '',
      emergencyContacts: [],
      fullname: '',
      avatarlink: '',
      reload: false

    };

    this.fetchProfile();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshPage = this.refreshPage.bind(this);


    //   const data = this.fetchProfile();
    //   this.state.phone = data.phoneNumber;
  }

  componentDidMount() {
    // redirected to 3001
    if (localStorage.getItem("token") == null && this.props.location.search == "") {
      window.location.href = "http://localhost:3001";
    }
    console.log('component did mount');
  }

  refreshPage = () => {
    this.setState(
      { reload: true },
      () => this.setState({ reload: false })
    )
  }

  fetchProfile() {

    const res = axios(
      'http://localhost:9090/profile/getcontact/1').then(response => {

        console.log(response.data.phoneNumber);

        this.setState({ ...this.state, phoneNumber: response.data.phoneNumber });
        this.setState({ ...this.state, email: response.data.email });
        this.setState({ ...this.state, fullAddress: response.data.fullAddress });
        this.setState({ ...this.state, profilePicturePath: response.data.profilePicturePath });
        this.setState({ ...this.state, emergencyContacts: response.data.emergencyContacts });

        let strarr = response.data.profilePicturePath.split('/', 3);

        console.log(strarr[1]);

        let fullavatarlink = 'https://timesheetmanagement6.s3.amazonaws.com/' + strarr[1] + '/' + strarr[2];
        this.setState({ ...this.state, avatarlink: fullavatarlink });
        //  https://timesheetmanagement6.s3.amazonaws.com/avatar0/default.png

        console.log(this.state);

      });




  }

  changePhone(event) {
    this.setState({ ...this.state, phoneNumber: event.target.value });
  }

  changeEmail(event) {
    this.setState({ ...this.state, email: event.target.value });
  }

  changeaddress(event) {
    this.setState({ ...this.state, fullAddress: event.target.value });
  }

  changeprofilePicturePaths(event) {
    this.setState({ ...this.state, profilePicturePath: event.target.value });
  }

  changeContact(e, index, field) {
    let stateCopy = this.state;


    stateCopy.emergencyContacts[index][field] = e.target.value;

    this.setState(stateCopy);

  }




  handleSubmit(event) {

    let stateCopy = this.state;
    console.log(stateCopy);


    alert('A form was submitted: ');
    event.preventDefault();



    var bodyFormData = new FormData();
    bodyFormData.append('id', 1);
    bodyFormData.append('phoneNumber', this.state.phoneNumber);
    bodyFormData.append('email', this.state.email);
    bodyFormData.append('fullAddress', this.state.fullAddress);
    bodyFormData.append('profilePicturePath', this.state.profilePicturePath);
    bodyFormData.append('emergencyContacts', this.state.emergencyContacts);
    console.log(bodyFormData);

    var object = {};
    bodyFormData.forEach(function (value, key) {
      object[key] = value;
    });
    var jsonToSend = JSON.stringify(object);

    axios({
      method: "put",
      url: "http://localhost:9090/profile/editcontact",
      data: JSON.stringify(stateCopy),
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {


        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });


      const data = new FormData()
    data.append('title', 'avatar');
    data.append('userId', this.state.userId);
    data.append('file', this.state.selectedFile);

    console.log(data);

    axios.post("http://localhost:9090/file/uploadfile", data, {   //------------url needs to be changed later
      // receive two    parameter endpoint url ,form data
    })
      .then(res => { // then print response status
        console.log(res);
        this.refreshPage();
        window.location.reload();
      })





  }


  onFileClickHandler = () => {
    const data = new FormData()
    data.append('title', 'avatar');
    data.append('userId', this.state.userId);
    data.append('file', this.state.selectedFile);
  }

    onFileChangeHandler = event => {

      console.log(event.target.files[0])

      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })

    }
  

  onFileClickHandler = () => {
    const data = new FormData()
    data.append('title', 'avatar');
    data.append('userId', this.state.userId);
    data.append('file', this.state.selectedFile);

    console.log(data);

    axios.post("http://localhost:9090/file/uploadfile", data, {   //------------url needs to be changed later
      // receive two    parameter endpoint url ,form data
    })
      .then(res => { // then print response status
        console.log(res);
        this.refreshPage();
        window.location.reload();
      })



  }

  //-------------------------------Toby's  fileupload end----------------





  render() {
    return (
      <div container="container" class="page-section portfolio">
        <div class="row">
          <div class="col-3">
            <h4>Your Profile</h4>
            <img src={this.state.avatarlink} alt="profile" class="img-thumbnail"></img>



            {/* Toby's file upload start */}
            <input type="file" name="file" onChange={this.onFileChangeHandler} /> 
            {/* <button type="button" class="btn btn-success btn-block" onClick={this.onFileClickHandler}>Upload</button> */}
            {/* Toby's file upload end */}
          </div>
          <div class="col-4">
            <form onSubmit={this.handleSubmit}>


              <div class="form-floating mb-3"><input type="text" class="form-control" value={this.state.phoneNumber} onChange={(e) => this.changePhone(e)} /></div>
              <div class="form-floating mb-3"><input type="text" class="form-control" value={this.state.email} onChange={(e) => this.changeEmail(e)} /></div>
              <div class="form-floating mb-3"><textarea type="text" class="form-control" value={this.state.fullAddress} onChange={(e) => this.changeaddress(e)} /></div>
              <label >
                <h4>Emergency Contacts</h4>


              </label>

              {this.state.emergencyContacts.map((contact, index) =>
                <div>
                  <h6>Emergency Contact {index + 1} </h6>
                  <div class="form-floating mb-3">First Name: <input type="text" class="form-control" value={contact.firstName} onChange={(e) => this.changeContact(e, index, "firstName")} /> </div>
                  <div class="form-floating mb-3">Last Name: <input type="text" class="form-control"  value={contact.lastName} onChange={(e) => this.changeContact(e, index, "lastName")} /> </div>
                  <div class="form-floating mb-3">Phone: <input type="text" class="form-control" value={contact.phone} onChange={(e) => this.changeContact(e, index, "phone")} /> </div>



                </div>
              )}



              <input class="btn btn-primary btn-xl " type="submit" value="Submit" />



            </form>
          </div>
        </div>
      </div>
    );
  }



}

export default ProfileEdit;
