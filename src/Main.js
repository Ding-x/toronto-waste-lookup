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

  }


  //  Fetch data with offered api.
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

  //transfer the String into HTML
  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  //Listen searching key word
  changeSearchValue = (e) => {
    this.setState({ search: e.target.value })
    if(e.key==='Enter'){
      this.handleSearch();
    }
  }

  //Handle the searching feature
  handleSearch=()=>{
    var result=this.state.data.filter(data=>{
      return data.keywords.indexOf(this.state.search) > -1
    })
      this.setState({
          searchData:result
        })
  }

  //Handle the add to favorite feature
  handleFavorite=(data)=>{
    var dataList=this.state.data;
    for(let one of dataList){
      if(one.key===data.key){
        one.favorite=!one.favorite
      }
    }
    this.setState({
      data:dataList
    })

  }


  render() {

    return (
      <div className="App">
      <div className="header">Toronto Waste Lookup</div>
      <input className="input-style" type="text" onKeyUp={this.changeSearchValue}  onKeyPress={this.changeSearchValue}></input>
      <button className="btn-style" onClick={this.handleSearch}><FontAwesomeIcon className="search" icon="search" /></button>

       {this.state.searchData!==null? 
         this.state.searchData.map((data,index)=>{
           return(
             <div className="root" key={index}>
               <div className="title" >
                {data.favorite?
                <span className="star-green" onClick={() => this.handleFavorite(data)}>
                    <FontAwesomeIcon icon="star" />
                  </span>
                  :
                  <span className="star-grey" onClick={() => this.handleFavorite(data)}>
                      <FontAwesomeIcon icon="star" />
                  </span>}
                  
                  <span>{data.title}</span>
                </div>
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
                  {data.favorite?
                  <span className="star-green" onClick={() => this.handleFavorite(data)}>
                      <FontAwesomeIcon icon="star" />
                  </span>
                  :
                  <span className="star-grey" onClick={() => this.handleFavorite(data)}>
                      <FontAwesomeIcon icon="star" />
                  </span>}<span>{data.title}</span>
                </div>
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
