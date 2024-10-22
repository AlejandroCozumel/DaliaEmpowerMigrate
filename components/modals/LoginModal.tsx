'use client';

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN_APP_USER } from "@/apollo/Queries";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import Modal from "./Modal";
import Input from "@/components/ui/Input";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

interface LoginResponse {
  loginAppUser: {
    success: boolean;
    token: string;
    refreshToken: string;
  };
}

interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const [loginMutation] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_APP_USER,
    {
      onCompleted: (data) => {
        if (data.loginAppUser.success) {
          console.log('Login successful!', data);
          localStorage.setItem("dalia.auth.login", data.loginAppUser.token);
          loginModal.onClose();
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      await loginMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password
          }
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = useCallback((provider: 'google' | 'github') => {
    setIsLoading(true);
    console.log('sign in social')
  }, [loginModal, router]);

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome back"
        subtitle="Login to your account!"
      />
      <Input
        id="email"
        placeholder="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        placeholder="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4">
      <hr />
      <Button
        outline
        label="Continue with Google N/A"
        icon={FcGoogle}
        disabled={isLoading}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github N/A"
        icon={AiFillGithub}
        disabled={isLoading}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p>First time using DaliaEmpower?
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          > Create an account</span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;