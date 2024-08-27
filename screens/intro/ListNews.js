import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Dimensions
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HeaderNews from '../components/HeaderNews'
import * as Notifications from 'expo-notifications'
import { handleFirebase } from '../../firebase'
import { useFocusEffect } from '@react-navigation/native'
import SifoneSpinner from '../components/SifoneSpinner'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

const ListNews = ({ navigation }) => {
  const [spinner, setSpinner] = useState(false)
  const [news, setNews] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [token, setToken] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [textColor, setTextColor] = useState(undefined)
  const [background, setBackground] = useState(undefined)
  const [currentImage, setCurrentImage] = useState(true)

  const notificationListener = useRef()
  const responseListener = useRef()

  const goEditNew = (itemNew) => {
    try {
      const { navigate } = navigation
      navigate('Detail', {
        itemNew
      })
    } catch (error) {
      console.log('error rdirect to detail', error)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={{ textAlign: 'center' }}
        accessibilityRole="button"
        onPress={() => goEditNew(item)}
      >
        <Image
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 140,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
          source={{ uri: item.images }}
        />
        <Text
          style={{
            paddingLeft: 20,
            paddingTop: 5,
            paddingBottom: 0,
            fontSize: 14,
            color: textColor,
            fontWeight: 'bold'
          }}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 0,
            fontSize: 13,
            paddingBottom: 0
          }}
        >
          {item.content}
        </Text>
      </TouchableOpacity>
    </View>
  )

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadNews()
    setRefreshing(false)
  }

  useFocusEffect(
    useCallback(() => {
      const handleLogged = async () => {
        await AsyncStorage.getItem('@logo').then((value) => {
          setLogo(value)
        })
        await AsyncStorage.getItem('@colorText').then((value) => {
          setTextColor(value)
        })
        await AsyncStorage.getItem('@background').then((value) => {
          setBackground(value)
        })
        await AsyncStorage.getItem('@expoToken').then((value) => {
          setToken(value)
        })
      }
      handleLogged()
    }, [])
  )

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        setCurrentImage(false)
      } catch (error) { }
    }, 1300)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const loadNews = async () => {
      setSpinner(true)
      try {
        const res = await handleFirebase()
        setNews(res)
        setSpinner(false)
      } catch (e) {
        console.log('error get news ', e)
      }
    }
    loadNews()
  }, [])

  return (
    <View
      style={{
        backgroundColor: background
      }}
    >
      {false ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: Dimensions.get('window').height,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <Image
            style={{
              resizeMode: 'stretch',
              width: '60%',
              height: 80,
              borderRadius: 15
            }}
            source={{
              uri: logo
            }}
          />
        </View>
      ) : (
        <>
          {spinner ? (
            <SifoneSpinner visible={spinner} />
          ) : (
            <KeyboardAwareScrollView
              style={{ backgroundColor: spinner ? 'white' : background, height: '100%' }}
            >
              <HeaderNews navigation={navigation} hideArrow={true} />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  marginBottom: 0,
                  padding: 20,
                  flex: 1,
                  backgroundColor: spinner ? 'white' : background
                }}
              >
                <View style={{ height: 0 }} />
                {news?.length > 0 ? (
                  <FlatList
                    scrollEnabled={false}
                    data={news}
                    renderItem={renderItem}
                    keyExtractor={(newItem) => String(newItem.id)}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                      />
                    }
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      padding: 30
                    }}
                  >
                    {'No existen noticias actualmente'}
                  </Text>
                )}

                <View
                  style={{
                    height: 100
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          )}
        </>
      )}
    </View>
  )
}

ListNews.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  item: {
    textAlign: 'center'
  },
  row: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
    elevation: 4,
    marginBottom: 14,
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  }
})

export default ListNews
