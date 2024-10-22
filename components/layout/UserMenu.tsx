"use client";
import { useCallback, useState } from "react";
// import { signOut } from "next-auth/react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
// import useBeMentorModal from "@/hooks/useBeMentorModal";
import MenuItem from "./MenuItem";
import Avatar from "./Avatar";

const UserMenu = () => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  // const beMentorModal = useBeMentorModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // const onRent = useCallback(() => {
  //   if (!currentUser) {
  //     return loginModal.onOpen();
  //   }

  //   beMentorModal.onOpen();
  // }, [loginModal, beMentorModal, currentUser]);

  const handleClickLogin = () => {
    loginModal.onOpen();
    toggleOpen();
  };

  const handleClickRegister = () => {
    registerModal.onOpen();
    toggleOpen();
  };

  // const handleLogout = () => {
  //   signOut();
  //   toggleOpen();
  //   router.refresh();
  // };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* {currentUser?.isMentor === "true" && <div>You are a Mentor</div>} */}

        {/* {currentUser?.isMentor === "pending" && (
          <div
            className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer
                  "
          >
            Your application is pending
          </div>
        )} */}
          <div
            // onClick={onRent}
            className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer
                  "
          >
            Click
          </div>

        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px]
          border-neutral-200
          flex
          flex-row
          items-center
          gap-3
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src="" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute
            rounded-xl
            shadow-xl
            w-[40vw]
            md:w-full
            border-[0.5px]
          border-neutral-200
          bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
            z-20
          "
        >
          <div className="flex flex-col cursor-pointer">
            {/* {currentUser ? (
              <>
                <MenuItem
                  label="Mentorships"
                  onClick={() => router.push("/mentorships")}
                />
                <MenuItem
                  label="Favorites"
                  onClick={() => router.push("/favorites")}
                />
                <MenuItem
                  label="Reservations"
                  onClick={() => router.push("/reservations")}
                />
                <MenuItem label="Be a Mentor" onClick={beMentorModal.onOpen} />
                <hr />
                <MenuItem label="Logout" onClick={handleLogout} />
              </>
            ) : ( */}
              <>
                <MenuItem label="Login"
                onClick={handleClickLogin}
                 />
                <MenuItem label="Sign up"
                onClick={handleClickRegister}
                 />
              </>
            {/* )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
