import axios from 'axios';
import React from 'react';
 


class ProfileEdit extends React.Component{
 

        constructor(props){
               super(props);
               
                this.state = {

                    phoneNumber : '',
                    email : '',
                    fullAddress:'',
                    profilePicturePath:'',
                    emergencyContacts: []

                };

            this.fetchProfile();

            this.handleSubmit = this.handleSubmit.bind(this);

            

            //   const data = this.fetchProfile();
            //   this.state.phone = data.phoneNumber;
        }

        
 


        fetchProfile() {

            const res =  axios(
                'http://localhost:9090/profile/getcontact/100').then(response =>{

                    console.log(response.data.phoneNumber);

                    this.setState({...this.state, phoneNumber:response.data.phoneNumber});
                    this.setState({...this.state, email:response.data.email});
                    this.setState({...this.state, fullAddress:response.data.fullAddress});
                    this.setState({...this.state, profilePicturePath:response.data.profilePicturePath});
                    this.setState({...this.state, emergencyContacts:response.data.emergencyContacts});

                    console.log(this.state);
 
                });

                
             

        }

          changePhone(event) {
            this.setState({ ...this.state,  phoneNumber: event.target.value});
          }

          changeEmail(event ) {
            this.setState({ ...this.state,email: event.target.value});
          }

          changeaddress(event ) {
            this.setState({ ...this.state,fullAddress: event.target.value});
          }

          changeprofilePicturePaths(event ) {
            this.setState({ ...this.state,profilePicturePath: event.target.value});
          }
        
          changeContact(  e , index , field) {
                let stateCopy = this.state ;
            
               
                 stateCopy.emergencyContacts[index][field] = e.target.value;

                 this.setState(stateCopy);
          
          }

          


          handleSubmit(event) {

            let stateCopy = this.state ;
            console.log(stateCopy);


            alert('A form was submitted: ');
            event.preventDefault();



            var bodyFormData = new FormData();
            bodyFormData.append('id', 100);
            bodyFormData.append('phoneNumber', this.state.phoneNumber);
            bodyFormData.append('email', this.state.email);
            bodyFormData.append('fullAddress', this.state.fullAddress);
            bodyFormData.append('profilePicturePath', this.state.profilePicturePath);
            bodyFormData.append('emergencyContacts', this.state.emergencyContacts);
            console.log(bodyFormData);

            var object = {};
            bodyFormData.forEach(function(value, key){
                object[key] = value;
            });
            var jsonToSend = JSON.stringify(object);

            axios({
                method: "post",
                url: "http://localhost:9090/profile/editcontact",
                data: JSON.stringify(stateCopy),
                headers: { "Content-Type": "application/json" },
              })
                .then(function (response) {
                  //handle success
                  console.log(response);
                })
                .catch(function (response) {
                  //handle error
                  console.log(response);
                });

        // alert('A form was submitted: ' + this.state);

        // fetch('http://localhost:9090/profile/editcontact', {
        //     method: 'POST',
        //     // We convert the React state to JSON and send it as the POST body
        //     body: JSON.stringify(this.state)
        //   }).then(function(response) {
        //     console.log(response)
        //     return response.json();
        //   });
    
        event.preventDefault();

 

          }






render() {
    return (
        <div>
      <form onSubmit={this.handleSubmit}>
      
         
         <div><input type="text" value={this.state.phoneNumber} onChange={ (e) => this.changePhone(e)} /></div> 
         <div><input type="text" value={this.state.email} onChange={(e) => this.changeEmail(e)} /></div> 
         <div><textarea type="text" value={this.state.fullAddress} onChange={(e)=> this.changeaddress(e)} /></div> 
         <label >
         <p>Emergency Contact</p>
          
     
         </label>

       { this.state.emergencyContacts.map( (contact,index) =>
       <div>
          <p>Emergency Contact {index+1} </p>
       <div>First Name: <input type="text" value={contact.firstName} onChange={(e) => this.changeContact(e,index,"firstName")} /> </div>  
       <div>Last Name: <input type="text" value={contact.lastName} onChange={(e) => this.changeContact(e,index,"lastName")} /> </div>  
       <div>Phone: <input type="text" value={contact.phone} onChange={(e) => this.changeContact(e,index,"phone")} /> </div>  
       
       </div>
       ) } 
      


            <input type="submit" value="Submit" />
      </form>

      </div>
    );
  }


}

export default ProfileEdit;
