import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import './App.css';
const FormData = require('form-data');

export default function Search() {
  const [searchTxt, setSearchTxt] = useState("");
  const [appId, setAppId] = useState("");
  const initalFormFields = { appId: "", appName: "", host: "", portNo: "", schema: "", db: "", userName: "", password: "" };
  const [appIdDisplay, setAppIdDisplay] = useState("");
  const [searchStack, setSearchStack] = useState([]);
  const [searchQAArr, setSearchQAArr] = useState([]);
  const [onboarding, setOnboarding] = useState(false);
  const [radSelected, setRadSelected] = useState("");
  const [formFields, setFormFields] = useState(initalFormFields);
  const arrRef = useRef(null);
  const [appList, setAppList] = useState({});
  const [dbProviders, setdbProviders] = useState([]);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const metaDataUrl = "http://localhost:8080/cached/metadata";
    // remove below 2 lines when api integration is uncommented
    //     setAppList([{ id: "ems", value: "Employee Management System" }, { id: "vider", value: "Vider Solutions Pvt Ltd" }]);
    //     setdbProviders(["ORACLE", "MY_SQL", "MS_SQL"])
    axios.get(metaDataUrl)
      .then((response) => {
        console.log("response is: ", response);
        setAppList(response.data.onboardedApps); // TODO: check if apps is not loading
        setdbProviders(response.data.databaseProviders); // TODO: check if providers is not loading
      })
      .catch((error) => {
        console.log("error response is: ", error);
      });
  }, []);

  useEffect(() => {
    if (searchQAArr.length > 0) {
      console.log("re render ui");
    }
  }, [searchQAArr]);

  const handleValueChange = (e) => {
    console.log("in handle value change: ", e);
    setSearchTxt(e.target.value);
  }
  const handleInputChange = (e) => {
    console.log("in handle input change: ", e);
    const formdetails = { ...formFields };
    if (e.target.name === 'appId')
      formdetails.appId = e.target.value;
    else if (e.target.name === 'appName')
      formdetails.appName = e.target.value;
    else if (e.target.name === 'host')
      formdetails.host = e.target.value;
    else if (e.target.name === 'portNo')
      formdetails.portNo = e.target.value;
    else if (e.target.name === 'userName')
      formdetails.userName = e.target.value;
    else if (e.target.name === 'password')
      formdetails.password = e.target.value;
    else if (e.target.name === 'db')
      formdetails.db = e.target.value;
    else if (e.target.name == 'schema')
      formdetails.schema = e.target.value;
    // formFields[e.target.name] = e.target.value;
    setFormFields({ ...formdetails });
    console.log("form details are: ", formdetails);
  }

  const handleAppIdChange = (e) => {
    console.log("in handle value change: ", e.target.value);
    setAppId(e.target.value);
    setAppIdDisplay(true);
  }

  const postSearchResults = () => {
    const url = "http://localhost:8080/ai/dbquery";
    const body = { appId: appId, userMessage: searchTxt };
    let arr = searchQAArr;
   /* setTimeout(() => {
      arr.push({ id: arr.length, question: searchTxt, answer: "test", appId: appId }); // remove when calling api
     // arr.reverse(); // remove when calling api
     // setSearchQAArr(arr); // remove when calling api  
     setIsLoading(false);
     let sortedArr = arr.sort((a,b) => a.id - b.id).map((x, index, array) => x);
     sortedArr.reverse();
     setSearchQAArr(sortedArr);
     console.log("in post search results: ", arr, sortedArr);
    }, 2000);*/

    axios.post(url, body)
      .then((response) => {
        console.log("response is: ", response);
        const resp = response.data.completion;
        arr.push({ id: arr.length, question: searchTxt, answer: resp });
        let sortedArr = arr.sort((a,b) => a.id - b.id).map((x, index, array) => x);
        sortedArr.reverse();
        setSearchQAArr(sortedArr);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error response is: ", error);
        arr.push({ id: arr.length, question: searchTxt, answer: error });
        let sortedArr = arr.sort((a,b) => a.id - b.id).map((x, index, array) => x);
        sortedArr.reverse();
        setSearchQAArr(sortedArr);
        setIsLoading(false);
      });
    setSearchTxt("");
  }

  const handleSearch = () => {
    console.log("in handle search");
    setIsLoading(true);
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
    // db connectivity api
    const dbConnectUrl = "http://localhost:8080/connectivity/db";
    const verifyPayload = {
      "host": formFields.host, "port": formFields.portNo, "schemaName": formFields.schema,
      "databaseProvider": formFields.db, "userName": formFields.userName, "password": formFields.password
    };
    axios.post(dbConnectUrl, verifyPayload)
      .then((response) => {
        console.log("response is: ", response);
        alert(response.data);
      })
      .catch((error) => {
        console.log("error response is: ", error);
      });
  }

  const callMetaData = () => {
    const metaDataUrl = "http://localhost:8080/cached/metadata";
    axios.get(metaDataUrl)
      .then((response) => {
        console.log("response is: ", response);
        setAppList(response.data.onboardedApps);
        setdbProviders(response.data.databaseProviders);
      })
      .catch((error) => {
        console.log("error response is: ", error);
      });

  }

  const handleSubmit = () => {
    console.log("in handle submit");
    // onboard api
    const onboardUrl = "http://localhost:8080/onboard";
    const onboardPayload = {
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
        callMetaData();
        setOnboarding(false);
      })
      .catch((error) => {
        console.log("error response is: ", error);
        setOnboarding(true);
      });
  }

  const handleCancel = () => {
    console.log("cancelled");
    setRadSelected("");
    setFormFields(initalFormFields)
  }
  const handleFileChange = (e) => {
    console.log("file change event", e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const handleUpload = () => {
    // upload api
    console.log("form data is: ", FormData);
    const uploadUrl = "http://localhost:8080/onboard/upload?appId=" + formFields.appId;
    // const uploadPayload = {
    //   "formdata": [
    //     {
    //       "key": "file",
    //       "type": "file",
    //       "src": "/Users/spallyaomar/Documents/Wells Fargo POC/smart-query-builder/api/sqb-api/src/main/resources/docs/db-schema.txt"
    //     }
    //   ],
    // };
    // axios.post(uploadUrl, uploadPayload)
    //   .then((response) => {
    //     console.log("response is: ", response);
    //     alert(response.data);
    //   })
    //   .catch((error) => {
    //     console.log("error response is: ", error);
    //     alert("Error occured while upload, please try again");
    //   });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(uploadUrl, formData, config).then((response) => {
      console.log(response.data);
      alert("File Uploaded Successfully")
    }).catch((error) => {
      console.log("error response is: ", error);
      alert("Error occured while upload, please try again");
    });

  }

  const handleRadioBtnChange = (e) => {
    console.log("in handle radio btn change :", e)
    setRadSelected(e.target.value);
  }

  return (
    <div className="App" style={{ width: '90%' }}>
      { isLoading && (
      <div className="spin" id="loader"></div>)}
      <div>
        <select className="item" value={appId} onChange={handleAppIdChange} disabled={appIdDisplay}
          style={{ width: '30%', alignContent: "right", float: 'left', marginTop: "5px"}}>
          <option value="none">Select an application</option>
          {appList.length > 0 && appList.map((x) => (<option value={x.id}>{x.value}</option>))}
          {/* <option value="vantage">Vantage</option>
          <option value="WCA">WCA</option>
          <option value="wima">WIMA</option> */}
        </select>

        <button style={{ float: 'right', width: '30%' }} onClick={onboardingClicked}>
          Onboarding
        </button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>InferQ</h1>
      <div style={{ padding: '20px' }}>
        <input style={{ width: '60%', paddingBottom: '5px' }}
          placeholder="Enter the text to Search"
          name="searchTxt"
          value={searchTxt}
          onChange={handleValueChange} />
      </div>
      <div style={{ padding: '20px' }}>
        <button name="searchBtn" onClick={handleSearch} style={{ width: '20%' }}>Search</button>
        <button name="resetBtn" onClick={handleReset} style={{  width: '20%' }}>Reset</button>
      </div>

      {searchQAArr.length > 0 && (
        <>
          <h3>Search Results for {appId} - {searchQAArr.length}</h3>
          {searchQAArr.reverse().map((item, index) => {
            return (<div>
              <ul><strong>
                <span style={{ display: 'flex', flexDirection: 'row' }}> {index + 1} {" . "} {item.question}</span></strong>

                <li style={{ display: 'flex', flexDirection: 'row' }}>{item.answer}</li>
              </ul>            </div>)

          })}
        </>
      )}

      {onboarding && <div>
        <Dialog onClose={handleClose} open={onboarding}>
          <DialogTitle>On Boarding New Application</DialogTitle>
          <div style={{ paddingLeft: '20px', paddingBottom: '10px' }}>
            <label style={{ fontSize: '13px' }}>Application ID</label>
            <input className="input" name="appId" label="Application ID" placeholder="Enter Application ID"
              onChange={handleInputChange} value={formFields.appId}></input>
          </div>
          <div style={{ paddingLeft: '20px', paddingBottom: '10px' }}>

            <label style={{ fontSize: '13px' }}>Application Name</label>
            <input className="input" name="appName" label="Application Name"
              placeholder="Enter Application Name"
              onChange={handleInputChange} value={formFields.appName}></input>
          </div>
          <div style={{ paddingLeft: '20px', paddingBottom: '10px', fontSize: '13px' }}>
            Select any one option</div>
          <div style={{ paddingLeft: '20px', paddingBottom: '5px', display: 'inline-block' }}>
            <label style={{ fontSize: '13px' }}>
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
          <div style={{ paddingLeft: '20px', paddingBottom: '10px', display: 'inline-block' }}>
            <label style={{ fontSize: '13px' }}>
              <input type="radio" value="Database" checked={radSelected === "Database"} label="Database"
                onChange={handleRadioBtnChange} />
              DB
            </label>
          </div>
          {radSelected === "Upload" &&
            <>
              <div>
                <hr />
                <label style={{ width: '100%', paddingLeft: '10px' }}>Choose a file to upload</label>
                <form method="post" id="uploadFrm" enctype="multipart/form-data">
                  <input type="file" id="fileUpload" name="fileUpload"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '10px' }} accept="txt"></input>
                </form>
                <button name="btnUpload" onClick={handleUpload} style={{ paddingLeft: '10px' }}><b>Upload</b></button>
              </div>
              <DialogActions>
                <hr />

                <div style={{ display: 'flex' }}>
                  <button name="btnSubmit" onClick={handleSubmit}><b>Submit</b></button>
                  <button name="btnCancel" onClick={handleCancel}>Cancel</button>
                </div>
              </DialogActions>
            </>
          }
          {radSelected === "Database" && <div>
            <hr />
            <DialogContentText style={{ padding: '10px' }}><b>Database Details</b></DialogContentText>
            <DialogContent>

              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>DB Provider</label>
                <select className="input" name="db" value={formFields.db} onChange={handleInputChange}>
                  <option value="none">Select</option>
                  {dbProviders.map((x) => (<option value={x}>{x}</option>))}
                  {/* <option value="ORACLE">Oracle</option>
                  <option value="MY_SQL">MY SQL</option>
                  <option value="MS_SQL">MS SQL</option>
                  <option value="MONGO_DB">Mongo</option> */}
                </select>
              </div>
              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>Host Name</label>
                <input className="input" name="host" label="Host" placeholder="Enter Host Name"
                  onChange={handleInputChange} value={formFields.host}></input>
              </div>
              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>Port No</label>
                <input className="input" name="portNo" label="Port" placeholder="Enter Port Number"
                  onChange={handleInputChange} value={formFields.portNo}></input>
              </div>
              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>Database</label>
                <input className="input" name="schema" label="Database" placeholder="Enter Database Name"
                  onChange={handleInputChange} value={formFields.schema}></input>
              </div>
              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>UserName</label>
                <input className="input" name="userName" label="UserName" placeholder="Enter User Name"
                  onChange={handleInputChange} value={formFields.userName}></input>
              </div>
              <div style={{ paddingLeft: '15px', paddingBottom: '5px' }}>
                <label style={{ fontSize: '13px' }}>Password</label>
                <input className="input" name="password" label="Password" placeholder="Enter Password" type="password"
                  onChange={handleInputChange} value={formFields.password}></input>
              </div>

            </DialogContent>
            <DialogActions>

              <div>
                <button name="btnVerify" onClick={() => verifyConnection()}>Verify Connection</button>
              </div>
              <hr />

              <div style={{ display: 'flex' }}>
                <button name="btnSubmit" onClick={handleSubmit}>Submit</button>
                <button name="btnCancel" onClick={handleCancel}>Cancel</button>
              </div>
            </DialogActions>
          </div>}
        </Dialog>
      </div>}
    </div>
  );
}
