//import { async } from '@firebase/util';
import React, { useEffect, useState } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc, getDoc, doc,deleteDoc, getDocs,setDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCQqc9mN--Qi5XQ-qiJ__vAXgIaIfzByQ",
  authDomain: "definitiva-tarea.firebaseapp.com",
  projectId: "definitiva-tarea",
  storageBucket: "definitiva-tarea.appspot.com",
  messagingSenderId: "564061008977",
  appId: "1:564061008977:web:6d266d392ba4f2fe56f470"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//import appfirebase from './firebase';


  const db = getFirestore(app);

const App = () => {
  const valorinicial = {
    nombre:'',
    apellido:''


  }
//Variables de estado.  
const [user, setUser] = useState(valorinicial)
const [lista, setLista] = useState([])
const [subId, setSubId ] = useState('')
const [error,setError]=React.useState(null)


  //Cargar estados al firestore.
  const capturarInputs = (e) =>{
    const {name, value} = e.target;
    setUser({...user, [name]:value})
    if(error==='Ingrese el Nombre'){
      setError(null)
    }

  }
  const capturarInputs2 = (e) =>{
    const {name, value} = e.target;
    setUser({...user, [name]:value})
    if(error==='Ingrese el Apellido'){
      setError(null)
    }

  }
  const guardarDatos = async(e)=>{
    e.preventDefault();
    if (!user.nombre.trim()){
      //alert('Ingrese el Nombre')
      setError('Ingrese el Nombre')
      return
    }
    if (!user.apellido.trim()){
      //alert('Ingrese el Apellido')
      setError('Ingrese el Apellido')
      return
    }
    //console.log(user);
    if(subId=== ''){
      try {
        await addDoc(collection(db,'usuarios'),{
          ...user
          
        })
      } catch (error) {
        console.log(error);
        
      }
    }
    else{
      await setDoc(doc(db,"usuarios", subId),{
        ...user
      })
    }
    setUser({...valorinicial})
    setSubId('')
    setError (null)

  }
  //Funcion para mostrar la lista de la base de datos.
    useEffect(()=>{
      const getLista = async()=>{
        try {
          const querySnapshot = await getDocs(collection(db, 'usuarios'))
          const docs = []
        querySnapshot.forEach((doc)=>{
          docs.push({...doc.data(), id:doc.id})
        })
         setLista(docs)   
          
        } catch (error) {
          console.log(error)
        }
      }
      getLista()
    },[lista])
    
    //Funcion para eliminar de la base de datos.
    const deleteUser= async(id)=>{
      await deleteDoc(doc(db, 'usuarios', id))
    }

    //fUNCION PARA EDITAR UN ID DE LA BASE DE DATOS.

    const getOne = async(id)=>{
      try {
        const docRef = doc(db, "usuarios", id)
        const docSnap = await getDoc(docRef)
        setUser(docSnap.data())
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      if(subId!==''){
        getOne(subId)
      }
    },[subId])

  return (
    <div className='container'>
      <p> Bievenido, por favor ingresa tus datos.</p>
      <hr/>
        <div className="row">
          <div className="col-md-4">
            <h3 className='text-center mb-3'>{subId=== ''? 'Llene los campos.': 'Por favor, edite'}</h3>
            <form onSubmit={guardarDatos}>
            {
                error ?(
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ):null
              }
              <div className='card card-body'>
                <div className='form-group'>
                <input type="text" 
              placeholder="Ingrese Nombre."
              className="form-control mb-3"
              name='nombre'
              onChange={capturarInputs }
              value={user.nombre}
               />
               <input type="text" 
              placeholder="Ingrese Apellido."
              className="form-control mb-3"
              name='apellido'
              onChange={capturarInputs2} 
              value={user.apellido}
               />
                  
                </div>
                <div className="d-grid gap-2">{
                  subId=== ''?
                (<button className='btn btn-primary'>
                  Guardar.
                </button>):
                (<button className='btn btn-warning'>
                   Editar.
              </button>)}
                </div>
              </div>

            </form>
          </div>
          <div className="col-md-8">
            <h2 className='text-center mb-5'>Lista de ususarios.</h2>
            <div className='container card'>
              <div className='card-body'>{
                lista.map(list=>(
                  <div key={list.id}>
                    <p>Nombre: {list.nombre}</p>
                    <p>Apellido: {list.apellido}</p>
                    <button className='btn btn-danger' onClick={()=>deleteUser(list.id)}>
                      Eliminar
                    </button>
                    <button className='btn btn-success m-1' onClick={()=>setSubId(list.id)}>
                      Editar
                    </button>
                    <hr/>
                  </div>  
                ))

              }

              </div>
            </div>
          </div>

        </div>
    </div>
  )
}

export default App;
