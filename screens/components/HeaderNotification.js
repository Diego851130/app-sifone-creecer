import React from 'react'
import { Text, View, Dimensions } from 'react-native'
import AntIcons from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const HeaderNotification = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Dimensions.get('window').height * 4) / 100,
        backgroundColor: 'white',
        paddingBottom: 5
      }}
    >
      <View style={{ width: '100%', flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          Notificaciones
        </Text>
      </View>
    </View>
  )
}
export default HeaderNotification
