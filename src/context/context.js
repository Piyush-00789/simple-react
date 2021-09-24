import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

//Provider,Consumer

const GithubProvider = ({children}) =>{
    const [githubUser,setGithubUser] = useState(mockUser);
    const [repos,setRepos]= useState(mockRepos);
    const [followers,setFollowers] = useState(mockFollowers);

    //request loading
    const [requests,setRequests] = useState(0);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState({show:false,msg:""});


    //check array
    const checkRequests = () =>{
        axios.get(`${rootUrl}/rate_limit`).then(({data})=>{
         let {rate:{remaining}} = data;
        //  remaining = 0;
         setRequests(remaining)
         if(remaining === 0){
             //throw an error
             toggleErrors(true,'Sorry you have exceeded your limit!!')
         }
        }).catch((err)=>{
            console.log(err)
        })
    }

    //errors
    const toggleErrors = (show = false,msg = "") => {
        setError({show,msg})
    }

    //Github user

    const searchGithubUser = async(user) => {
        toggleErrors()
        setLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch(err=> {console.log(err)})
        // console.log(response);
        if(response){
            setGithubUser(response.data)
            const {login,followers_url} = response.data
            // .then(response => setRepos(response.data))
            // .then(response => setFollowers(response.data))
            
            await Promise.allSettled([axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),axios.get(`${followers_url}?per_page=100`)])
            .then((results)=> {
                const [repos,followers] = results
                const status = 'fulfilled';
                if(repos.status === status){
                    setRepos(repos.value.data)
                }
                if(followers.status === status){
                    setFollowers(followers.value.data)
                }
            }).catch((err) => {
                console.log(err);
            })
            //more logic here
            //https://api.github.com/users/john-smilga/repos?per_page=100
            //https://api.github.com/users/john-smilga/followers
        }else{
            toggleErrors(true,'user not found!!')
        }
        checkRequests();
        setLoading(false)

    }
    useEffect(checkRequests,[])

    return (
    <GithubContext.Provider value={{githubUser,repos,followers,requests,error,searchGithubUser,
    loading,
    setLoading}}>
        {children}
    </GithubContext.Provider>
    );
}

export {GithubContext,GithubProvider}