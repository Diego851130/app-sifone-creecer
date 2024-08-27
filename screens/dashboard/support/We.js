import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Image, Button, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import { Ionicons } from '@expo/vector-icons'
import Accordion from 'react-native-collapsible/Accordion'
import Header from '../../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSecctions } from './../../../firebase'
import { useFocusEffect } from '@react-navigation/native'
import backgroundCustom from './../../constanst';

const We = ({ navigation }) => {
  const [activeSections, setActiveSections] = useState([])
  const [sections, setSections] = useState([])
  const [spinner, setSpinner] = useState(false)
  const [logo, setLogo] = useState(undefined)
  const [textColor, setTextColor] = useState(undefined)
  const [background, setBackground] = useState('')
  const [loading, setLoading] = useState(false)


  const _updateSections = (activeSections) => {
    setActiveSections(activeSections)
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
      }
      handleLogged()
    }, [])
  )

  useEffect(() => {
    setLoading(true)
    const loadSections = async () => {
      setSpinner(true)
      try {
        const sections = await getSecctions()
        setSections(sections)
        setSpinner(false)
      } catch (e) {
        console.log('error get sections ', e)
      }
    }
    loadSections()


    setTimeout(
      function () {
        setLoading(false)
      }, 3000);

  }, [])

  const _renderHeader = (section) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <Text style={{ paddingLeft: 10, color: textColor }}>
          {section.title.toUpperCase()}
        </Text>

        {/* <Button
          onPress={async () => await AsyncStorage.clear()}
          title={'clear'}
        /> */}
        <Ionicons name={'chevron-down-sharp'} size={20} color={'black'} />
      </View>
    )
  }

  const _renderContent = (section) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{
            marginTop: 25,
            marginBottom: 25,
            resizeMode: 'contain',
            width: 150,
            height: 30
          }}
          source={{
            uri: logo
              ? logo
              : 'https://www.sifonecompany.com/app/wp-content/uploads/2022/04/Logo-Sifone-negro-2.png'
          }}
        />
        <Text
          style={{
            textAlign: 'justify',
            fontSize: 11,
            padding: 20
          }}
        >
          {section?.description}
        </Text>
      </View>
    )
  }

  return (
    <>
      {loading ? <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'white', zIndex: 100 }}>

        <View
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', zIndex: 11
          }}
        >
          <ActivityIndicator animating={true} size={50} color={'black'} />
          <Text style={{ marginTop: 20 }}>Cargando noticias</Text>
        </View>
      </View> : <KeyboardAwareScrollView
        style={{ backgroundColor: background || backgroundCustom, paddingBottom: 160, }}
        enableOnAndroid
      >
        <Header navigation={navigation} hideArrow={true} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 160,
            paddingTop: 40
          }}
        >
          <Accordion
            sections={sections}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            align={'center'}
            duration={300}
            sectionContainerStyle={{
              backgroundColor: 'white',
              borderRadius: 20,
              marginBottom: 20
            }}
            containerStyle={{
              width: '90%'
            }}
            underlayColor={'transparent'}
          />
        </View>
      </KeyboardAwareScrollView>}

    </>
  )
}

We.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'stretch',
    paddingLeft: 32,
    paddingRight: 32
  },
  bottom: {
    bottom: 0,
    flexDirection: 'row'
  },
  header: {
    borderWidth: 1,
    height: 45
  }
})

export default We
