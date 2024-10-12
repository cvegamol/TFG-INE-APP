import React, { useState } from "react";
import { withExpoSnack } from "nativewind";
import {
     View,
     Text,
     TouchableOpacity,
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
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/authContext";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TextStyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ChangePassword = () => {
     const router = useRouter();
     const { user, updateUserPassword, db } = useAuth();
     const [loading, setLoading] = useState(false);
     const [passwordForm, setPasswordForm] = useState({
          oldPassword: "",
          newPassword: "",
     });

     const handleChange = (name, value) => {
          setPasswordForm({ ...passwordForm, [name]: value });
     };

     const handleChangePassword = async () => {
          const { oldPassword, newPassword } = passwordForm;
          console.log(oldPassword)
          if (!oldPassword || !newPassword) {
               Alert.alert("Error", "Por favor, rellena ambos campos.");
               return;
          }
          try {
               setLoading(true);
               console.log("Dentro")

               const result = await updateUserPassword(oldPassword, newPassword);
               console.log("Dentro2")
               if (result.success) {
                    Alert.alert("Éxito", "Contraseña actualizada correctamente.");
               } else {
                    Alert.alert("Error", result.msg);
               }
          } catch (error) {
               Alert.alert("Error", "Ocurrió un problema al cambiar la contraseña.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
               <ViewStyled className="flex-1 justify-center items-center">
                    <ViewStyled className="bg-white/40 rounded-2xl p-6 mx-auto w-full max-w-md backdrop-blur-xl border-2 border-white">
                         <StatusBar style="dark" />
                         <ViewStyled className="flex-1 justify-center space-y-6">
                              <TextStyled
                                   style={{ fontSize: hp(3.5) }}
                                   className="font-bold tracking-wider text-center text-neutral-800"
                              >
                                   Cambiar Contraseña
                              </TextStyled>

                              {[{
                                   placeholder: "Contraseña actual", icon: <FontAwesome6 name="lock" size={hp(2.5)} color="gray" />, name: "oldPassword", secureTextEntry: true
                              }, {
                                   placeholder: "Nueva contraseña", icon: <Octicons name="key" size={hp(2.5)} color="gray" />, name: "newPassword", secureTextEntry: true
                              }].map((input, index) => (
                                   <ViewStyled
                                        key={index}
                                        style={{ height: hp(6), paddingVertical: hp(0.8) }}
                                        className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md"
                                   >
                                        {input.icon}
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange(input.name, value)}
                                             value={passwordForm[input.name]}
                                             style={{
                                                  fontSize: hp(2),
                                                  textAlignVertical: 'center',
                                                  paddingVertical: 0,
                                                  marginTop: hp(0.3),
                                             }}
                                             className="flex-1 font-medium text-neutral-800"
                                             placeholder={input.placeholder}
                                             placeholderTextColor="#172554"
                                             secureTextEntry={input.secureTextEntry}
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
                                             onPress={handleChangePassword}
                                             style={{ height: hp(6) }}
                                             className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md"
                                        >
                                             <TextStyled
                                                  style={{ fontSize: hp(2.2) }}
                                                  className="text-white font-bold tracking-wider"
                                             >
                                                  Cambiar Contraseña
                                             </TextStyled>
                                        </StyledTouchableOpacity>
                                   )}
                              </ViewStyled>
                         </ViewStyled>
                    </ViewStyled>
               </ViewStyled>
          </ScrollView>
     );
};

export default withExpoSnack(ChangePassword);
