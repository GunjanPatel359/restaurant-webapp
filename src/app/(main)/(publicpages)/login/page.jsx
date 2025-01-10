"use client"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { login } from "@/actions/user";

const LoginPage = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      console.log(res)
      if (res.data.success) {
        toast.success("Logged in successfully");
        router.push("/profile");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      {!loading ? (
        <div className="min-w-screen min-h-screen items-center justify-center flex">
          <div className="w-[470px] m-auto flex flex-col gap-3 shadow border py-[90px] border-color3">
            <h1 className="text-[30px] font-[600] text-color4 mx-auto">Login In</h1>
            <form
               onSubmit={handleSubmit((data, e) => {
                e.preventDefault(); 
                onSubmit(data);
              })}
              className="flex flex-col gap-4 justify-center mx-auto"
            >
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ ]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-[250px] px-4 py-6"
                />
              </div>

              <div className="relative">
                <Input
                  type={visible ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-[250px] pr-10 pl-4 py-6"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-[25%] cursor-pointer text-color5"
                    size={27}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-[25%] cursor-pointer text-color5"
                    size={27}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>

              <Button variant="default" type="submit">
                Login In
              </Button>
            </form>

            <div className="mx-auto w-[250px]">
              {errors.email && (
                <div className="text-red-500 text-[15px] overflow-y-auto text-justify">*
                  {errors.email.message}
                </div>
              )}
              {errors.password && (
                <div className="text-red-500 text-[15px] text-justify">*
                  {errors.password.message}
                </div>
              )}
            </div>

            <span className="text-[15px] mx-auto text-blue-700 underline" onClick={() => router.push('/sign-up')}>
              {`Don't have an Account?`}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LoginPage;
