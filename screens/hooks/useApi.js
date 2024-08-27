import { useState, useEffect } from 'react'
import axios from 'axios'

import Constants from '../../services/Constants'
import { handleExpoToken } from './../../firebase'

function useApi(path, options) {
  const {
    method = 'post',
    body,
    manual = false,
    withToken = true,
    expoToken = null
  } = options

  const baseUrl = Constants.url
  const url = path !== null ? baseUrl + path : null

  let token
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!manual)
  const [status, setStatus] = useState('')
  async function execute(args = {}) {
    const finalUrl = args.path ? baseUrl + args.path : url
    if (!finalUrl) return null

    const finalBody = {
      ...(body || {}),
      ...(args.body || {})
    }
    if (
      !finalBody?.authorization ||
      !finalBody?.urlLogin ||
      !finalBody?.urlSession ||
      !finalBody?.urlValidateUser
    ) {
      setStatus('Esta empresa no posee configurada las apis correctamente')
      return null
    } else if (!finalBody?.cedula) {
      setStatus('Debes introducir tu usuario')
      return
    } else if (!finalBody?.contrasena) {
      setStatus('Debes introducir tu contraseña')
      return
    }

    const baseHeaders = {
      Authorization: 'Basic ' + finalBody?.authorization,
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Enconding': 'gzip, deflate, br',
      Connection: 'keep-alive'
    }
    let res = false
    //validate user
    try {
      setLoading(true)
      res = await axios({
        method,
        url: finalBody?.urlValidateUser,
        data: {
          cedula: finalBody?.cedula
        },
        headers: baseHeaders
      })
    } catch (error) {
      setStatus('Usuario no existe')
      setLoading(false)
    }

    if (!res?.data?.data?.exist) {
      setStatus('Usuario no existe')
      return
    }

    let result = null
    try {
      const baseHeadersLogin = {
        Authorization: 'Basic ' + finalBody?.authorization,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Enconding': 'gzip, deflate, br',
        Connection: 'keep-alive'
      }
      setLoading(true)
      result = await axios({
        method,
        url: finalBody?.urlLogin,
        data: finalBody,
        headers: baseHeadersLogin
      })
      handleExpoToken({ token: expoToken, email: result?.data?.data?.correo })
      setData(result.data.data)
    } catch (error) {
      setStatus('Contraseña inválida')
      setLoading(false)
      return
    }
    if (!result?.data?.data) {
      setStatus('Contraseña inválida')
      return
    }

    try {
      const baseHeadersSession = {
        Authorization: 'Basic ' + finalBody?.authorization,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Accept: '*/*',
        'Accept-Enconding': 'gzip, deflate, br',
        Connection: 'keep-alive'
      }

      const res = await axios({
        method,
        url: finalBody?.urlSession,
        data: {
          cc_socio: result?.data?.data?.cc_socio,
          nombre_apellido: result?.data?.data?.Nombre_Apellido,
          correo: result?.data?.data?.correo,
          nit: result?.data?.data?.nit,
          celular: result?.data?.data?.celular
        },
        headers: baseHeadersSession
      })
      setStatus('')
      setLoading(false)
    } catch (error) {
      setStatus('Error en el servidor. Inténtelo mas tarde.')
      return null
    }

    console.log('res', res?.data?.data)
    return result
  }
  useEffect(() => {
    if (withToken && !token) return
    if (manual) return
    execute()
  }, [token])

  // to allow for urls to be loaded asynchronously
  if (!url) return [null, null, null, null, null]
  execute.token = token
  return [data, execute, loading, status]
}

export default useApi
