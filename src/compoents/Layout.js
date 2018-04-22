import React, { Component } from 'react';
import Title from './Title';
import SignOutButton from './signout';

export default class Layout extends Component {

    render(){
        
        let user = (this.props.islog) ? (<div className="uk-align-right si"><SignOutButton /></div>) : false;

        return(
            <div className="uk-panel">
            <div className="body">
              {user}
              <Title name={this.props.title} />
              <div className="child-body">{this.props.children}</div>
            </div>
                 <style jsx="true">{`
                 :global(body) {
                   margin: 0;
                 }
                 .body {
                   height:100%;
                   text-align: center;
                   margin-bottom: 5em;
                 }
                 .child-body {
                  margin-left: 20%;
                  margin-right: 20%;
                  margin-top: 10%;
                 }
                 .si {
                     margin-right: 1%;
                 }
             `}</style>
            </div>
        );
    }
}