"use client"

import axios from 'axios'
import React, { useState } from 'react'
import StyledButton from "@/components/StyledButton"


function Register() {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            email: values.email,
            password: values.password
        })

        console.log(res)

    }



    return (
        <form
            action=""
            onSubmit={handleSubmit}
            className="w-full max-w-[420px] px-2"
        >
            <h1 className="text-4xl font font-[500] text-black tracking-[4%]">Create an account</h1>
            <p className="mt-2 text-4 text-black font-[400]">Enter your details below</p>

            <div className="mt-6 flex flex-col gap-5">
                <FormInput
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                    autoComplete="name"
                />
                <FormInput
                    type="text"
                    name="email"
                    placeholder="Email or Phone Number"
                    value={values.email}
                    onChange={handleChange}
                    autoComplete="username"
                />
                <FormInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
            </div>

            <div className="text-center mt-6 flex flex-col items-center justify-between gap-4">
                <StyledButton
                    title='Create Account'
                    type="submit"
                    ClassName="w-full"
                />
                <StyledButton
                    title='sign up with google'
                    type="button"
                    ClassName="w-full border border-black bg-transparent text-black "
                />
                <p>

                    Forget Password?
                    <a href="#" className="w-full font-[600] ml-2.5 underline">
                        Login
                    </a>
                </p>
            </div>
        </form>
    )
}

export default Register


function FormInput({ type, name, placeholder, value, onChange, autoComplete }: {
    type: React.HTMLInputTypeAttribute,
    name: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    autoComplete?: string
}) {




    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className="h-10 w-full border-b border-[#c7c7c7] bg-transparent text-sm text-[#111] outline-none transition focus:border-[#111]"
        />
    )
}
