import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import './App.css';

export default function Search() {
  const [searchTxt, setSearchTxt] = useState("");
  const [appId, setAppId] = useState("");
  const initalFormFields = { appId: "", appName: "", host: "", portNo: "", schema: "", db: "", userName: "", password: ""};
  const [appIdDisplay, setAppIdDisplay] = useState("");
  const [searchStack, setSearchStack] = useState([]);
  const [searchQAArr, setSearchQAArr] = useState([]);
  const [onboarding, setOnboarding] = useState(false);
  const [radSelected, setRadSelected] = useState("");
  const [formFields, setFormFields] = useState(initalFormFields);
    const arrRef = useRef(null);

  useEffect(()=> {
    if(searchQAArr.length > 0) {
        console.log("re render ui");
    }
  }, [searchQAArr]);

  const handleValueChange = (e) => {
    console.log("in handle value change: ", e);
    setSearchTxt(e.target.value);
  }
  const handleInputChange = (e) => {
    console.log("in handle input change: ", e);
    const formdetails = {...formFields};
    if(e.target.name === 'appId')
      formdetails.appId = e.target.value;
    else if(e.target.name === 'appName')
      formdetails.appName = e.target.value;
    else if(e.target.name === 'host')
    formdetails.host = e.target.value;
    else if(e.target.name === 'portNo')
    formdetails.portNo = e.target.value;
  else if(e.target.name === 'userName')
  formdetails.userName = e.target.value;
else if(e.target.name === 'password')
formdetails.password = e.target.value;
else if(e.target.name === 'db')
formdetails.db = e.target.value;
else if(e.target.name == 'schema')
formdetails.schema = e.target.value;
    // formFields[e.target.name] = e.target.value;
   setFormFields({...formdetails});
    console.log("form details are: ", formdetails);
  }

  const handleAppIdChange = (e) => {
    console.log("in handle value change: ", e);
    setAppId(e.target.value);
    setAppIdDisplay(true);
  }

  const postSearchResults = () => {
    const url = "http://localhost:8080/ai/dbquery";
    const body = { appId: appId, userMessage: searchTxt};
    let arr = searchQAArr;
    arr.push({id: arr.length, question: searchTxt, answer: "test", appId: appId}); // remove when calling api
    arr.reverse(); // remove when calling api
    setSearchQAArr(arr); // remove when calling api 
    
    console.log("in post search results: ", arr);
    // axios.post(url, body)
    // .then((response) => {
    //   console.log("response is: ", response);
    //   const resp = response.data.completion;
    //   arr.push({id: arr.length, question: searchTxt, answer: resp});
    //   arr.reverse();
    //   setSearchQAArr(arr);
    // })
    // .catch((error) => {
    //   console.log("error response is: ", error);
    //   arr.push({id: arr.length, question: searchTxt, answer:error});
    //   arr.reverse();
    //   setSearchStack(arr);
    // });
    setSearchTxt("");
  }

  const handleSearch = () => {
    console.log("in handle search");
    let arr = searchStack;
     console.log("in search: ", arr, searchStack);
     arr.push(searchTxt);
     setSearchStack(arr);

    // calling search api
    postSearchResults();
  }

  const handleReset = () => {
    console.log("in handle reset");
    setSearchTxt("");
    setAppId("");
    setAppIdDisplay(false);
    setSearchStack([]);
    setSearchQAArr([]);
  }

  const onboardingClicked = () => {
    setOnboarding(true);
  }

  const handleClose = () => {
    setOnboarding(false);
  }

  const verifyConnection = () => {
    alert("Connected Successfully");
    // db connectivity api
    const dbConnectUrl = "http://localhost:8080/connectivity/db";
    const verifyPayload =  {"host": formFields.host, "port": formFields.portNo, "schemaName": formFields.schema, 
      "databaseProvider": formFields.db, "userName": formFields.userName, "password": formFields.password};
    axios.post(dbConnectUrl, verifyPayload)
    .then((response) => {
      console.log("response is: ", response);
    })
    .catch((error) => {
      console.log("error response is: ", error);
    });
  }

  const handleSubmit = () => {
    console.log("in handle submit");
    // onboard api
    const onboardUrl = "http://localhost:8080/onboard";
    const onboardPayload =  {
      "appId": formFields.appId, 
      "appName": formFields.appName,
      "dbConnectionDetails": {
         "host": formFields.host, 
         "port": formFields.portNo, 
         "schemaName": formFields.schema, 
         "databaseProvider": formFields.db, 
         "userName": formFields.userName, 
         "password": formFields.password
        }
      };
    axios.post(onboardUrl, onboardPayload)
    .then((response) => {
      console.log("response is: ", response);
    })
    .catch((error) => {
      console.log("error response is: ", error);
    });
  }

  const handleCancel = () => {
    console.log("cancelled");
    setRadSelected("");
    setFormFields(initalFormFields)
  }

  const handleRadioBtnChange = (e) => {
    console.log("in handle radio btn change :", e)
    setRadSelected(e.target.value);
  }

  return (
    <div className="App" style={{width: '80%'}}>

      <h1>Smart Query Builder</h1>

      <div> 
      <select className="item" value={appId} onChange={handleAppIdChange} disabled={appIdDisplay}
      style={{width: '200px', height: '100px', alignContent: "right"}}>
      <option value="none">Select an application</option>
      <option value="vantage">Vantage</option>
      <option value="WCA">WCA</option>
      <option value="wima">WIMA</option>
      </select>

      <button style={{alignContent: "left"}} onClick={onboardingClicked}>
        Onboarding
      </button>
      </div>

      <input style={{width: '80%', padding: '5px' }}
      placeholder="Enter the text to Search"
      name="searchTxt"
      value={searchTxt}

      onChange={handleValueChange} />
      <div>
      <button name="searchBtn" onClick={handleSearch} style={{padding: '5px', marginRight: '20px', width: '30%'}}>Search</button>
      <button name="resetBtn" onClick={handleReset} style={{padding: '5px', width: '30%'}}>Reset</button>
      </div>

      {searchQAArr.length > 0 && (
        <>
          <h3>Search Results for {appId} - {searchQAArr.length}</h3>
          {searchQAArr.reverse().map((item, index) => {
            return (<div>
<ul><strong>
<span style={{display: 'flex', flexDirection: 'row'}}> {index+1 } {" . "} {item.question}</span></strong>
    
    <li style={{display: 'flex', flexDirection: 'row'}}>{item.answer}</li>
    </ul>            </div>)
            
          })}
        </>
      )}

      {onboarding && <div>
        <Dialog onClose={handleClose} open={onboarding}>
      <DialogTitle>On Boarding New Application</DialogTitle>
      <div style={{ paddingLeft: '20px', paddingBottom: '10px'}}>
        <label style={{fontSize: '13px'}}>Application ID</label>
        <input className="input" name="appId" label="Application ID" placeholder="Enter Application ID"
        onChange={handleInputChange} value={formFields.appId}></input>
        </div>
        <div style={{ paddingLeft: '20px', paddingBottom: '10px'}}>
          
        <label style={{fontSize: '13px'}}>Application Name</label>
        <input className="input" name="appName" label="Application Name" 
        placeholder="Enter Application Name"
        onChange={handleInputChange} value={formFields.appName}></input>
        </div>
        <div style={{ paddingLeft: '20px', paddingBottom: '10px', fontSize: '13px'}}>
        Select any one option</div>
      <div style={{ paddingLeft: '20px', paddingBottom: '5px', display: 'inline-block'}}> 
      <label style={{fontSize: '13px'}}>
            <input
              type="radio"
              value="Upload"
              checked={radSelected === "Upload"}
              onChange={handleRadioBtnChange}
             label="Upload"
            />
            Upload
            </label>
      </div>
      <div style={{ paddingLeft: '20px', paddingBottom: '10px', display: 'inline-block'}}>
        <label style={{fontSize: '13px'}}>
            <input type="radio" value="Database" checked={radSelected === "Database"} label="Database"
            onChange={handleRadioBtnChange}/>
          DB
          </label>
        </div>
        {radSelected === "Upload" && 
          <>
          <div>
            <hr/>
          <label style={{width: '100%', paddingLeft: '10px'}}>Choose a file to upload</label>
          <input type="file" id="fileUpload" name="fileUpload" style={{width: '100%', padding: '10px'}} accept="txt"></input>
        </div>
        <DialogActions>
        <hr/>

        <div style={{display: 'flex'}}>
          <button name="btnSubmit" onClick={handleSubmit}>Submit</button>
          <button name="btnCancel" onClick={handleCancel}>Cancel</button>
        </div>
      </DialogActions>
        </>
        }
        {radSelected === "Database" && <div>
<hr/>
      <DialogContentText style={{ padding: '10px'}}><b>Database Details</b></DialogContentText>
      <DialogContent>

      <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
        <label style={{ fontSize: '13px'}}>DB Provider</label>
        <select className="input" name="db" value={formFields.db} onChange={handleInputChange}>
        <option value="none">Select</option>
      <option value="oracle">Oracle</option>
      <option value="mySql">My SQL</option>
      <option value="mongodb">Mongo</option>
        </select>
        </div>
        <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
          <label style={{fontSize: '13px'}}>Host Name</label>
        <input className="input" name="host" label="Host" placeholder="Enter Host Name" 
        onChange={handleInputChange} value={formFields.host}></input>
        </div>
        <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
          <label style={{ fontSize: '13px'}}>Port No</label>
        <input className="input" name="portNo" label="Port" placeholder="Enter Port Number"
        onChange={handleInputChange} value={formFields.portNo}></input>
        </div>
        <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
          <label style={{fontSize: '13px'}}>Database</label>
        <input className="input" name="schema" label="Database" placeholder="Enter Database Name"
        onChange={handleInputChange} value={formFields.schema}></input>
        </div>
        <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
          <label style={{ fontSize: '13px'}}>UserName</label>
        <input className="input" name="userName" label="UserName" placeholder="Enter User Name"
        onChange={handleInputChange} value={formFields.userName}></input>
        </div>
        <div style={{ paddingLeft: '15px', paddingBottom: '5px'}}>
          <label style={{fontSize: '13px'}}>Password</label>
        <input className="input" name="password" label="Password" placeholder="Enter Password"
        onChange={handleInputChange} value={formFields.password}></input>
        </div>
        
      </DialogContent>
      <DialogActions>

      <div>
          <button name="btnVerify" onClick={() => verifyConnection()}>Verify Connection</button>
        </div>
        <hr/>

        <div style={{display: 'flex'}}>
          <button name="btnSubmit" >Submit</button>
          <button name="btnCancel" onClick={handleCancel}>Cancel</button>
        </div>
      </DialogActions>
          </div>}
      </Dialog>
        </div>}
    </div>
  );
}
