

import React, { useState, useEffect } from 'react'
// import { ScrollView, Text, View, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContainer from './navigation/MainAppNavigator'
import env from './env'
import moment from 'moment'
import { StateProvider } from './screens/hooks/dataUserContext'
import ErrorBoundary from './screens/components/ErrorBoundary'
import { getCompany } from './firebase'
import { LogBox } from 'react-native'
import Notify from './screens/notification/Notify';
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
require('moment/locale/es.js')
moment.locale('es')

/* eslint-disable indent */
const App = () => {

  useEffect(() => {
    const loadCompany = async (id) => {
      try {
        const company = await getCompany(id)
        await AsyncStorage.setItem('@logo', company?.images)
        await AsyncStorage.setItem('@apiSesion', company?.apiSession)
        await AsyncStorage.setItem('@apiValidateUser', company?.apiValidateUser)
        await AsyncStorage.setItem('@authorization', company?.authorization)
        await AsyncStorage.setItem('@apiMainLogin', company?.url)
        await AsyncStorage.setItem('@apiLogin', company?.apiLogin)
        await AsyncStorage.setItem('@nameCompany', company?.name)
        await AsyncStorage.setItem('@colorText', company?.colorText)
        await AsyncStorage.setItem(
          '@colorTextSecundario',
          company?.colorTextSecondario
        )
        await AsyncStorage.setItem('@background', company?.backgroundFirst)
        await AsyncStorage.setItem(
          '@backgroundSecond',
          company?.backgroundSecond
        )
      } catch (e) {
        console.log('error get news adn saving in storage', e)
      }
    }
    loadCompany(env.COMPANY_ID)
  }, [])

  return (
    <ErrorBoundary>
      <StateProvider>
        <AppContainer />
        <Notify />
      </StateProvider>
    </ErrorBoundary>
  )
}

export default App
