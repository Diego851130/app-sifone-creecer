/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import HeaderNotification from '../components/HeaderNotification'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import * as Font from 'expo-font'
import { handleFirebase, handleNotification } from './../../firebase'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const customFonts = {
  Poppins: require('../../assets/Poppins/Poppins-Regular.ttf'),
  'Poppins-SemiBold': require('../../assets/Poppins/Poppins-SemiBold.ttf')
}

const Notification = ({ navigation }) => {
  const [spinner, setSpinner] = useState(false)
  const [notifications, setNotifications] = useState(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [textColor, setTextColor] = useState(undefined)
  const [textColor2, setTextColor2] = useState(undefined)
  const [background, setBackground] = useState(undefined)

  const _loadFontsAsync = async () => {
    // Font.loadAsync(customFonts)
    setFontsLoaded(true)
  }

  useFocusEffect(
    useCallback(() => {
      _loadFontsAsync()
      loadNotifications()
      const handleLogged = async () => {
        await AsyncStorage.getItem('@nameCompany').then((value) => {
          setCompanyName(value)
        })
        await AsyncStorage.getItem('@colorText').then((value) => {
          setTextColor(value)
        })

        await AsyncStorage.getItem('@colorTextSecundario').then((value) => {
          setTextColor2(value)
        })
        await AsyncStorage.getItem('@background').then((value) => {
          setBackground(value)
        })
      }
      handleLogged()
    }, [])
  )

  const loadNotifications = async () => {
    try {
      const notifications = await handleFirebase()
      setNotifications(notifications)
      setSpinner(false)
    } catch (e) {
      console.log('error get notifications ', e)
    }
  }

  const goEditNew = async (element) => {
    const { navigate } = navigation
    try {
      navigate('Detail', {
        itemNew: element
      })
    } catch (error) {
      console.log('error rdirect to detail', error)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={{
          textAlign: 'center',
          flexDirection: 'row',
          width: '100%'
        }}
        accessibilityRole="button"
        onPress={() => {
          goEditNew(item)
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 10 }}
          source={{ uri: item?.images }}
          resizeMode='contain'
        />
        <View
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        >
          <Text
            style={{
              paddingLeft: 20,
              paddingTop: 0,
              paddingBottom: 0,
              fontSize: 11,
              color: background ? '#ffffff' : textColor2
            }}
          >
            {item.title}{' '}
          </Text>
          {/* <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              paddingLeft: 20,
              paddingTop: 0,
              paddingBottom: 0,
              fontSize: 11
            }}
          >
            {item.viewed ? 'Leido' : 'Nuevo'}
          </Text> */}
        </View>
      </TouchableOpacity>
    </View>
  )

  if (!fontsLoaded) {
    return <Text>Loading</Text>
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: spinner ? 'white' : background }}
      >
        <HeaderNotification navigation={navigation} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'stretch',
            marginBottom: 0,
            padding: 20,
            flex: 1,
            backgroundColor: background
          }}
        >
          <View style={{ height: 0 }} />
          {spinner ? (
            <SifoneSpinner visible={spinner} />
          ) : (
            <>
              {notifications?.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  data={notifications}
                  renderItem={renderItem}
                  keyExtractor={(newItem) => String(newItem.id)}
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    padding: 30
                  }}
                >
                  {'No existen notificaciones actualmente'}
                </Text>
              )}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}

Notification.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  item: {
    textAlign: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 0,
    padding: 20,
    flex: 1,
    backgroundColor: '#E1E1E1'
  },
  row: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 5,
    borderBottomWidth: 0.5,
    marginBottom: 10
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    paddingBottom: 4,
    alignSelf: 'center',
    alignContent: 'center',
    width: '60%',
    alignItems: 'center'
  },
  modal: {
    padding: 16,
    width: '60%'
  }
})

export default Notification
