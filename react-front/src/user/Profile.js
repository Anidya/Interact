import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import {Link, Redirect} from 'react-router-dom'
import {read} from './apiUser'
import DefaultProfile from '../images/penguin.jpg'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'

class Profile extends Component {

    constructor(){
        super()
        this.state = {
            user: {following: [], followers: []},
            redirectToSignin: false,
            following: false
        }
    }

    checkFollow = (user) => {
        const jwt = isAuthenticated()
        const match = user.followers.find(follower => {
            return follower._id == jwt.user._id
        })
        return match
    };

    clickFollowButton = (callApi) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
        .then(data => {
            if(data.error){
                this.setState({error: data.error})
            }
            else{
                this.setState({
                    user: data,
                    following: !this.state.following
                })
            }
        })
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error)
                this.setState({redirectToSignin: true})
            else 
            {
                let followingcheck = this.checkFollow(data)
                this.setState({ user: data, following: followingcheck})
            }
        })
    }

    componentDidMount(){
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    componentWillReceiveProps(props){
        const userId = props.match.params.userId
        this.init(userId);
    }

    render() {

        if(this.state.redirectToSignin)
            return <Redirect to="/signin"></Redirect>

        //const photoUrl = this.state.user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${this.state.user._id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>    
                <div className="row">
                    
                    <div className="col-md-6">
                            {/* <img   style={{height: "200px", width: "200px"}}  className="img-thumbnail"
                                src={photoUrl} onError={ i=> {i.target.src = `${DefaultProfile}`}}
                                alt={this.state.user.name}>
                            </img> */}
                    </div>

                    
                    <div className="col-md-6">
                        <div className="lead mt-2">
                            <p>Hello {this.state.user.name} </p>
                            <p>Email: {this.state.user.email}</p>
                            <p>{`Joined on ${new Date(this.state.user.created).toDateString()}`}</p>
                        </div>
                        {isAuthenticated().user  && isAuthenticated().user._id == this.state.user._id ? (
                            <div className="d-inline-block mt-5">
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`edit/${this.state.user._id}`}>
                                Edit Profile
                                </Link>
                                
                                <DeleteUser userId={this.state.user._id}/>       
                            </div>
                            ) : (
                            <FollowProfileButton 
                                following = {this.state.following}
                                onButtonClick = {this.clickFollowButton}
                            />
                        )}
                    </div>
                </div>
                    <div classname="row">
                        <div className="col md-12 mt-5 mb-5">
                            <hr/>
                            <p className="about">{this.state.user.about}</p>
                        </div>
                    </div>
            </div>
        )
    }
}

export default Profile