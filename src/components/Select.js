import React, { useEffect, useState } from "react";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const loadOptions = async inputValue => {
  const path = inputValue.substring(0, inputValue.lastIndexOf("\\") );
  const url = `/api/browse?path=${path}`
  const response = await fetch(url).then(res => res.json())
  const results = response.results.map(({ name, path }) => `${path}\\${name}\\`).map(x => ({value:x, label: x}))
  return results
}

const SelectPage = () => {
  const [text, setText] = useState("")
  const [options, setOptions] = useState([])

  useEffect(() => {
    loadOptions(text).then(setOptions)
  }, [text])


  return (
    <div>
      <Select options={options} />
      <AsyncSelect loadOptions={loadOptions}  />
      <input value={text} onChange={e => setText(e.target.value)} />
      <ul>
        {options.map(opt => <li>{opt}</li>)}
      </ul>
    </div>
  )
}

// function SelectPage() {
//   return (
//     <div>
//       <h1>Hello World</h1>
//     </div>
//   );
// }

export default SelectPage;
