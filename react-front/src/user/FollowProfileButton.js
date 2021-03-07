import React, {Component} from "react";
import {follow} from "./apiUser";

class FollowProfileButton extends Component
{
    followClick = () => {
        this.props.onButtonClick(follow);
    };
    render(){
        return (
            <div className="d-inline-block">
            {
                !this.props.following ? (
                    <button onClick={this.followClick} className="btn btn-raised btn-success mr-5">
                        Follow
                    </button>
                ) : (
                    <button className="btn btn-raised btn-warning">
                        Unfollow
                    </button>
                )
            }
            </div>
        )
    }
};

export default FollowProfileButton;