import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  setDoc,
  doc,
  updateDoc,
  where
} from 'firebase/firestore'
import environment from './env'

const firebaseConfig = {
  apiKey: 'AIzaSyA2kY_BOCqqLBwbpjAG0-3DoHRYYIS77Qk',
  authDomain: 'sifone-app-cc2a8.firebaseapp.com',
  projectId: 'sifone-app-cc2a8',
  storageBucket: 'sifone-app-cc2a8.appspot.com',
  messagingSenderId: '479141844146',
  appId: '1:479141844146:web:fe1a3fa35135883b0065ab',
  measurementId: 'G-R8GZXZSMF0'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const handleFirebase = async () => {
  let news = []
  try {
    const q = query(
      collection(db, 'news'),
      where('companyId', '==', environment.COMPANY_ID),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      news.push({ id: doc.id, ...doc.data() })
    })
  } catch (error) {
    console.log('Error getting news by company', error)
  }

  return news
}

export const getSecctions = async () => {
  let sections = []
  try {
    const q = query(
      collection(db, 'sections'),
      where('companyId', '==', environment.COMPANY_ID),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      sections.push({ id: doc.id, ...doc.data() })
    })
  } catch (error) {
    console.log('Error getting sections by company', error)
  }

  return sections
}

export const handleNew = async (id) => {
  const ref = doc(db, 'news', id)
  const docSnap = await getDoc(ref)
  const response = docSnap.data()
  return response
}

export const getCompany = async (id) => {
  let response
  try {
    const ref = doc(db, 'companies', id)
    const docSnap = await getDoc(ref)
    response = docSnap.data()
  } catch (error) {
    console.log('error getting company ', error)
  }

  return response
}

export const handleNotification = async (id) => {
  const ref = doc(db, 'news', id)
  await updateDoc(ref, {
    viewed: true
  })
}

export const handleExpoToken = async ({ token, email }) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email))
    let users = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      users.push(doc.id)
    })
    if (users[0]) {
      const userRef = doc(db, 'users', users[0])
      setDoc(userRef, { token }, { merge: true })
    }
  } catch (error) {
    console.log('error set token ', error)
  }
}

export const handleExpoTokenUsersByCompany = async (token, idCompany) => {

  try {
    const q = query(collection(db, 'expo_token_by_company'), where('token', '==', token), where('idCompany', '==', idCompany))
    let items = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      items.push(doc.id)
    })

    if (items.length == 0) {
      const company = doc(collection(db, 'expo_token_by_company'));
      await setDoc(company, {
        token,
        idCompany,
        updatedAt: Date.now()
      });
    }

  } catch (error) {
    console.log('Error saving expo token by company : ', error);
  }
}

