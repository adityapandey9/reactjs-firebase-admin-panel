import React, { Component } from 'react';
import Layout from '../compoents/Layout';
import { withRouter, Redirect } from 'react-router-dom';
import * as routes from '../const/routes';
import * as firebase from 'firebase';
import { auth } from '../firebase/firebase';
import { storageRef } from '../firebase/upload';

class UploadImg extends Component {

    constructor(props){
        super(props);
        this.basePath = '/uploads';
        this.uploadfunc = this.uploadfunc.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            progress: 0,
            curr: 0,
            err: null,
            done: 0,
            total: 0
        }
    }

    handleChange(e){
        let bar = document.getElementById('js-progressbar');
        this.setState({progress: 0, curr: 0, err: null, done: 0})
        
        // console.log("Files: ", e.target.files)
        let files = e.target.files;
        console.log(files)
        if(files.length === 0){
            this.setState({err: "Enter some files"});
            return;
        }
        let total = 0;
        for(let i=0;i<files.length; i++){
            if(!this.hasExtension(files[i].name, ['.jpg', '.png'])){
                window.alert("File Type is not supported for images, please check your file");
                return;
            }
            total+=files[i].size;
        }
        this.setState({total: files.length})
        bar.removeAttribute('hidden');
        
        for(let i=0;i<files.length; i++){
            // console.log("File: ", files[i])
            this.uploadfunc(files[i], bar, total)
        }
    }

    uploadfunc(upload, bar, total){
        let uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload);
        // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED)
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) =>  {
              // upload in progress
              let curr = snapshot.bytesTransferred;
              
              this.setState(prevState => {
                return {curr: prevState.curr + curr}
              });
              let progress = (this.state.curr / total) * 100;
              this.setState({ progress });
            },
            (error) => {
              // upload failed
              console.log(error)
              this.setState({err: error});
            },
            () => {
                this.setState(prevState => {
                    return {done: prevState.done + 1}
                });
            }
          );
    }

    hasExtension(fileName, exts) {
        return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }

    render() {
        let user = auth.currentUser; 
        if(user == null){
            return <Redirect to={routes.SIGN_IN} />;
        }
        let status = null;
        if(this.state.err != null){
            status = <div className="uk-alert-danger" uk-alert="true">
                        <p>{this.state.err}</p>
                     </div>;
        }
        

        return (
            <Layout title="Upload Images to FireStore" islog={this.props.islog} >
                {status}
                <h4 className="uk-heading-line uk-text-center"><span>{this.state.done} out of {this.state.total} images are done.</span></h4>
                <progress id="js-progressbar" className="uk-progress" value={this.state.progress} max="100" hidden></progress>
                <div className="js-upload uk-placeholder uk-text-center" uk-form-custom="true">
                    <span uk-icon="icon: cloud-upload"></span>
                    <span className="uk-text-middle">Upload Images by dropping them here or</span>
                    <div>
                        <input type="file" onChange={this.handleChange.bind(this)} accept="image/x-png,image/jpeg" multiple />
                        <span className="uk-link">selecting one</span>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(UploadImg);