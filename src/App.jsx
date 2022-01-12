import './App.css'
import React, { useState, useEffect } from 'react'
import makeAnimated from 'react-select/animated';
import axios from 'axios'
import AsyncSelect from 'react-select/async';

function App() {
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  const [testArray, setTestArray] = useState([]);
  const [filteredTagArray, setFilteredTagArray] = useState(null);

  const animatedComponents = makeAnimated();

  useEffect(() =>{
    const loadOptions = async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts') // replace this with your api endpoint
      const data = res.data
      let modifiedData = data.map(data => {
        return {...data, tags : []}
      })
      setTestArray(modifiedData)
  };
  loadOptions()
  },[])
  
// handle input change event
const handleInputChange = value => {
  setValue(value);
};

// handle selection
const handleChange = value => {
  setSelectedValue(value);
}

const handleTagSearch = (e) => {
  let value = e.target.value;
  console.log(value)
  if(value === ''){
    console.log(testArray)
    setTestArray(testArray)
    setFilteredTagArray(null)

  }
  else{
    let result = testArray.filter((student) => {
      let outcome = false;
      let filteredTag = student.tags.filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
      if(filteredTag.length > 0){
        outcome = true;
      }
      return outcome
    })
    console.log(result)
    setFilteredTagArray(result)
  }

}

const addNewTag =(e, index)=>{
  if(e.key.toLowerCase() === 'enter'){
      let value = e.target.value
      let newTestArray = [...testArray];
      newTestArray[index].tags.push(value);
      setTestArray(newTestArray)
      e.target.value = ""
  }
}

const loadOptions = async (inputValue) => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts') // replace this with your api endpoint
    const data = res.data
    let filteredData = data.filter((i) => i.title.toLowerCase().includes(inputValue.toLowerCase()))  
    return filteredData;
};

  return (
    <div className="App">
        <h3>React Select Project</h3>
        <pre>Input Value: "{inputValue}"</pre>
        <div>
        <AsyncSelect
        cacheOptions
        defaultOptions
        value={selectedValue}
        getOptionLabel={e => e.title}
        getOptionValue={e => e.title}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        onChange={handleChange}
        components={animatedComponents}
        isMulti
      />
      </div>
      <input type="text" placeholder="filter by tag" onChange={(e) => handleTagSearch(e)} />
      <div>
        {filteredTagArray !== null ? filteredTagArray.map((element, index)=>{
          return(
            <div>
              <input type="text" onKeyPress={(e)=>addNewTag(e, index)} />
              <p>{element.title}</p>
              <ul className="tagWrapper">
                {element.tags.map((tag)=> (<li>{tag}</li>))}
              </ul>
            </div>
          )
        }) : testArray.map((element, index)=>{
          return(
            <div>
              <input type="text" onKeyPress={(e)=>addNewTag(e, index)} />
              <p>{element.title}</p>
              <ul className="tagWrapper">
                {element.tags.map((tag)=> (<li>{tag}</li>))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
