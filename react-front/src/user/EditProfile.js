import React, {Component} from 'react'
import { Link, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { read, update, updateUser } from './apiUser'
import DefaultProfile from '../images/penguin.jpg'

class EditProfile extends Component{

    constructor(){
        super()
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            loading: false,
            filesize: 0,
            about: ""
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error)
                this.setState({redirectToSignin: true})
            else 
                this.setState({ id: data._id, 
                                name: data.name, 
                                email: data.email, 
                                password: data.password, 
                                about: data.about 
                })
        })
    }

    componentDidMount(){
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId);
    }
    
    isValid = () => {
        const {name, email, password, filesize} = this.state
        if(filesize > 100000){
            this.setState({
                error: "File size should be less tha 1MB", 
                loading: false
            })
            return false;
        }
        if(name.length == 0){
            this.setState({
                error: "Name is required", 
                loading: false
            })
            return false;
        }
        if(! (/[\w._-]+@[\w.-]+\.[a-zA-Z0-9-]{2,4}/.test(email)) ){
            this.setState({
                error: "Email is invalid", 
                loading: false 
            })
            return false;
        }
        if(password != undefined && password.length >=1 && password.length<=5){
             this.setState({
                error: "Password should have atleast 6 charachters", 
                loading: false 
            })
            return false;
        }
        return true;
    }




    handleChange = (str) => (event) => {
        this.setState({error: ""})
        const value = str == "photo" ? event.target.files[0] : event.target.value;
        const filesize = str == "photo" ? event.target.files[0].size : 0;
        console.log(filesize)
        this.userData.set(str,value)
        this.setState({ [str]: value, filesize: filesize });
    };



    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true})

        if(this.isValid()){
            //console.log(user);
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token

            update(userId, token, this.userData)
            .then(data => {
                if(data.error)
                    this.setState({error: data.error})
                else
                {
                    updateUser(data.user,  () =>  {
                        this.setState({ 
                            redirectToProfile: true
                        })
                    })
                }
            })
        }
    };



    editForm = () => (
        <form> 
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input 
                    onChange = {this.handleChange("photo")} 
                    type = "file" 
                    accept="image/*"
                    className = "form-control">
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange = {this.handleChange("name")} 
                    type = "text"
                    className = "form-control"
                    value = {this.state.name} >
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange = {this.handleChange("email")} 
                    type = "email" 
                    className = "form-control"
                    value = {this.state.email}>
                </input>
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea 
                    onChange = {this.handleChange("about")} 
                    type = "text" 
                    className = "form-control"
                    value = {this.state.about}>
                </textarea>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange = {this.handleChange("password")} 
                    type = "password" 
                    className = "form-control"
                    value = {this.state.password}>
                </input>   
            </div>
            <button onClick = {this.clickSubmit}  className="btn btn-raised btn-primary">Update</button>
        </form>
    )



    render(){
        if(this.state.redirectToProfile)
            return <Redirect to={`/user/${this.state.id}`}></Redirect>
        
        const photoUrl = this.state.id ? `${process.env.REACT_APP_API_URL}/user/photo/${this.state.id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                {this.state.loading ? ( <div className = "jumbotron text-center">
                    <h2>Loading...</h2>
                    </div> ) : ( "" ) }
                <div className="alert alert-danger" style={{display: this.state.error ? "" : "none" }}>
                    {this.state.error}
                </div>
                {/* <img   style={{height: "200px", width: "auto"}}  className="img-thumbnail"
                    src={photoUrl} onError={ i=> {i.target.src = `${DefaultProfile}`}} 
                    alt={this.state.name}>
                </img> */}
                {this.editForm()}
            </div>
        );
    };
};

export default EditProfile;