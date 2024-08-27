import React, { useState, useCallback } from 'react'
import { Text, TouchableOpacity, View, Image, Dimensions } from 'react-native'
import AntIcons from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const HeaderNews = (props) => {
  const [logo, setLogo] = useState(undefined)

  const handleLogged = async () => {
    await AsyncStorage.getItem('@logo').then((value) => {
      setLogo(value)
    })
  }

  useFocusEffect(
    useCallback(() => {
      handleLogged()
    }, [])
  )

  const goToLogin = () => {
    props.navigation.goBack()
  }

  const goToChat = () => {
    props.navigation.navigate('Notification')
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: (Dimensions.get('window').height * 4) / 100,
        backgroundColor: 'white',
        paddingBottom: 5
      }}
    >
      <TouchableOpacity
        onPress={() => {
          goToLogin()
        }}
      >
        <View>
          <Text style={{ marginLeft: 20 }}>
            <AntIcons name="left" style={{ color: props?.hideArrow ? "transparent" : 'black', fontSize: 20 }} />
          </Text>
        </View>
      </TouchableOpacity>
      <View>
        <Image
          style={{
            resizeMode: 'contain',
            width: 100,
            height: 20
          }}
          source={{
            uri: logo
              ? logo
              : 'https://www.sifonecompany.com/app/wp-content/uploads/2022/04/Logo-Sifone-negro-2.png'
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          goToChat()
        }}
      >
        <View>
          <Text style={{ marginRight: 20 }}>
            {' '}
            <FontAwesome name="bell" style={{ color: 'black', fontSize: 20 }} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default HeaderNews
