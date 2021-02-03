import React, {Component} from 'react';
import { View,StyleSheet,SafeAreaView,Text,TextInput,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import {API_URL} from '../../config/system';
import {inject} from 'mobx-react';
@inject("AuthenticateStore")
export default  class Register extends Component {

    constructor() {
        super();
        this.state = {
            secure:true
        }
    }

    _handleSubmit = (values) => {
        axios.post(`${API_URL}/api/authenticate/register`,{
            ...values
        }).then((res)=>{
            if(res.data.success){
                // kayıt başarılı
                this.props.AuthenticateStore.saveToken(res.data.data.token);
            }
            else
            {
                alert(res.data.message);
            }

        })
            .catch((e)=>console.log(e));
    }

    render() {
        const { secure} = this.state;

        return (
            <View style={style.background}>
                <View style={style.menu}>
                    <View>
                        <Text style={{ color:'white',fontWeight:'700',fontSize:20}}>Sign Up</Text>
                    </View>
                    <View>
                        <Text style={{ color:'#9CA5B4'}}>Already have an account?
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Login')}>
                                <Text style={{ textAlign:'center',textDecorationLine:'underline',color:'#0071DF'}}> Log In</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
                <View style={style.form}>
                    <Formik
                        initialValues={{
                            name:'',
                            email:'',
                            password:''
                        }}
                        onSubmit={this._handleSubmit}
                        validationSchema={Yup.object().shape({
                            name:Yup.string().required('İsim Zorunludur'),
                            email:Yup.string().email("Lütfen geçerli bir email giriniz").required('Email Zorunludur'),
                            password:Yup.string().required('Şifre Zorunludur'),
                        })}
                        >
                        {({
                            values,
                            handleChange,
                            errors,
                            isValid,
                            touched,
                            isSubmitting,
                            handleSubmit,
                            setFieldTouched
                        }) => (
                            <View>
                                <View style={style.form_item}>
                                    <Text style={style.form_title}>Name *</Text>
                                    <TextInput
                                        style={style.input}
                                        onChangeText={handleChange("name")}
                                        value={values.name}
                                        onBlur={() => setFieldTouched("name")}
                                    />
                                    { (errors.name && touched.name) && <Text style={{ padding:5,fontSize:13,marginTop:2,color:'red'}}>{errors.name}</Text>}
                                </View>
                                <View style={style.form_item}>
                                    <Text style={style.form_title}>Email *</Text>
                                    <TextInput
                                        onChangeText={handleChange("email")}
                                        value={values.email}
                                        onBlur={() => setFieldTouched("email")}
                                        style={style.input}
                                        keyboardType={"email-address"}
                                    />
                                    { (errors.email && touched.email) && <Text style={{ padding:5,fontSize:13,marginTop:2,color:'red'}}>{errors.email}</Text>}
                                </View>
                                <View style={style.form_item}>
                                    <Text style={style.form_title}>Password *</Text>
                                    <TextInput
                                        onChangeText={handleChange("password")}
                                        value={values.password}
                                        onBlur={() => setFieldTouched("password")}
                                        secureTextEntry={secure}
                                        style={style.input}/>
                                    <TouchableOpacity onPress={()=>this.setState({ secure: !secure})} style={style.password_eye}>
                                        <Icon size={25} color={"#9CA5B4"} name={(secure) ? "eye" : 'eye-slash'} />
                                    </TouchableOpacity>
                                    { (errors.password && touched.password) && <Text style={{ padding:5,fontSize:13,marginTop:2,color:'red'}}>{errors.password}</Text>}
                                </View>
                                <View style={style.form_item}>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                        style={style.button}>
                                        <Text style={style.color_white}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>

                    <View style={style.form_item}>
                        <View style={{ justifyContent:'center',alignItems:'center'}}>
                            <Text style={{ color:'#9CA5B4'}}>Already have an account?
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Login')}>
                                    <Text style={{ textDecorationLine:'underline',color:'#0071DF'}}>Log In</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
};

const style = StyleSheet.create({
    background:{
        backgroundColor:'#21252B',
        flex:1,
        paddingVertical:30,
        paddingHorizontal:20
    },
    menu:{
        marginTop: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    form:{
        marginTop:50
    },
    form_item:{
        marginBottom:20
    },
    input:{
        padding:15,
        borderWidth:1,
        borderColor:'#5E656F',
        borderRadius:5,
        color:'white'
    },
    form_title:{
        color:'#9CA5B4',
        marginBottom: 10,
    },
    button:{
        padding:20,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#03A87C'
    },
    color_white:{
        color:'white',
        fontWeight:'700'
    },
    password_eye:{
        position:'absolute',
        right:15,
        top:40
    }
});
