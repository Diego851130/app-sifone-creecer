import React, { useCallback, useState } from 'react'
import {
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import useInput, { validateRequired } from '../../hooks/useInput'
import useApi from '../../hooks/useApi'
import AuthStyles from '../AuthStyles'
import SifoneTextInputLogin from '../../components/SifoneTextInputLogin'
import SifoneButton from '../../components/SifoneButton'
import { getCompany } from '../../../firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import env from '../../../env'

function Login({ navigation }) {
  const [email, validateEmail] = useInput('', {
    placeholder: 'Usuario',
    validate: (...args) => validateRequired(...args),
    props: {
      autoCapitalize: 'none',
      keyboardType: 'numeric',
      maxLength: 19
    }
  })

  const [password, validatePassword] = useInput('', {
    placeholder: 'Contraseña',
    validate: validateRequired,
    props: {
      secureTextEntry: true
    }
  })
  const [hidePass, setHidePass] = useState(true)
  const [logged, setLogged] = useState(null)
  const [celular, setCelular] = useState(null)
  const [mainBackground, setMainBackground] = useState(null)
  const [loader, setLoader] = useState(false)
  const [loader2, setLoader2] = useState(true)
  const [user, setUser] = useState(null)
  const [name, setName] = useState(null)
  const [expoToken, setExpoToken] = useState(null)
  const [background, setBackground] = useState(undefined)
  const [urlLogin, setUrlLogin] = useState('')
  const [urlMainLogin, setUrlMainLogin] = useState('')
  const [urlValidateUser, setUrlValidateUser] = useState('')
  const [urlSession, setUrlSession] = useState('')
  const [authorization, setAuthorization] = useState('')
  const [logo, setLogo] = useState(undefined)

  const useApiOpts = {
    method: 'post',
    manual: true,
    withToken: false,
    expoToken
  }

  const [data, doLogin, loading, status] = useApi('login', useApiOpts)

  const handleLogin = useCallback(
    async ({ closeOtherSessions = false } = {}) => {
      setLoader(true)
      setLoader2(true)
      const payload = {
        cedula: email.value,
        contrasena: password.value,
        urlLogin,
        urlSession,
        urlValidateUser,
        authorization
      }

      if (closeOtherSessions) {
        payload.close_other_sessions = true
      }

      let response
      try {
        response = await doLogin({ body: payload })
      } catch (err) {
        setLoader(false)
        setLoader2(false)
        return
      }

      if (response && response.data && response?.data?.data) {
        await AsyncStorage.setItem('@celular', response?.data?.data?.celular)
        setCelular(response?.data?.data?.celular)
        await AsyncStorage.setItem('@logged', 'true')
        setLogged('true')
        await AsyncStorage.setItem(
          'Nombre_Apellido',
          response?.data?.data.Nombre_Apellido
        )
        setName(response?.data?.data.Nombre_Apellido)
        await AsyncStorage.setItem('@user', response?.data?.data.cc_socio)
        setUser(response?.data?.data.cc_socio)
      }
      setLoader(false)
      setTimeout(() => setLoader2(false), 2000)
    },
    [doLogin, validateEmail, validatePassword]
  )

  const goToLogin = () => {
    navigation.navigate('Nosotros')
  }

  const goToNotification = () => {
    navigation.navigate('Notification')
  }

  const handleClear = async () => {
    try {
      let key = ['@user', 'user']
      await AsyncStorage.clear()
      await AsyncStorage.multiRemove(key)
      await AsyncStorage.removeItem('@user')
      await AsyncStorage.removeItem('user')
      await AsyncStorage.setItem('@background', mainBackground)
      const loadCompany = async (id) => {
        try {
          const company = await getCompany(id)

          await AsyncStorage.setItem('@logo', company?.images)
          await AsyncStorage.setItem('@apiSesion', company?.apiSession)
          await AsyncStorage.setItem(
            '@apiValidateUser',
            company?.apiValidateUser
          )
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
      setUser(null)
      setName(null)
    } catch (error) {
      console.log('error remove user', error)
    }
    navigation.navigate('Web')
  }

  const Header = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingTop: (Dimensions.get('window').height * 6) / 100,
          paddingBottom: 0
        }}
      >
        <TouchableOpacity
          onPress={() => {
          }}
        >
          <View>
            <Text style={{ marginLeft: 30 }}>
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            goToNotification()
          }}
        >
          <View>
            <Text style={{ marginRight: 30 }}>
              <FontAwesome
                name="bell"
                style={{ color: 'black', fontSize: 22, padding: 5 }}
              />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const handleLogged = async () => {
    await AsyncStorage.getItem('@user').then((value) => {
      setUser(value)
    }).then(e => console.log('Logueado'))
    await AsyncStorage.getItem('Nombre_Apellido').then((value) => {
      setName(value)
    })
    await AsyncStorage.getItem('@logo').then((value) => {
      setLogo(value)
    })
    await AsyncStorage.getItem('@logged').then((value) => {
      setLogged(value)
    })
    await AsyncStorage.getItem('@background').then((value) => {
      setMainBackground(value)
    })
    await AsyncStorage.getItem('@backgroundSecond').then((value) => {
      setBackground(value)
    })
    await AsyncStorage.getItem('@expoToken').then((value) => {
      setExpoToken(value)
    })
    await AsyncStorage.getItem('@apiMainLogin').then((value) => {
      setUrlMainLogin(value)
    })
    await AsyncStorage.getItem('@apiSesion').then((value) => {
      setUrlSession(value)
    })
    await AsyncStorage.getItem('@apiValidateUser').then((value) => {
      setUrlValidateUser(value)
    })
    await AsyncStorage.getItem('@authorization').then((value) => {
      setAuthorization(value)
    })
    await AsyncStorage.getItem('@apiLogin').then((value) => {
      setUrlLogin(value)
    })
  }

  useFocusEffect(
    useCallback(() => {
      handleLogged()
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      setLoader2(true)
      const initLogin = setTimeout(() => setLoader2(false), 4000)
      return () => {
        clearTimeout(initLogin)
      }
    }, [])
  )

  if (
    loader === false &&
    loader2 === false &&
    user != null &&
    name !== null
  ) {
    return (
      <>
        <TouchableOpacity
          onPress={handleClear}
          style={{
            backgroundColor: mainBackground,
            borderWidth: 1,
            borderColor: '#ffffff',
            width: 70,
            height: 25,
            borderRadius: 20,
            position: 'absolute',
            top: 45,
            zIndex: 30,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>
            Salir
          </Text>
        </TouchableOpacity>
        <WebView
          style={{
            flex: 1,
            marginTop: (Dimensions.get('window').height * 5) / 100
          }}
          sharedCookiesEnabled={true}
          javaScriptEnabled={true}
          source={{
            uri: urlMainLogin
          }}
        />
      </>
    )
  }

  if (loader2) {
    <View
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background,
        position: 'absolute',
        zIndex: 20
      }}
    >
      <ActivityIndicator animating={true} size={50} color={'#2ab189'} />
    </View>
  }

  return (
    <>
      {loader2 ? (
        <View
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
            position: 'absolute',
            zIndex: 20
          }}
        >
          <ActivityIndicator animating={true} size={50} color={'#2ab189'} />
        </View>
      ) : (
        <>
          {user && name && logged ? (
            <>
              <TouchableOpacity
                onPress={handleClear}
                style={{
                  backgroundColor: mainBackground,
                  borderWidth: 1,
                  borderColor: '#ffffff',
                  width: 70,
                  height: 25,
                  borderRadius: 20,
                  position: 'absolute',
                  top: 45,
                  zIndex: 30,
                  right: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 13, textAlign: 'center' }}
                >
                  Salir
                </Text>
              </TouchableOpacity>
              <WebView
                style={{
                  flex: 1,
                  marginTop: (Dimensions.get('window').height * 5) / 100
                }}
                sharedCookiesEnabled={true}
                javaScriptEnabled={true}
                source={{
                  uri: urlMainLogin
                }}
              />
            </>
          ) : (
            <>
              {/* {loader === false && loader2 === false && user != null } */}
              <KeyboardAwareScrollView
                style={{ backgroundColor: background, height: '100%' }}
              >
                <Header />
                <ImageBackground
                  style={{
                    height: 700,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <FontAwesome
                      name="user-circle-o"
                      style={{
                        color: 'white',
                        fontSize: 100,
                        zIndex: 9,
                        marginBottom: 10
                      }}
                    />
                    <View>
                      <SifoneTextInputLogin
                        passw={false}
                        user={true}
                        {...email}
                        textInputStyle={styles.inputTextLogin}
                      />
                      <SifoneTextInputLogin
                        passw={true}
                        textInputStyle={styles.inputTextLogin}
                        setHidePass={setHidePass}
                        {...password}
                        hidePass={hidePass}
                        background={background}
                      />
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          paddingHorizontal: 20
                        }}
                      >
                        {status}
                      </Text>
                      <View
                        style={{
                          marginRight: '7%',
                          marginLeft: '7%',
                          marginTop: 20
                        }}
                      >
                        {loader ? (
                          <View
                            style={{
                              height: 30,
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <ActivityIndicator
                              animating={loader}
                              size={30}
                              color={'#2ab189'}
                            />
                          </View>
                        ) : (
                          <SifoneButton
                            textStyle={styles.buttonTextDark}
                            variant="filled"
                            onPress={() => {
                              setLoader(true)
                              handleLogin()
                            }}
                          >
                            Ingresar Ahora
                          </SifoneButton>
                        )}
                      </View>
                      <View style={{ paddingBottom: 0, alignItems: 'center' }}>
                        <Image
                          style={{
                            marginTop: 25,
                            marginBottom: 25,
                            resizeMode: 'contain',
                            width: '40%',
                            height: 50, borderRadius: 30
                          }}
                          source={{
                            uri: logo
                              ? logo
                              : 'https://www.sifonecompany.com/app/wp-content/uploads/2022/04/Logo-Sifone-negro-2.png'
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </KeyboardAwareScrollView>
            </>
          )}
        </>
      )}
    </>
  )
}

Login.navigationOptions = null

const styles = StyleSheet.create({
  ...AuthStyles,
  textInputContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  buttonTextDark: {
    color: 'white',
    fontSize: 14
  },
  inputTextLogin: {
    fontWeight: 'bold',
    width: '77%',
    paddingLeft: 20
  }
})

export default Login
