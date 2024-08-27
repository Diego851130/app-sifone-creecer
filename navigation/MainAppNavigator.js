import React, { useCallback, useEffect, useState } from 'react'
import { NavigationContainer, DrawerActions, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ListNews from '../screens/intro/ListNews'
import Login from '../screens/auth/login/Login'
import Notification from '../screens/notification/Notification'
import Detail from '../screens/auth/login/Detail'
import We from '../screens/dashboard/support/We'
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Dimensions } from 'react-native'
import backgroundCustom from './../screens/constanst';

const Drawer = createDrawerNavigator()

function MyDrawer() {
  const [background, setBackground] = useState('')
  const handleLogged = async () => {
    await AsyncStorage.getItem('@background').then((value) => {
      setBackground(value)
    })
  }

  useEffect(() => {
    handleLogged()
  }, [])

  return (
    <Drawer.Navigator
      backBehavior="none"
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {
          marginLeft: -Dimensions.get('window').width * 5 / 100,
          backgroundColor: background || backgroundCustom,
          width: Dimensions.get('window').width * 80 / 100,
          paddingTop: 20,
        },
        drawerItemStyle: {
          width: '100%',
          color: '#ffffff',
        },
        backBehavior: 'none'
      }}
    >

      {/* <Drawer.Screen
        name="MenuLateral"
        unmountOnBlur={true}
        component={NewsStackScreen}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerLabelStyle: {
            marginBottom: -10,
            color: '#ffffff',
            paddingBottom: 23,
            width: 90,
            fontSize: 30,
            fontWeight: 'bold'
          }
        }}
      /> */}
      <Drawer.Screen
        name="Nosotros"
        component={We}
        options={{
          headerShown: false,
          drawerLabel: 'Nosotros',
          drawerLabelStyle: {
            marginBottom: -10,
            color: '#ffffff',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            paddingBottom: 20,
            width: 90,
            fontSize: 17,
            marginLeft: Dimensions.get('window').width * 5 / 100,
          }
        }}
      />
      <Drawer.Screen
        name="Web"
        component={NewsStackScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Web',
          drawerLabelStyle: {
            marginBottom: -10,
            color: '#ffffff',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            paddingBottom: 20,
            width: 90,
            fontSize: 17,
            marginLeft: Dimensions.get('window').width * 5 / 100,
          }
        }}
      />
      <Drawer.Screen
        name="Notification"
        component={NotificationStackScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Notificaciones',
          drawerLabelStyle: {
            marginBottom: -10,
            color: '#ffffff',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            paddingBottom: 20,
            width: 140,
            fontSize: 17,
            marginLeft: Dimensions.get('window').width * 5 / 100,
          }
        }}
      />
      <Drawer.Screen
        backBehavior="none"
        name="Login"
        component={Login}
        options={{
          backBehavior: 'none',
          headerShown: false,
          drawerLabel: 'Login',
          drawerLabelStyle: {
            marginBottom: -10,
            color: '#ffffff',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            paddingBottom: 20,
            width: 140,
            fontSize: 17,
            marginLeft: Dimensions.get('window').width * 5 / 100,
          }
        }}
      />
    </Drawer.Navigator>
  )
}

const Stack = createNativeStackNavigator()

function NotificationStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: false }}
    >
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  )
}

function NewsStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListNews" component={ListNews} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  const [background, setBackground] = useState('')
  const handleLogged = async () => {
    await AsyncStorage.getItem('@background').then((value) => {
      setBackground(value)
    })
  }

  useEffect(() => {
    handleLogged()
  }, [])


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          gestureEnabled: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            height: 60,
            marginRight: 25,
            marginLeft: 25,
            borderRadius: 100,
            marginBottom: 20,
            position: 'absolute'
          },
          tabBarIcon: () => {
            if (route.name === 'Login') {
              return (
                <FontAwesome
                  name="user-o"
                  style={{
                    color: 'white',
                    fontSize: 26,
                    zIndex: 9,
                    marginBottom: 50,
                    elevation: 5,
                    backgroundColor: background || backgroundCustom,
                    width: 70,
                    height: 70,
                    textAlign: 'center',
                    paddingTop: 19,
                    borderRadius: 100,
                    borderColor: '#ffffff',
                    borderWidth: 1
                  }}
                />
              )
            }
            if (route.name === 'Nosotros') {
              return (
                <FontAwesome
                  name="newspaper-o"
                  style={{ color: 'black', fontSize: 27, padding: 5 }}
                />
              )
            }
            if (route.name === 'Options') {
              return (
                <IonIcons
                  name="menu-sharp"
                  style={{ color: 'black', fontSize: 32, padding: 5 }}
                />
              )
            }
            return
          },
          headerShown: true
        })}
      >
        <Tab.Screen
          name="Options"
          // backBehavior='none'
          component={MyDrawer}
          options={{
            headerShown: false
            // , backBehavior:'none'
          }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.dispatch(DrawerActions.toggleDrawer())
            }
          })}
        />
        <Tab.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Nosotros"
          component={We}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
