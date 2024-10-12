import React, { useState, useEffect } from "react";
import { withExpoSnack } from "nativewind";
import {
     View,
     Text,
     Image,
     TouchableOpacity,
     Pressable,
     Alert,
     TextInput,
     ScrollView,
} from "react-native";
import { styled } from "nativewind";
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import {
     AntDesign,
     FontAwesome6,
     MaterialIcons,
     Octicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/authContext";
import { ImageBackground } from "react-native";
import { doc, getDoc } from "firebase/firestore"; // Asegúrate de importar esto si no lo has hecho

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TextStyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const PressableStyled = styled(Pressable);

const Perfil = () => {
     const router = useRouter();
     const { user, updateUser, db } = useAuth();  // Asegúrate de que `db` y `updateUser` estén disponibles en el contexto
     const [loading, setLoading] = useState(false);
     const [form, setForm] = useState({
          email: user?.email || "",
          name: user?.name || "",
          surname: user?.surname || "",
     });

     // Cargar los datos de Firebase al montar el componente
     useEffect(() => {
          const fetchUserData = async () => {
               try {
                    setLoading(true);
                    console.log('Usuario id', user)
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    console.log('Usuarios', docSnap)
                    if (docSnap.exists()) {
                         const data = docSnap.data();
                         console.log('Usuarios', data)
                         setForm({
                              email: data.email || user.email,
                              name: data.name || user.name,
                              surname: data.surname || user.surname,
                         });
                    }
               } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                    Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
               } finally {
                    setLoading(false);
               }
          };

          fetchUserData();
     }, [user.uid, db]);  // Ejecutar cuando el ID del usuario o la referencia a la base de datos cambie

     const handleChange = (name, value) => {
          setForm({ ...form, [name]: value });
     };

     const handleUpdateProfile = async () => {
          const { email, name, surname } = form;
          if (!email || !name || !surname) {
               Alert.alert("Perfil", "Por favor, rellena todos los campos.");
               return;
          }
          try {
               setLoading(true);
               const result = await updateUser(user.uid, { email, name, surname });
               if (result.success) {
                    Alert.alert("Perfil actualizado", "Los cambios se guardaron correctamente.");
               } else {
                    Alert.alert("Error", result.msg || "No se pudo actualizar el perfil.");
               }
          } catch (error) {
               console.error("Error al actualizar el perfil:", error);
               Alert.alert("Error", "Ocurrió un problema al intentar actualizar tu perfil.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <ImageBackground
               source={require('../../assets/images/login/back-registro.png')}
               resizeMode="cover"
               style={{ flex: 1, justifyContent: 'center', paddingHorizontal: wp(5) }}
          >
               <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <ViewStyled className="flex-1 justify-center items-center">
                         <ViewStyled className="bg-white/40 rounded-2xl p-6 mx-auto w-full max-w-md backdrop-blur-xl border-2 border-white">
                              <StatusBar style="dark" />
                              <ViewStyled className="flex-1 justify-center space-y-6">
                                   <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                                        <TextStyled
                                             style={{ fontSize: hp(3.5) }}
                                             className="font-bold tracking-wider text-center text-neutral-800"
                                        >
                                             Editar Perfil
                                        </TextStyled>

                                        {[{
                                             placeholder: "Nombre", icon: <FontAwesome6 name="circle-user" size={hp(2.5)} color="gray" />, name: "name"
                                        }, {
                                             placeholder: "Apellidos", icon: <FontAwesome6 name="circle-user" size={hp(2.5)} color="gray" />, name: "surname"
                                        }, {
                                             placeholder: "Correo Electrónico", icon: <Octicons name="mail" size={hp(2.5)} color="gray" />, name: "email"
                                        }].map((input, index) => (
                                             <ViewStyled
                                                  key={index}
                                                  style={{ height: hp(6), paddingVertical: hp(0.8) }}
                                                  className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md"
                                             >
                                                  {input.icon}
                                                  <TextStyledInput
                                                       onChangeText={(value) => handleChange(input.name, value)}
                                                       value={form[input.name]} // Mostrar los datos existentes del usuario
                                                       style={{
                                                            fontSize: hp(2),
                                                            textAlignVertical: 'center',
                                                            paddingVertical: 0,
                                                            marginTop: hp(0.3),
                                                       }}
                                                       className="flex-1 font-medium text-neutral-800"
                                                       placeholder={input.placeholder}
                                                       placeholderTextColor="#172554"
                                                       editable={input.name !== "email"} // Hacer que el campo email no sea editable
                                                  />
                                             </ViewStyled>
                                        ))}

                                        <ViewStyled>
                                             {loading ? (
                                                  <ViewStyled className="flex-row justify-center">
                                                       <Loading size={hp(6)} />
                                                  </ViewStyled>
                                             ) : (
                                                  <StyledTouchableOpacity
                                                       onPress={handleUpdateProfile}
                                                       style={{ height: hp(6) }}
                                                       className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md"
                                                  >
                                                       <TextStyled
                                                            style={{ fontSize: hp(2.2) }}
                                                            className="text-white font-bold tracking-wider"
                                                       >
                                                            Guardar Cambios
                                                       </TextStyled>
                                                  </StyledTouchableOpacity>
                                             )}
                                        </ViewStyled>
                                   </ViewStyled>
                              </ViewStyled>
                         </ViewStyled>
                    </ViewStyled>
               </ScrollView>
          </ImageBackground>
     );
};

export default withExpoSnack(Perfil);