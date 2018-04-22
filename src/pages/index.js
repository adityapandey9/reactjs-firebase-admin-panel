import React, { Component } from 'react';
import Layout from '../compoents/Layout';
import { withRouter, Redirect } from 'react-router-dom';
import * as routes from '../const/routes';
import { firebase } from '../firebase';


class Index extends Component {
    
  constructor(props){
    super(props);
    this.moveto = this.moveto.bind(this);
  }

  moveto(id, e){
    e.preventDefault()
    // console.log(id)
    // window.alert("Hey, "+id)
    const {
      history,
    } = this.props;
    switch(id){
      case 1:
        history.push(routes.IMG)
        break;
      case 2:
        history.push(routes.DATA)
        break;
    }
  }

    render() {
      let user = firebase.auth.currentUser; 
      if(user == null){
        return <Redirect to={routes.SIGN_IN} />;
      }

      return (
        <Layout title="Choose a way" islog={this.props.islog} >
           <div className="mar btns" onClick={(e) => this.moveto(1, e)}>
              <div className="uk-card uk-card-primary uk-card-hover uk-card-body">
                  <h3 className="uk-card-title">Upload Images</h3>
                  <p>Here You can upload images for your products that you want to show in your app.</p>
              </div>
           </div>
           <div className="mar" onClick={(e) => this.moveto(2, e)}>
              <div className="uk-card uk-card-hover uk-card-primary uk-card-body news">
                  <h3 className="uk-card-title">Upload Data (Excel)</h3>
                  <p>Here You can upload the Excel sheet which contains the information about the different Products.</p>
              </div>
           </div>
           <style jsx="true">{`
                 .mar {
                    margin: 1%;
                 }
                 .btns {
                   margin-bottom: 2%;
                 }
                 .news {
                    background-color: #ec2147;
                    color: white;
                 }
             `}</style>
        </Layout>
      );
    }
  }
  
  export default withRouter(Index);