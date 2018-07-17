import React, {Component} from 'react';

/*
* This is the title compoent for showing the title of different page in the website.
*/
class Title extends Component {

  render() {
    return (
      <div >
        <div className="uk-heading-line uk-text-center my-logo">
            <span>{this.props.name}</span>
        </div>
        <style jsx="true">{`
            .my-logo {
                font-size: 26px;
                margin-top: 5px;
                margin-bottom: 12px;
            }
       `}</style>
      </div>
    );
  }
}

export default Title;