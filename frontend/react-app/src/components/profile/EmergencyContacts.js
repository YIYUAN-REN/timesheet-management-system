
 

function EmergencyContacts(props) {

    const contacts = props.contacts;

 

    const changeNames= (e)=>{

        let fullName = e.target.value;
        
        let nameArray = fullName.split(",",2);

        console.log(nameArray);
    
    
    }




const listcontacts = contacts.map((contact,index) =>
 <div>
     <p>Emergency Contact {index+1} </p>

     <li key = {index} ><input type="text" value={ props.currentState.emerContacts[index].firstName } onChange={e=>{ props.changeContact(index,e) }} /></li> 
     <li key = {index} ><input type="text" value={contact.phone} /></li>
 
</div>
);



    return (
        <div>
             <ul>{listcontacts}</ul>
        </div>
    )
}

 
