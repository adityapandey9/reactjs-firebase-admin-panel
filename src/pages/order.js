import React, { Component } from 'react';
import Layout from '../compoents/Layout';
import { withRouter, Redirect } from 'react-router-dom';
import * as routes from '../const/routes';
import * as firebase from 'firebase';
import { auth } from '../firebase/firebase';
import { databaseRef } from '../firebase/database';

class OrderPage extends Component {

    constructor(props){
        super(props);
        this.userPath = '/user';
        this.orderPath = '/orders';
        this.mount = false;
        this.limit = 2;
        this.state = {
            data: null,
            err: null,
            prod: null,
        }
        this.getData = this.getData.bind(this);
        this.getTableList = this.getTableList.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getModal = this.getModal.bind(this);
        // console.log(this.props.location)
    }

    componentDidMount(){
        this.mount = true;
        this.getData()
        console.log("Mount")
        // databaseRef.ref(this.userPath).on("child_added")
    }

    handleClick(e, id){
        databaseRef.ref("/data/"+id).once("value", (res)=>{
            let list = res.val();
            console.log("R: ", list)
            this.setState({prod: list})
        }, (err)=>{
            this.setState({err: err})
        })
    }

    getData(){
        if(!this.mount)
            return;
        let prom = [];
       prom.push(databaseRef.ref(this.orderPath).once("value", (res)=>{
        
       }, (err)=> {
        this.setState({err: err});
       }))
       prom.push(databaseRef.ref(this.userPath).once("value", (res)=>{

       }, (err)=>{
        this.setState({err: err})
       }));
       Promise.all(prom).then((res)=>{
        let orders = res[0].val();
        let users = res[1].val();
        let orderslist = [];
        for(let key in orders){
            let ordersobj = orders[key];
            let user = users[key];
            for(let order in ordersobj){
                orderslist.push({addr: user.address, order: ordersobj[order]});
            }
        }
        // console.log(orderslist)
        this.setState({data: orderslist});
    }).catch((err)=>{
           this.setState({err: err})
       })
    }

    getTableList(){
        let objlist = [];
        for(let i=0;i<this.state.data.length;i++){
            let obj = this.state.data[i];
            objlist.push(
                <tr key={i}>
                    <td>{obj.addr.name}</td>
                    <td><a className="uk-button uk-button-danger" onClick={(e)=>this.handleClick(e, obj.order.id)} href="#modal-full">Show Product</a></td>
                    <td>{obj.addr.phone}</td>
                    <td>{obj.order.status}</td>
                    <td>{obj.addr.city}</td>
                    <td>{obj.addr.address}</td>
                    <td>{obj.addr.pincode}</td>
                    <td>{obj.addr.locality}</td>
                </tr>
            );
        }
        return objlist;
    }

    getTable(){
        const objlist = this.getTableList();
        return ( <div className="uk-overflow-auto">
        <table className="uk-table uk-table-justify uk-table-divider uk-table-hover uk-table-striped">
        <thead>
            <tr>
                <th>Name</th>
                <th>Product</th>
                <th>Phone no.</th>
                <th>Status</th>
                <th>City</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Locality</th>
            </tr>
        </thead>
        <tbody>
            {objlist}
        </tbody>
    </table></div>);
    }

    getModal(){
        let newprice = 0;
        let imglist = [];
        if(this.state.prod!=null){
            newprice = (this.state.prod.price-((this.state.prod.discount/100)*this.state.prod.price));
            for(let i=0;i<this.state.prod.asrc.imgs.length;i++){
                imglist.push(<li key={i}>
                                <div className="uk-position-cover uk-animation-kenburns uk-animation-reverse uk-transform-origin-center-left">
                                    <img src={this.state.prod.asrc.imgs[i]} alt={this.state.prod.name} uk-cover="true" />
                                </div>
                            </li>);
            }
        }

        return (
            <div id="modal-full" className={this.state.prod!=null?"uk-modal-full uk-modal uk-open modal-view":"uk-modal-full uk-modal uk-open"}  uk-modal="true">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-full uk-close-large" type="button" onClick={(e)=>this.setState({prod: null})} uk-close="true"></button>
                    <div className="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid="true">
                        <div className="uk-position-relative uk-visible-toggle uk-light" uk-height-viewport="true" uk-slideshow="animation: push">
                            <ul className="uk-slideshow-items mystyle">
                                {imglist}
                            </ul>

                            <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slideshow-item="previous"></a>
                            <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slideshow-item="next"></a>

                        </div>
                        <div className="uk-padding-large">
                            <h1>{this.state.prod.name}</h1>
                            <p><b><i>Price:</i></b> {this.state.prod.price}</p>
                            <div className="uk-overflow-auto">
                                <table className="uk-table uk-table-responsive uk-table-divider">
                                    <thead>
                                        <tr>
                                            <th>discount</th>
                                            <th>New Price</th>
                                            <th>Product Id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{this.state.prod.discount}</td>
                                            <td>{newprice}</td>
                                            <td>{this.state.prod.product}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
        let mainbody = null;
        if(this.state.data != null){
            mainbody = this.getTable();
        } else {
            mainbody = <div uk-spinner="ratio: 1"></div>;
        }
        let modal = this.state.prod!=null? this.getModal(): false;
        return (
            <Layout title="Your Shop Orders" islog={this.props.islog} >
                {status}
                <ul className="uk-tab uk-flex-center" data-uk-tab="{connect:'#my-id'}">
                    <li><a href="">New Orders <span className="uk-badge">1</span></a></li>
                    <li><a href="">Cancel Order</a></li>
                </ul>
                <ul id="my-id" className="uk-switcher uk-margin">
                    <li><a href="#" id="autoplayer" data-uk-switcher-item="next"></a>
                    {mainbody}
                    </li>
                    <li>Content 2</li>
                </ul>
                {modal}
                <style jsx="true">{`
                 .mystyle {
                    // border: 2px solid red;
                    margin-top: 30%;
                 }
                 .modal-view {
                    display: block;
                 }
             `}</style>
            </Layout>
        );
    }
}

export default withRouter(OrderPage);