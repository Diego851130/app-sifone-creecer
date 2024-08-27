import React from 'react'
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native'

function SifoneSpinner({ visible, color }) {
  if (!visible) return null
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', zIndex: 11
      }}
    >
      <ActivityIndicator animating={visible} size={50} color={'#2ab189'} />
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SifoneSpinner
