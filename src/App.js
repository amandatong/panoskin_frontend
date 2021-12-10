import { React, useState, useEffect } from 'react';
import './styles/App.css';
import { ReactComponent as Map } from './assets/map.svg';

const r = [0, 250, 500, 1000];
const fill_color = "#0D7EF9";

function App() {
  const [stateData, setStateData] = useState({});
  const [selected, setSelected] = useState("");
  const [sortedStates, setSortedStates] = useState(new Set());


  const handleSelect = (e) => {
    setSelected(e.target.value);
  }

  const colorSelected = () => {
    if(stateData){
      let selected_data = sortedStates[selected];
      for(let name of Object.keys(stateData)){
        let path = document.getElementsByClassName(`${name.toLowerCase()}`)[0]
        if(path){
          if(selected_data.has(name)){
            path.style.fill = fill_color;
          } else {
            path.style.fill = null;
          }
        }
      }
    }
  }

  async function get_data() {
    let response = await fetch('/api/state_data');
    let state_data = await response.json();

    let aggregated_data = {}
    for(let s of state_data){
      if(!(s.id in aggregated_data)){
        aggregated_data[s.id] = 0;
      }
      aggregated_data[s.id] += s.visits;
    }
    
    let sorted_data = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
    }

    for(const [key, value] of Object.entries(aggregated_data)){
      let index = 0;
      if (value >= 0 && value <= 250){
        index = 0;
      } else if (value >= 250 && value <= 500){
        index = 1;
      } else if (value >= 500 && value <= 1000){
        index = 2;
      } else {
        index = 3;
      }
      sorted_data[index].add(key);
    }
    
    setStateData(aggregated_data);
    setSortedStates(sorted_data);
    setSelected(0);
  }

  useEffect( () => {
      let mounted = true;
      if(mounted) {
        get_data();
      }
      return () => mounted = false;
    }
  ,[]);

  useEffect( () => {
    let mounted = true;
    if(mounted) {
      colorSelected();
    }
    return () => mounted = false;
  },[selected])

  return (
    <div className="App">
      <div className="container">
        <div className="select">
          <div className="title">User Visits</div>
          <select value={selected} onChange={handleSelect}>
            {r.map((v, index) => {
              let text = index+1 === r.length ? `${v}+` : `${v} - ${r[index+1]}`;
              return(
                <option key={index} value={index}>{text}</option>
              )
            })}
          </select>
        </div>

        <Map />
      </div>
    </div>
  );
}

export default App;
