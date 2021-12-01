import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

import {Provider} from 'react-redux'
import { createStore, applyMiddleware } from "redux";
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login"
import MainScreen from './components/Main'
import PostScreen from './components/main/Post'
import SaveScreen from './components/main/Save'

const firebaseConfig = {
  apiKey: "AIzaSyAZlGS3DvuapycWYwXyfX7Qqpkne7nnYiQ",
  authDomain: "instagram-demo-49f87.firebaseapp.com",
  projectId: "instagram-demo-49f87",
  storageBucket: "instagram-demo-49f87.appspot.com",
  messagingSenderId: "129997977611",
  appId: "1:129997977611:web:12980f038e883a31b2ef0e",
  measurementId: "G-K9SW05SV9M",
};


const store = createStore(rootReducer, applyMiddleware(thunk))
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={styles}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store ={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Post" component={PostScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  flex: 1,
  justifyContent: "center",
});

export default App;
export { db, app };
