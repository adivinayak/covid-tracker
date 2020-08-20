import React,{useState, useEffect} from 'react';
import {MenuItem,FormControl,Select,Card,CardContent} from '@material-ui/core'
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util'


function App() {
  const [countries,setCountries]=useState([])
  const [country,setCountry]=useState('worldwide')
  const [countryInfo,setcountryInfo]=useState({})
  const [tableData,settableData]=useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const[mapCountries,setmapCountries]=useState([])
  const [casesType,setcasesType] =useState("cases")  
  
  
  useEffect(()=>{
        fetch( "https://disease.sh/v3/covid-19/all")
        .then(response=>response.json())
        .then(data=>{
                 setcountryInfo(data)
        })

  },[]) 
  
  useEffect(()=>{
  
    const getCountriesData=async()=>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response)=>response.json())
        .then((data)=>{
          
          const countries=data.map((country)=>({
                      name:country.country,
                      value:country.countryInfo.iso2
          }))
       const sortedData = sortData(data)
          setCountries(countries)
          settableData(sortedData)
          setmapCountries(data)
        })

 
     }
      getCountriesData();
  },[])

 
const onSelectcountry=async(event)=>{
    const value=event.target.value;
 
    console.log(value)
    const url =
        value === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${value}`;
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
    setCountry(value) 
    setcountryInfo(data)
    const check=()=>{
      value==="worldwide"?setMapCenter({ lat: 34.80746, lng: -40.4796 }):setMapCenter([data.countryInfo.lat,data.countryInfo.long])
   }
     check()
    setMapZoom(4);
    console.log()
})

}
  return (
    <div className="App">
      <div className="app_left">
      <div className="app_header">
     <h1>COVID-19 TRACKER</h1>
     <FormControl className='app_dropdown'>
     <Select variant='outlined'
     value={country}
     onChange={onSelectcountry}>
       <MenuItem value='worldwide'>worldwide</MenuItem>
      {
        countries.map(country=>(
        <MenuItem value={country.value}>{country.name}</MenuItem>
        )

        )
      }
     </Select>
     </FormControl>

  
     </div>
     <div className="app_stats">

       <InfoBox isRed active={casesType==="cases"} onClick={(e)=>setcasesType("cases")}         title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
       <InfoBox  active={casesType==="recovered"} onClick={(e)=>setcasesType("recovered")}  title=' Recoveries' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
       <InfoBox isRed active={casesType==="deaths"} onClick={(e)=>setcasesType("deaths")} title=' Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
     </div>
     <Map  casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
 <Card className="app_right">
    <CardContent>
      <h3>
        Live cases by country 
      </h3>
      <Table countries={tableData}/>
      <h3>
        Worldwide new {casesType}
      </h3>
      <LineGraph casesType={casesType}/>
      <h3>Develped by:Aditya Vinayak</h3>
    </CardContent>
 </Card>
 
    </div>
  );
}

export default App;
