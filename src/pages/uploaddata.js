import React, { Component } from 'react';
import Layout from '../compoents/Layout';
import { withRouter, Redirect } from 'react-router-dom';
import * as routes from '../const/routes';
// import * as firebase from 'firebase';
import { auth } from '../firebase/firebase';
import * as XLSX from 'xlsx';
import { databaseRef } from '../firebase/database';


class UploadData extends Component {
 
    constructor(props){
        super(props);
        this.basePath = '/data';
        this.handleChange = this.handleChange.bind(this);
        this.readFile = this.readFile.bind(this);
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
        bar.removeAttribute('hidden');
        this.setState({progress: 0, curr: 0, err: null, done: 0, total: 0})
        // console.log("Files: ", e.target.files)
        let files = e.target.files;
        if(files.length === 0){
            this.setState({err: "Enter some files"});
            return;
        }
        if(!this.hasExtension(files[0].name, ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "wb*", "wq*"])){
            window.alert("File Type is not supported for excel, please check your file");
            return;
        }
        let es = files[0]
        this.readFile(es);
    }

    readFile(file){
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
		reader.onload = (file) => {
            /* Parse data */
            // console.log("es: ", file)
			const bstr = file.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header:1});
            // console.log("Data: ", data)
            let mdata = [];
            let lens = (data.length-1)
            this.setState({total: lens})
            for(let i=1;i<data.length;i++){
                let obj = {}
                if(data[i].length < data[0].length){
                    continue;
                }
                for(let j=0;j<data[i].length;j++){
                   obj = Object.assign(obj, {[data[0][j].toLowerCase()]: this.isJSON(data[i][j]) ? JSON.parse(data[i][j]): data[i][j]});
                }
                // console.log("Data: ", obj);
                mdata.push(obj);
            }
            // console.log("M: ", mdata)
            databaseRef.ref(`${this.basePath}`).push().set(mdata).then((val)=>{
                console.log("Val f: ", val);
                if(val === undefined){
                    this.setState({progress: 100, done: lens, curr: 100});
                }
            }).catch((err)=>{
                this.setState({err: err});
            })
		};
    }


    isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
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
                <h4 className="uk-heading-line uk-text-center"><span>{this.state.done} out of {this.state.total} products informations are saved.</span></h4>
                <progress id="js-progressbar" className="uk-progress" value={this.state.progress} max="100" hidden></progress>
                <div className="js-upload uk-placeholder uk-text-center" uk-form-custom="true">
                    <span uk-icon="icon: cloud-upload"></span>
                    <span className="uk-text-middle">Upload Excel by dropping them here or</span>
                    <div>
                        <input type="file" onChange={this.handleChange.bind(this)} multiple accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" />
                        <span className="uk-link">selecting one</span>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(UploadData);