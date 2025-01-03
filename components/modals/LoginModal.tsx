'use client';

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGIN_APP_USER, GET_MEMBERSHIPS_SUBSCRIPTIONS } from "@/apollo/Queries";
import useAuthStore from '@/hooks/useAuthStore';
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

interface Subscription {
  _id: string;
  name: string;
  duration: number;
  durationType: string;
  freeTrial: boolean;
  startDate: string;
}

const LoginModal = () => {
  const router = useRouter();
  const client = useApolloClient();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const { login, setSubscription, setLastSubscriptionFetch } = useAuthStore();

  const [loginMutation] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_APP_USER,
    {
      onCompleted: async (data) => {
        if (data.loginAppUser.success) {
          console.log('Login successful!', data);

          const { token } = data.loginAppUser;
          localStorage.setItem("dalia.auth.login", token);
          login(token, { id: '', email: '' }); // Add user data if available

          // Fetch subscription directly after login
          try {
            const { data: subData } = await client.query({
              query: GET_MEMBERSHIPS_SUBSCRIPTIONS,
              fetchPolicy: 'network-only'
            });

            if (subData?.getMembershipSubscriptions?.length > 0) {
              const subscription = subData.getMembershipSubscriptions[0];
              console.log('User subscription:', subscription);
              setSubscription(subscription);
              setLastSubscriptionFetch(Date.now());
            } else {
              console.log('No subscription found');
              setSubscription(null);
            }
          } catch (error) {
            console.error('Error fetching subscription:', error);
          }

          loginModal.onClose();
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = useCallback((provider: 'google' | 'github') => {
    setIsLoading(true);
    console.log('sign in social')
  }, []);

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