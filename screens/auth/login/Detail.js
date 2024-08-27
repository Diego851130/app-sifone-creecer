import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import Spinner from 'react-native-loading-spinner-overlay'
import GlobalStyles from '../../GlobalStyles'
import Header from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const customFonts = {
  Poppins: require('../../../assets/Poppins/Poppins-Regular.ttf')
}

const Detail = ({ navigation, route }) => {
  const { itemNew } = route.params
  const [spinner, setSpinner] = useState(false)
  const [logo, setLogo] = useState(undefined)
  const [textColor, setTextColor] = useState(undefined)
  const [background, setBackground] = useState(undefined)

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
  }

  useFocusEffect(
    useCallback(() => {
      handleLogged()
    }, [])
  )

  return (
    <>
      <KeyboardAwareScrollView style={{ height: '100%', backgroundColor: background }}>
        <Header navigation={navigation} />

        {itemNew ? (
          <View
            style={{
              backgroundColor: background,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View style={[styles.container]}>
              <Image
                fadeDuration={300}
                style={{
                  resizeMode: 'stretch',
                  width: '100%',
                  height: 150,
                  borderRadius: 15
                }}
                source={{ uri: itemNew?.images }}
              />
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                  borderRadius: 10,
                  backgroundColor: 'white'
                }}
              >
                <Text
                  style={{
                    // fontFamily: 'Poppins',
                    fontSize: 13,
                    paddingBottom: 15,
                    paddingTop: 10,
                    width: '100%',
                    fontWeight: 'bold',
                    color: textColor
                  }}
                >
                  {itemNew?.title}
                </Text>
                <Text style={styles.content}>{itemNew?.content}</Text>
              </View>
              <Image
                style={{
                  resizeMode: 'contain',
                  width: 100,
                  height: 50,
                  maxHeight: 200,
                  paddingTop: 20,
                  marginTop: 20
                }}
                source={{
                  uri: logo
                    ? logo
                    : 'https://www.sifonecompany.com/app/wp-content/uploads/2022/04/Logo-Sifone-negro-2.png'
                }}
              />
            </View>
          </View>
        ) : (
          <Spinner
            visible={spinner}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
        )}
      </KeyboardAwareScrollView>
    </>
  )
}

Detail.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  ...GlobalStyles,
  active: {
    backgroundColor: 'white'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    padding: 20,
    paddingTop: 20,
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 180,
    width: '90%',
    marginTop: 20,
    borderRadius: 15
  },
  hi: {
    // fontFamily: 'Poppins',
    fontSize: 13,
    paddingBottom: 15,
    paddingTop: 10,
    width: '100%',
    fontWeight: 'bold'
  },
  content: {
    // fontFamily: 'Poppins',
    fontSize: 13,
    paddingBottom: 20,
    paddingTop: 5,
    textAlign: 'justify'
  },
  sign: {
    // fontFamily: 'Poppins',
    fontSize: 13,
    paddingBottom: 20,
    paddingTop: 0,
    width: '100%',
    textAlign: 'justify'
  }
})

export default Detail
