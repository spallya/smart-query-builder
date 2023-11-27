import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Search() {
  const [searchTxt, setSearchTxt] = useState("");
  const [appId, setAppId] = useState("");
  const [appIdDisplay, setAppIdDisplay] = useState("");
  const [searchStack, setSearchStack] = useState([]);
  const [searchQAArr, setSearchQAArr] = useState([]);
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

  const handleAppIdChange = (e) => {
    console.log("in handle value change: ", e);
    setAppId(e.target.value);
    setAppIdDisplay(true);
  }

  const postSearchResults = () => {
    const url = "http://localhost:8080/ai/dbquery";
    const body = { appId: appId, userMessage: searchTxt};
    let arr = searchQAArr;
    /*arr.push({id: arr.length, question: searchTxt, answer: "test", appId: appId}); // remove when calling api
    arr.reverse(); // remove when calling api
    setSearchQAArr(arr); // remove when calling api */

    console.log("in post search results: ", arr);
    axios.post(url, body)
    .then((response) => {
      console.log("response is: ", response);
      const resp = response.data.completion;
      arr.push({id: arr.length, question: searchTxt, answer: resp});
      arr.reverse();
      setSearchQAArr(arr);
    })
    .catch((error) => {
      console.log("error response is: ", error);
      arr.push({id: arr.length, question: searchTxt, answer:error});
      arr.reverse();
      setSearchStack(arr);
    });

  }

  const handleSearch = () => {
    console.log("in handle search");
    let arr = searchStack;
     console.log("in search: ", arr, searchStack);
     arr.push(searchTxt);
     setSearchStack(arr);

    // calling api
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


  return (
    <div className="App">

      <h1>Smart Query Builder</h1>

      <div>
      <select className="item" value={appId} onChange={handleAppIdChange} disabled={appIdDisplay}>
      <option value="none">Select an application</option>
      <option value="vantage">Vantage</option>
      <option value="WCA">WCA</option>
      <option value="wima">WIMA</option>
      </select>
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
    </div>
  );
}
