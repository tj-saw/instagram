import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { database, storage, auth } from "./firebase";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
      emailInputValue: "",
      passwordInputValue: "",
      newAccountEmailInputValue: "",
      newAccountPasswordInputValue:"",
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }
  //OLD FUNCTIONALITY TO WRITE TO MESSAGE DATABASE
  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, this.state.textInputValue);
  // };

  handleFileChange(event) {
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });

  }

  handleSubmit(event) {
    // Prevent default form submit behaviour that will reload the page
    event.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(storage, `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`);
    
    // Upload file, save file download URL in database with post text
    // (Additional functionality added later to upload the file)
    uploadBytes(fileRef, this.state.fileInputFile).then(()=>{
      getDownloadURL(fileRef).then((downloadURL)=>{
        console.log("New File Creation Success!")
        const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
          imageLink: downloadURL,
          text: this.state.textInputValue
        });
        // Reset input field after submit
        this.setState({
          fileInputFile: null,
          fileInputValue:"",
          textInputValue: "",
        })
      })
    })    

    // uploadBytes(fileRef, this.state.fileInputFile).then((snapshot) => {console.log('Uploaded a blob or file!');});

    // this.writeData();
    // console.log("Submit working");
  }

  handleSignInEmailChange = (e) => {
    this.setState( { emailInputValue: e.target.value});
  };

  handleSignInPasswordChange = (e) => {
    this.setState({ passwordInputValue: e.target.value});
  };

  handleNewAccountEmailChange  = (e) => {
    this.setState({newAccountEmailInputValue: e.target.value});
  };

  handleNewAccountPasswordChange  = (e) => {
    this.setState({newAccountPasswordInputValue: e.target.value});
  };

  handleSignInSubmit = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, this.state.emailInputValue, this.state.passwordInputValue)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  handleNewAccountCreationSubmit = (e) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, this.state.emailInputValue, this.state.passwordInputValue)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    messageListItems.reverse();
    // Reverse the order of the posts so most recent is above
    return (
      <div className="App">
      <form onSubmit = {this.handleNewAccountCreationSubmit}>
        <input
          type = "email"
          placeholder = "Email"
          value = {this.state.emailInputValue}
          onChange = {this.handleSignInEmailChange}
        />
        <input 
          type = "password"
          placeholder = "Password"
          value = {this.state.passwordInputValue}
          onChange = {this.handleSignInPasswordChange}
        />
        <input 
          type="submit"
          value = "Login"
          />
      </form>
        {/* Upload form from Upload.js */}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <label>
              Message:
              <input 
                type="text" 
                value={this.state.textInputValue} 
                onChange={(e) => this.setState({ textInputValue: e.target.value })} 
                />
            </label>
            <label>
            <input
              type="file"
              // Set state's fileInputValue to "" after submit to reset file input
              value={this.state.fileInputValue}
              onChange={(e) =>
                // e.target.files is a FileList object that is an array of File objects
                // e.target.files[0] is a File object that Firebase Storage can upload
                this.setState({ 
                  fileInputFile: e.target.files[0],
                  fileInputValue: e.target.value
                  })
              }
            />
            </label>
            <input type="submit" value="Submit"/>
           </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
