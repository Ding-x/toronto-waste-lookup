import React, { Component } from 'react';
import './Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Main extends Component {

  constructor(props){
    super(props)

    this.state={
      data:null,
      search:"",
      searchData:null,
    }

    this.search=this.search.bind(this);
  }

  componentDidMount(){
    const url= "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    fetch(url, {
      method: 'GET',

    })
    .then(response => {
      if (response.ok) {

          return response;
      }
      else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
      },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => {
      var key=0;
      for(let data of response){
        data.favorite=false;
        data.key=key++;
      }
      console.log(response)
        this.setState(
          {
            data:response,
            searchData:response
          }
        )
    })
    .catch(error => {
      alert('Fetch data error: '+ error.message); })
  }

  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  changeSearchValue = (e) => {
    this.setState({ search: e.target.value })
  }

  search(){
    var result=this.state.data.filter(data=>{
      return data.keywords.indexOf(this.state.search) > -1
    })
      this.setState({
          searchData:result
        })
  }

  handleFavorite=(data)=>{
    console.log(data)
    var dataList=this.state.data;
    for(let one of dataList){
      if(one.key===data.key){
        one.favorite=!one.favorite
      }
    }
    this.setState({
      data:dataList
    })
    var result=this.state.data.filter(data=>{
      return data.keywords.indexOf(this.state.search) > -1
    })
      this.setState({
          searchData:result
        })
  }


  render() {

    return (
      <div className="App">
      <div className="header">Toronto Waste Lookup</div>
      <input className="input-style" type="text" onChange={this.changeSearchValue} onKeyDown={this.search} ></input>
      <button className="btn-style" onClick={this.search}><FontAwesomeIcon className="search" icon="search" /></button>

       {this.state.searchData!==null? 
         this.state.searchData.map((data,index)=>{
           return(
             <div className="root" key={index}>
               <div className="title" >
               {data.favorite?<span className="star-green" onClick={() => this.handleFavorite(data)}><FontAwesomeIcon icon="star" /></span>:<span className="star-grey" onClick={() => this.handleFavorite(data)}><FontAwesomeIcon icon="star" /></span>}<span>{data.title}</span></div>
               <div className="body" dangerouslySetInnerHTML={{ __html: this.htmlDecode(data.body) }} />
             </div>
           )
         }) 
         : 
         null}

         <p className="favourite">Favourites</p>

         {this.state.data!==null? 
         this.state.data.map((data,index)=>{
           if(data.favorite){
            return(
              <div className="root" key={index}>
                <div className="title" >
                {data.favorite?<span className="star-green" onClick={() => this.handleFavorite(data)}><FontAwesomeIcon icon="star" /></span>:<span className="star-grey" onClick={() => this.handleFavorite(data)}><FontAwesomeIcon icon="star" /></span>}<span>{data.title}</span></div>
                <div className="body" dangerouslySetInnerHTML={{ __html: this.htmlDecode(data.body) }} />
              </div>
            )
           }
           return null;

         })
        
         : 
         null}

       </div>
    );
  }
}

export default Main;
