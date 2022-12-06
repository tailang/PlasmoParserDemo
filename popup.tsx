import { CSSProperties, useEffect, useState } from "react"
//import Parse from 'parse/dist/parse.min.js';
import Parse from 'parse'
import jwt_decode from "jwt-decode";

import Child from "~child/Hello"
import { stringify } from "querystring"


function IndexPopup() {
  let a = 100
  const [data, setData] = useState("")

  useEffect(() => {
    Parse.initialize("myAppId")
    Parse.serverURL = 'http://127.0.0.1:1337/parse'
  }, [])

  const signup = async (username: string, email: string ,password: string) => {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    try {
      await user.signUp();
      // Hooray! Let them use the app now.
      alert("success")
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  }

  const login = async (email: string, passwd: string) => {
    try {
      const user = await Parse.User.logIn(email, passwd); // email or username
      alert("login success")
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  }

  const logout = async () => {
    try {
      await Parse.User.logOut()
      alert("logout success")
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  }

  const currentUser = () => {
    const current = Parse.User.current()
    if (current) {
      alert("email:" + current.get("email"))
    } else {
      alert("current user not login")
    }
  }

  const resetPasswd = async () => {
    try {
      await Parse.User.requestPasswordReset("caopingcpu@gmail.com")
      alert("has send a reset email to caopingcpu@gmail.com")
    } catch (error) {
      alert("reset passwd fail")
    }
  }

  const loginWithGoogle = () => {
    // 不是每次都交互显示
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token !== null && token != undefined) {
        chrome.identity.getProfileUserInfo({ accountStatus: chrome.identity.AccountStatus.ANY }, (info) => {
          if (info != undefined && info != null) {            
            Parse.Cloud.run("userIsExisting", {email: info.email}).then((existing) => {
              if (existing) {
                // login
                login(info.email, info.id).then(()=>{
                  alert("login in with google success")
                }).catch(reason => {
                  alert("login with google fail" + reason)
                })
              } else {
                //signup
                signup(info.email, info.email, info.id).then(()=>{
                  alert("signup with google success")
                }).catch(reason => {
                  alert("signup with google fail" + reason)
                })
              }
            })
            
          } else {
            // error user info
          }
        })
      } else {
        // error token
      }
    })
  }

  const cloudTest = () => {
    Parse.Cloud.run("userIsExisting", {email: 'caopingcpu@gmail.com'}).then((str) => {
      alert(JSON.stringify(str))
    })
  }

  return (
    <div style={styles.div}>
      <h2>
        gmail oauth2.0 signup
      </h2>
      <div>
        <button onClick={() => signup("caopingcpu@163.com", "caopingcpu@163.com", "666666")}>signup</button>
        <button onClick={() => login("caopingcpu@163.com", "666666")}>login</button>
        <button onClick={logout}>logout</button>
        <button onClick={currentUser}>current user</button>
        <button onClick={resetPasswd}>reset PassWd</button>
        <button onClick={loginWithGoogle}>login with google</button>
        <button onClick={cloudTest}>cloudTest</button>
        <Child/>
      </div>
    </div>
  )



}

const styles = {
  div: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    width: 1000,
    //backgroundColor: "yellow"
  } as CSSProperties
}

export default IndexPopup
