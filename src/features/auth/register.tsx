import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {UserCircleIcon, EnvelopeIcon, KeyIcon} from '@heroicons/react/24/outline';

import { useRegisterMutation } from 'features/auth/api';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch } from 'react-redux';
import { addMessage } from 'features/messages/slice';
import { AppDispatch } from 'app/store';

interface iProps {}

type Form = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function Register(props: iProps) {
    const {t} = useTranslation(["auth", "form"]);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {register: registerForm, getValues, handleSubmit, formState: {errors}} = useForm<Form>();

    const [register] = useRegisterMutation();

    const onSubmit: SubmitHandler<Form> = async data => {
        await register({
            displayName: data.displayName,
            email: data.email,
            password: data.password,
        }).unwrap();

        dispatch(
            addMessage({
                type: "SUCCESS",
                detail: t("auth:register.messages.user-created-successfully")
            })
        )

        navigate("/");
    }

    return (
        <div className="rounded-md shadow-lg m-auto p-8">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="display-name" className="flex w-10">
                            <UserCircleIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="display-name"
                        type="text" 
                        className="flex-auto border-0 focus:ring-0" 
                        placeholder={t("auth:register.form.display-name")}
                        {...registerForm("displayName", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.display-name")})},
                            minLength: {value: 1, message: t("form:min-length", {field: t("auth:register.form.display-name"), count: 1})},
                            maxLength: {value: 20, message: t("form:max-length", {field: t("auth:register.form.display-name"), count: 20})}
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="displayName"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="email" className="flex w-10">
                            <EnvelopeIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="email"
                        type="email"
                        className="flex-auto border-0 focus:ring-0"
                        placeholder={t("auth:register.form.email")}
                        {...registerForm("email", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.email")})},
                            pattern: {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, message:t("form:email", {field: t("auth:register.form.email")})},
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="password" className="flex w-10">
                            <KeyIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="password"
                        type="password" 
                        className="flex-auto border-0 focus:ring-0"
                        placeholder={t("auth:register.form.password")}
                        {...registerForm("password", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.password")})},
                            minLength: {value: 8, message: t("form:min-length", {field: t("auth:login.form.password"), count: 8})},
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="confirm-password" className="flex w-10">
                            <KeyIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="confirm-password"
                        type="password"
                        className="flex-auto border-0 focus:ring-0" 
                        placeholder={t("auth:register.form.confirm-password")}
                        {...registerForm("confirmPassword", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.confirm-password")})},
                            validate: {
                                equalPassword: value => value !== getValues("password")? t("form:equal-field", {field: t("auth:register.form.confirm-password"), otherField: t("auth:register.form.password")}): true,
                            }
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="confirmPassword"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <input type="submit" className="px-2 py-1 rounded-md shadow-lg shadow-green-500/50 bg-green-500 text-white cursor-pointer hover:shadow-md hover:shadow-green-400/50 hover:bg-green-400 active:shadow-lg active:shadow-green-500/50 active:bg-green-500" value={t("register.submit-button")}/>
            
                <div>
                    <label>{t("register.login-instruction")}</label>

                    <Link to="/login" className="ml-1 text-blue-500 hover:text-blue-400 active:text-blue-500">{t("register.login-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;